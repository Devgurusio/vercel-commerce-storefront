import type { RequestInit } from '@vercel/fetch'
import {
  CommerceAPI,
  CommerceAPIConfig,
  getCommerceApi as commerceApi,
  GraphQLFetcherResult,
  CommerceAPIFetchOptions,
} from '@commerce/api'
import fetchGraphql from './utils/fetch-graphql-api'
import fetchStoreApi from './utils/fetch-store-api'
import fetchProducts from './utils/fetch-products'
import getProduct from './operations/get-product'
import getAllProducts from './operations/get-all-products'
import getAllProductPaths from './operations/get-all-product-paths'
import getPage from './operations/get-page'
import getAllPages from './operations/get-all-pages'
import login from './operations/login'
import getCustomerWishlist from './operations/get-customer-wishlist'
import getSiteInfo from './operations/get-site-info'
import type { LoginAPI } from './endpoints/login'
import type { CustomerAPI } from './endpoints/customer'

// export interface CommercetoolsConfig extends CommerceAPIConfig {
//   applyLocale?: boolean
//   projectKey: string
//   clientSecret: string
//   clientId: string
//   authUrl: string
//   apiUrl: string
//   scopes: string
//   storeApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T>
// }

export interface CommercetoolsConfig extends CommerceAPIConfig {
  // Indicates if the returned metadata with translations should be applied to the
  // data or returned as it is
  projectKey: string
  clientId: string
  clientSecret: string
  host: string
  oauthHost: string
  concurrency: string | number
  fetch<Data = any, Variables = any>(
    query: string,
    queryData?: CommerceAPIFetchOptions<Variables>,
    fetchOptions?: RequestInit
  ): Promise<GraphQLFetcherResult<Data>>
  fetchProducts: typeof fetchProducts
}

export interface CommercetoolsConfig extends CommerceAPIConfig {
  // Indicates if the returned metadata with translations should be applied to the
  // data or returned as it is
  projectKey: string
  clientId: string
  clientSecret: string
  host: string
  oauthHost: string
  concurrency: string | number
  fetch<Data = any, Variables = any>(
    query: string,
    queryData?: CommerceAPIFetchOptions<Variables>,
    fetchOptions?: RequestInit
  ): Promise<GraphQLFetcherResult<Data>>
  fetchProducts: typeof fetchProducts
}

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || 'projectKey'
const CLIENT_ID = process.env.CTP_CLIENT_ID || 'projectKey'
const CLIENT_SECRET = process.env.CTP_CLIENT_SECRET || 'projectKey'
const AUTH_URL = process.env.CTP_AUTH_URL || 'projectKey'
const API_URL = process.env.CTP_API_URL || 'projectKey'
const CONCURRENCY = process.env.CTP_CONCURRENCY || 0
const CUSTOMER_COOKIE_NAME = process.env.CTP_CUSTOMER_COOKIE || 'projectKey'

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
  customerCookie: CUSTOMER_COOKIE_NAME,
  // customerCookie: 'SHOP_TOKEN',
  // cartCookie: process.env.BIGCOMMERCE_CART_COOKIE ?? 'bc_cartId',
  // cartCookieMaxAge: ONE_DAY * 30,
  fetch: fetchGraphql,
  fetchProducts: fetchProducts,
}

// const config: CommercetoolsConfig = {
//   applyLocale: false,
//   projectKey: PROJECT_KEY,
//   clientSecret: CLIENT_SECRET,
//   clientId: CLIENT_ID,
//   authUrl: AUTH_URL,
//   apiUrl: API_URL,
//   scopes: SCOPES,
//   commerceUrl: COMMERCE_URL,
//   apiToken: ACCESS_TOKEN,
//   cartCookie: '',
//   cartCookieMaxAge: 60 * 60 * 24 * 30,
//   fetch: fetchGraphqlApi,
//   customerCookie: '',
//   storeApiFetch: fetchStoreApi,
// }

const operations = {
  getAllPages,
  getPage,
  getAllProductPaths,
  getAllProducts,
  getProduct,
  getSiteInfo,
  getCustomerWishlist,
  login,
}

export type APIs = LoginAPI | CustomerAPI

export const provider = { config, operations }

export type Provider = typeof provider

export type CommercetoolsAPI<P extends Provider = Provider> = CommerceAPI<P>

export function getCommerceApi<P extends Provider>(
  customProvider: P = provider as any
): CommercetoolsAPI<P> {
  return commerceApi(customProvider)
}
