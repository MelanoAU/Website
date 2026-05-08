import { fetchActiveProducts } from "@/lib/products"
import ShopClient from "./shop-client"

export const revalidate = 60

export default async function ShopPage() {
  const products = await fetchActiveProducts()
  return <ShopClient products={products} />
}
