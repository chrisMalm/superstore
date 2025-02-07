'use server'
import { signIn, signOut } from '@/auth'
import { signInFormSchema } from '@/lib/validators'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

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
