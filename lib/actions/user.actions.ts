'use server'
import { signIn, signOut } from '@/auth'
import { signInFormSchema, signUpFormSchema } from '@/lib/validators'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { hashSync } from 'bcrypt-ts-edge'
import { prisma } from '@/db/prisma'
import { formatError } from '@/lib/utils'

// sign in user with credientals
export async function signInWithCredientials(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData
) {
    try {
        // validate form data
        const user = signInFormSchema.parse({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        })
        // sign in user
        await signIn('credentials', user)
        return { success: true, message: 'Sign in successful' }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return { success: false, message: 'invalid email or password' }
    }
}

export async function signOutUser() {
    await signOut()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signUpUser(prevState: any, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        })

        const plainPassword = user.password
        // hash password
        user.password = hashSync(user.password, 10)
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            },
        })

        await signIn('credentials', {
            email: user.email,
            password: plainPassword,
        })
        return { success: true, message: 'User signed up succesfully' }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return { success: false, message: formatError(error) }
    }
}
