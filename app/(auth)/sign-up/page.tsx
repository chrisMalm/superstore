import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'
import Link from 'next/link'
import SignUpForm from './signup-form'
import Image from 'next/image'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Sign Up',
}

const Signup = async (props: {
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
                    <CardTitle className="text-center">Sign Up</CardTitle>
                    <CardDescription className="text-center">
                        Enter your information below to signup{' '}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <SignUpForm />{' '}
                </CardContent>
            </Card>
        </div>
    )
}

export default Signup
