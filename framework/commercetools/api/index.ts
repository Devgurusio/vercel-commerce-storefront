import type { RequestInit } from '@vercel/fetch'
import {
  CommerceAPI,
  CommerceAPIConfig,
  getCommerceApi as commerceApi,
  GraphQLFetcherResult,
  CommerceAPIFetchOptions,
} from '@commerce/api'
import fetchGraphql from './utils/fetch-graphql-api'
import fetchProducts from './utils/fetch-products'
import getProduct from './operations/get-product'
import getAllProducts from './operations/get-all-products'
import getAllProductPaths from './operations/get-all-product-paths'
import getPage from './operations/get-page'
import getAllPages from './operations/get-all-pages'
import login from './operations/login'
import getCustomerWishlist from './operations/get-customer-wishlist'
import getSiteInfo from './operations/get-site-info'

export interface CommercetoolsConfig extends CommerceAPIConfig {
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
  fetch: fetchGraphql,
  fetchProducts: fetchProducts,
}

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

export const provider = { config, operations }

export type Provider = typeof provider

export type CommercetoolsAPI<P extends Provider = Provider> = CommerceAPI<P>

export function getCommerceApi<P extends Provider>(
  customProvider: P = provider as any
): CommercetoolsAPI<P> {
  return commerceApi(customProvider)
}
