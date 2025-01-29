import { LATEST_PRODUCTS_LIMIT } from '../constants'
import { prismaToJs } from '../utils'
import { prisma } from '@/db/prisma'

export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: {
            createdAt: 'desc',
        },
    })
    console.log(typeof data[0].rating, 'data')

    return prismaToJs(data)
}

// get single product by slug

export async function getProductBySlug(slug: string) {
    const data = await prisma.product.findFirst({
        where: {
            slug,
        },
    })
    return prismaToJs(data)
}
