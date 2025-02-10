'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import { signUpUser } from '@/lib/actions/user.actions'
import Link from 'next/link'

const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser, {
        success: false,
        message: '',
    })
    const SignUpButton = () => {
        const { pending } = useFormStatus()
        return (
            <Button className="w-full" variant="default" disabled={pending}>
                {pending ? 'Submitting...' : 'Sign up'}
            </Button>
        )
    }
    return (
        <form action={action}>
            {/* <input type="hidden" name="callbackUrl" value={callbackUrl} /> */}
            <div className="space-y-6">
                <div>
                    <Label htmlFor="Name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        defaultValue=""
                    />
                </div>
                <div>
                    <Label htmlFor="Email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        defaultValue=""
                    />
                </div>
                <div>
                    <Label htmlFor="Password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="password"
                        defaultValue=""
                    />
                </div>
                <div>
                    <Label htmlFor="ConfirmPassword">Confirm password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        autoComplete="confirmPassword"
                        defaultValue=""
                    />
                </div>
                <div>
                    <SignUpButton />
                </div>
                {data && !data.success && (
                    <div className="text-center text-destructive">
                        {data.message}
                    </div>
                )}
                <div className="text-sm text-center text-muted-foreground">
                    Already have an account?
                    <Link href="/sign-in" target="_Self" className="link pl-1">
                        Sign in
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default SignUpForm
