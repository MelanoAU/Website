"use client"

// src/lib/auth.ts
//
// Single source of truth for the client-side auth state.
//
// Why this exists: every page that previously needed to know "is the
// user signed in?" wrote its own getSession() + onAuthStateChange
// scaffolding, and every one of those snippets could hang under the
// Supabase SDK's internal auth-lock — even reload + re-login wouldn't
// recover, only clearing cookies would. This module replaces all of
// that with a single module-scope state machine whose contract is:
//
//   - Reads localStorage directly on first import (synchronous, can't
//     hang) so already-signed-in users never see a loading flash.
//   - Confirms with supabase.auth.getSession() bounded by a 2s timeout.
//     If the SDK hangs, we fall back to whatever storage said.
//   - Subscribes to onAuthStateChange exactly once and broadcasts to
//     every subscribed hook.
//   - signOutAndClearStorage() forcibly clears every sb-* key, so even
//     a corrupted session can't trap the next sign-in attempt.
//
// Pages call useAuth() (read-only) or useRequireAuth() (auto-redirect
// to /login when unauthenticated). No more bespoke session probes.

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { getSupabase } from "@/lib/supabase/client"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""

/* ---------------------------------------------------------------- */
/*  Utility: timeout-bounded promise                                 */
/* ---------------------------------------------------------------- */

/**
 * Race a promise against a timeout, returning the fallback if the
 * timeout wins. Catches rejections too — we never bubble random SDK
 * errors into UI state, the contract is "tell me whether you got a
 * real answer in N ms, else assume the fallback".
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
): Promise<T> {
  return Promise.race([
    promise.catch(() => fallback),
    new Promise<T>((resolve) =>
      window.setTimeout(() => resolve(fallback), ms),
    ),
  ])
}

/* ---------------------------------------------------------------- */
/*  Direct localStorage probe                                        */
/* ---------------------------------------------------------------- */

function projectRef(): string | null {
  return SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? null
}

/**
 * Read whatever session the Supabase SDK persisted to localStorage,
 * synchronously and without acquiring any locks. Returns null if no
 * usable session is on disk.
 *
 * Handles both historic shapes:
 *   - { currentSession: { access_token, user, ... } }
 *   - { access_token, user, ... }
 */
function readSessionFromStorage(): Session | null {
  if (typeof window === "undefined") return null
  try {
    const ref = projectRef()
    if (!ref) return null
    const raw = window.localStorage.getItem(`sb-${ref}-auth-token`)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const candidate = parsed?.currentSession ?? parsed
    if (
      !candidate ||
      typeof candidate !== "object" ||
      !candidate.access_token ||
      !candidate.user
    ) {
      return null
    }
    if (
      typeof candidate.expires_at === "number" &&
      Date.now() >= candidate.expires_at * 1000
    ) {
      return null
    }
    return candidate as Session
  } catch {
    return null
  }
}

/** Force-clear every Supabase key for this project from localStorage. */
function clearStorage(): void {
  if (typeof window === "undefined") return
  try {
    const ref = projectRef()
    if (!ref) return
    const prefix = `sb-${ref}-`
    const toDelete: string[] = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith(prefix)) toDelete.push(k)
    }
    for (const k of toDelete) window.localStorage.removeItem(k)
  } catch {
    /* noop */
  }
}

/* ---------------------------------------------------------------- */
/*  Module-scope auth state singleton                                */
/* ---------------------------------------------------------------- */

export type AuthState =
  | { status: "loading"; user: null; session: null }
  | { status: "authenticated"; user: User; session: Session }
  | { status: "unauthenticated"; user: null; session: null }

function initialState(): AuthState {
  const session = readSessionFromStorage()
  if (session?.user) {
    return { status: "authenticated", user: session.user, session }
  }
  // Storage said nothing → loading until SDK confirms.
  return { status: "loading", user: null, session: null }
}

let cached: AuthState =
  typeof window === "undefined"
    ? { status: "loading", user: null, session: null }
    : initialState()

const listeners = new Set<(s: AuthState) => void>()
let initialized = false

function setState(next: AuthState): void {
  if (
    cached.status === next.status &&
    (cached.status !== "authenticated" ||
      (next.status === "authenticated" &&
        cached.user.id === next.user.id))
  ) {
    // No meaningful change — skip listener fan-out
    return
  }
  cached = next
  for (const fn of listeners) fn(next)
}

