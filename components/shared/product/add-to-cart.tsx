'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Plus, Minus, Loader } from 'lucide-react'
import { Cart, CartItem } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { AddItemToCart, removeItemFromCart } from '@/lib/actions/cart.action'
import { useTransition } from 'react'

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await AddItemToCart(item)

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
        return
      }

      // handle success add to cart
      toast({
        description: res.message,
        action: (
          <ToastAction
            className="bg-primary text-white hover:bg-gray-800 "
            altText="Go To Cart"
            onClick={() => router.push('/cart')}
          >
            Go to cart
          </ToastAction>
        ),
      })
    })
  }
  // handle remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId)

      toast({
        variant: res.success ? 'default' : 'destructive',
        description: res.message,
      })
      return
    })
  }
  //   Check if items is in the cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId)
  return existItem ? (
    <div>
      <Button variant="outline" type="button" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button variant="outline" type="button" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}{' '}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      Add to cart
    </Button>
  )
}

export default AddToCart
