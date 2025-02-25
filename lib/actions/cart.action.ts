'use server'
import { CartItem } from '@/types'
import { cookies } from 'next/headers'
import { formatError, prismaToJs, round2 } from '../utils'
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { cartItemSchema, insertCartSchema } from '../validators'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(shippingPrice + taxPrice + itemsPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}
export async function AddItemToCart(data: CartItem) {
  try {
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart session nor found')

    // Get session and user iD
    const session = await auth()
    const userId = session?.user?.id ? (session.user.id as string) : undefined

    // get Cart, undefined if no cart exists
    const cart = await getMyCart()

    // parse and valitate item
    const item = cartItemSchema.parse(data)

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    })

    if (!product) throw new Error('Product not found')

    if (!cart) {
      // create a new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      })

      // add to db
      await prisma.cart.create({
        data: newCart,
      })

      //   revalidate product page
      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: `${product.name} added to cart`,
      }
    } else {
      // cart exist and then check if item already exists in db
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      )
      if (existItem) {
        // check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error('Not enough stock')
        }
        // Increase quantity
        ;(cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1
      } else {
        // if items does not exists in the cart
        // check stock
        if (product.stock < 1) throw new Error('not enough stock')

        // Add item to the cart.items
        cart.items.push(item)
      }
      //   Save to db
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      })
      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: `${product.name} ${
          existItem ? 'updated in' : 'added to'
        } cart`,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getMyCart() {
  // Check for the cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value
  if (!sessionCartId) throw new Error('Cart session nor found')

  // Get session and user iD
  const session = await auth()
  const userId = session?.user?.id ? (session.user.id as string) : undefined

  //   get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  })
  if (!cart) return undefined

  //   Convert decimals and return
  return prismaToJs({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}

// Remove item from cart
export async function removeItemFromCart(productId: string) {
  try {
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart session nor found')
    // get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    })
    if (!product) throw new Error('Product not found')
    // Get user cart
    const cart = await getMyCart()
    if (!cart) throw new Error('No cart in db')

    // Check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    )
    if (!exist) throw new Error('Item not found')

    // Check if only one in qty
    if (exist.qty === 1) {
      // Remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      )
    } else {
      // decrease from qty
      ;(cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1
    }

    // update cart in db
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    })
    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: `${product.name} was removed from the cart`,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
