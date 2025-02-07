import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { APP_NAME } from '@/lib/constants'
import SignInForm from './signin-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Sign In',
}

const SignIn = async (props: {
    searchParams: Promise<{ callbackUrl: string }>
}) => {
    const { callbackUrl } = await props.searchParams

    const session = await auth()
    if (session) {
        return redirect(callbackUrl || '/')
    }
    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-4">
                    <Link href={'/'} className="flex-center">
                        <Image
                            src="/images/logo.svg"
                            width={100}
                            height={100}
                            alt={`${APP_NAME} logo`}
                            priority={true}
                        ></Image>
                    </Link>
                    <CardTitle className="text-center">Sign in</CardTitle>
                    <CardDescription className="text-center">
                        Signin to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <SignInForm />{' '}
                </CardContent>
            </Card>
        </div>
    )
}

export default SignIn
