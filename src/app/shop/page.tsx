import { fetchActiveProducts } from "@/lib/products"
import ShopClient from "./shop-client"

export default async function ShopPage() {
  const products = await fetchActiveProducts()
  return <ShopClient products={products} />
}