/**
 * One-shot initializer. Runs on the first hook mount in the browser:
 *   - SDK getSession() with 2s timeout (cross-tab freshness)
 *   - onAuthStateChange subscription (real-time updates)
 * Subsequent hook mounts just attach a listener.
 */
function initialize(): void {
  if (initialized || typeof window === "undefined") return
  initialized = true
  const supabase = getSupabase()

  // Backup probe: even if storage is empty, give the SDK 2s to weigh
  // in (could be doing a token refresh, could be a fresh tab). After
  // that we commit to the storage answer either way.
  withTimeout<Session | null>(
    supabase.auth.getSession().then((r) => r.data.session ?? null),
    2000,
    null,
  ).then((session: Session | null) => {
    if (session?.user) {
      setState({ status: "authenticated", user: session.user, session })
    } else if (cached.status === "loading") {
      setState({ status: "unauthenticated", user: null, session: null })
    } else if (cached.status === "authenticated") {
      // Storage thought we were signed in, SDK confirms we aren't.
      // Storage was stale — accept SDK's answer and clean up.
      clearStorage()
      setState({ status: "unauthenticated", user: null, session: null })
    }
  })

  // Real-time updates from the SDK. Skip INITIAL_SESSION because we've
  // already handled that path via getSession() above — re-handling it
  // here would only race with the timeout.
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION") return
    if (event === "SIGNED_OUT" || !session) {
      setState({ status: "unauthenticated", user: null, session: null })
      return
    }
    if (session.user) {
      setState({ status: "authenticated", user: session.user, session })
    }
  })
}

/* ---------------------------------------------------------------- */
/*  Public hooks                                                     */
/* ---------------------------------------------------------------- */

/**
 * Subscribe to the global auth state. Returns the current AuthState
 * and re-renders the calling component whenever it changes.
 *
 * Safe to call from any client component. Doesn't redirect — wrap
 * with useRequireAuth() for that.
 */
export function useAuth(): AuthState {
  const [state, setLocalState] = useState<AuthState>(cached)

  useEffect(() => {
    initialize()
    // Sync once in case the cache changed between render and effect
    setLocalState(cached)
    listeners.add(setLocalState)
    return () => {
      listeners.delete(setLocalState)
    }
  }, [])

  return state
}

/**
 * useAuth + redirect-on-unauthenticated. When the auth state resolves
 * to unauthenticated, replaces the current route with /login?next=...
 *
 * While loading, returns { status: "loading" } — render a spinner.
 * Once authenticated, returns the full user + session.
 */
export function useRequireAuth(redirectFrom?: string): AuthState {
  const router = useRouter()
  const state = useAuth()
  useEffect(() => {
    if (state.status !== "unauthenticated") return
    const next = redirectFrom
      ? `?next=${encodeURIComponent(redirectFrom)}`
      : ""
    router.replace(`/login${next}`)
  }, [state.status, router, redirectFrom])
  return state
}

/* ---------------------------------------------------------------- */
/*  Sign-out                                                         */
/* ---------------------------------------------------------------- */

/**
 * Sign out and aggressively clear local storage.
 *
 * Supabase's signOut() can hang under auth-lock pressure, so we race
 * it against a short timer and nuke every sb-* key by hand either
 * way. After this returns the user is signed out locally regardless
 * of whether the server got the message — they can immediately try
 * to sign in as someone else without a stale token getting in the
 * way. This is the recovery path for "I can't sign in, only clearing
 * cookies fixed it".
 */
export async function signOutAndClearStorage(): Promise<void> {
  const supabase = getSupabase()
  await withTimeout(
    supabase.auth.signOut({ scope: "local" }).then(() => undefined),
    1500,
    undefined,
  )
  clearStorage()
  setState({ status: "unauthenticated", user: null, session: null })
}

/* ---------------------------------------------------------------- */
/*  Internal — for callers that need to update the cache manually    */
/*  after writing to auth.users via an admin RPC (e.g. unlink phone).*/
/* ---------------------------------------------------------------- */

/**
 * Patch the in-memory user with a partial update without touching the
 * SDK. Useful for RPCs that change auth.users directly (where the SDK
 * doesn't know to refresh).
 */
export function patchCachedUser(patch: Partial<User>): void {
  if (cached.status !== "authenticated") return
  setState({
    status: "authenticated",
    user: { ...cached.user, ...patch },
    session: cached.session,
  })
}
