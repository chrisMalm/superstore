import { z } from 'zod'
import { formatNumberWithDecimal } from './utils'

// Schema for inserting products

const currency = z
    .string()
    .refine(
        (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val))),
        { message: 'Price must have exactly two decimal places' }
    )
export const insertProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    slug: z.string().min(3, 'Slug must be at least 3 characters long'),
    category: z.string().min(3, 'Category must be at least 3 characters long'),
    brand: z.string().min(3, 'Brand must be at least 3 characters long'),
    description: z
        .string()
        .min(3, 'Description must be at least 3 characters long'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
})

export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

// Schema for signing up a user account
export const signUpFormSchema = z
    .object({
        name: z.string().min(3, 'Name must be at least 3 characters long'),
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long'),
        confirmPassword: z
            .string()
            .min(6, 'Confirm password must be at least 6 characters long'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
