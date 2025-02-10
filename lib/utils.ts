import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
// convert a prisma object to regular JS object

export function prismaToJs<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
}

// Format number and decimal places here
export function formatNumberWithDecimal(num: number): string {
    const [int, decimal] = num.toString().split('.')
    return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
    if (error.name === 'ZodError') {
        const fieldErrors = Object.keys(error.errors).map(
            (field) => error.errors[field].message
        )

        return fieldErrors.join('. ')
    } else if (
        error.name === 'PrismaClientKnownRequestError' &&
        error.code === 'P2002'
    ) {
        const field = error.meta?.target ? error.meta.target[0] : 'Field'
        return `${
            field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`
    } else {
        return typeof error.message === 'string'
            ? error.message
            : JSON.stringify(error.message)
    }
}
