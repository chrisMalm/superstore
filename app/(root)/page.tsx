import { Metadata } from 'next'
import ProductList from '@/components/shared/product/ProductList'
import { getLatestProducts } from '@/lib/actions/product.actions'

export const metadata: Metadata = {
  title: 'Home',
}

const HomePage = async () => {
  const latestProducts = await getLatestProducts()
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
    </>
  )
}
export default HomePage
