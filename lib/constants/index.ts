export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Superstore'
export const APP_DESC =
  process.env.NEXT_PUBLIC_APP_DESC ||
  'A modern e-commerce store built with next.js'

export const SERVER_URL =
  process.env.NEXT_SERVER_SERVER_URL || 'http://localhost:3000'

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4

export const signInDefaultValues = {
  email: '',
  password: '',
}

export const shippingAdressDefaultValues = {
  fullName: 'John Doe',
  streetAddress: '123 Main st',
  city: 'Anytown',
  postalCode: '12345',
  country: 'Sweden',
}
