import type { RequestInit } from '@vercel/fetch'
import {
  CommerceAPI,
  CommerceAPIConfig,
  getCommerceApi as commerceApi,
} from '@commerce/api'
import fetchGraphqlApi from './utils/fetch-graphql-api'
import type { CartAPI } from './endpoints/cart'
import type { CustomerAPI } from './endpoints/customer'
import type { LoginAPI } from './endpoints/login'
import type { LogoutAPI } from './endpoints/logout'
import type { SignupAPI } from './endpoints/signup'
import type { ProductsAPI } from './endpoints/catalog/products'
import type { WishlistAPI } from './endpoints/wishlist'
import getAllProducts from './operations/get-all-products'

// import getAllProducts from './operations/get-all-products'

export interface CommercetoolsConfig extends CommerceAPIConfig {
  // Indicates if the returned metadata with translations should be applied to the
  // data or returned as it is
  projectKey: string
  clientId: string
  clientSecret: string
  host: string
  oauthHost: string
  concurrency: string | number
}

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || 'projectKey'
const CLIENT_ID = process.env.CTP_CLIENT_ID || 'projectKey'
const CLIENT_SECRET = process.env.CTP_CLIENT_SECRET || 'projectKey'
const AUTH_URL = process.env.CTP_AUTH_URL || 'projectKey'
const API_URL = process.env.CTP_API_URL || 'projectKey'
const CONCURRENCY = process.env.CTP_CONCURRENCY || 0

if (!API_URL) {
  throw new Error(
    `The environment variable CTP_API_URL is missing and it's required to access your store`
  )
}

if (!PROJECT_KEY) {
  throw new Error(
    `The environment variable CTP_PROJECT_KEY is missing and it's required to access your store`
  )
}

if (!AUTH_URL) {
  throw new Error(
    `The environment variables CTP_AUTH_URL have to be set in order to access your store`
  )
}

const ONE_DAY = 60 * 60 * 24

const config: CommercetoolsConfig = {
  commerceUrl: '',
  host: API_URL,
  projectKey: PROJECT_KEY,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  oauthHost: AUTH_URL,
  concurrency: CONCURRENCY,
  apiToken: '',
  cartCookie: '',
  cartCookieMaxAge: 0,
  customerCookie: '',
  // customerCookie: 'SHOP_TOKEN',
  // cartCookie: process.env.BIGCOMMERCE_CART_COOKIE ?? 'bc_cartId',
  // cartCookieMaxAge: ONE_DAY * 30,
  fetch: fetchGraphqlApi,
}

const operations = { getAllProducts }

export const provider = { config, operations }

export type Provider = typeof provider

export type APIs =
  | CartAPI
  | CustomerAPI
  | LoginAPI
  | LogoutAPI
  | SignupAPI
  | ProductsAPI
  | WishlistAPI

export type CommercetoolsAPI<P extends Provider = Provider> = CommerceAPI<P>

export function getCommerceApi<P extends Provider>(
  customProvider: P = provider as any
): CommercetoolsAPI<P> {
  return commerceApi(customProvider)
}
