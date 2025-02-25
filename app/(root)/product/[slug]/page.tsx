import { getProductBySlug } from '@/lib/actions/product.actions'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ProductPrice from '@/components/shared/product/Product-price'
import ProductImages from '@/components/shared/product/Product-images'
import AddToCart from '@/components/shared/product/add-to-cart'
import { getMyCart } from '@/lib/actions/cart.action'

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await props.params
  const product = await getProductBySlug(slug)

  const cart = await getMyCart()

  if (!product) notFound()
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Img column */}
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          {/* Details column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {product.rating} of {product.numReviews} reviews
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* action column  */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <p>Price</p>
                  <ProductPrice value={Number(product.price)} />{' '}
                </div>
                <div className="flex justify-between mb-2">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out Of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductDetailsPage
