import type { RequestInit } from '@vercel/fetch'
import {
  CommerceAPI,
  CommerceAPIConfig,
  getCommerceApi as commerceApi,
} from '@commerce/api'
import fetchGraphqlApi from './utils/fetch-graphql-api'
import fetchStoreApi from './utils/fetch-store-api'

import getProduct from './operations/get-product'
import getAllProducts from './operations/get-all-products'
import getAllProductPaths from './operations/get-all-product-paths'
import getPage from './operations/get-page'
import getAllPages from './operations/get-all-pages'
import login from './operations/login'
import getCustomerWishlist from './operations/get-customer-wishlist'
import getSiteInfo from './operations/get-site-info'

export interface CommercetoolsConfig extends CommerceAPIConfig {
  applyLocale?: boolean
  projectKey: string
  clientSecret: string
  clientId: string
  authUrl: string
  apiUrl: string
  scopes: string
  storeApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T>
}

const PROJECT_KEY = process.env.CTP_PROJECT_KEY
const CLIENT_SECRET = process.env.CTP_CLIENT_SECRET
const CLIENT_ID = process.env.CTP_CLIENT_ID
const AUTH_URL = process.env.CTP_AUTH_URL
const API_URL = process.env.CTP_API_URL
const COMMERCE_URL = process.env.CTP_GRAPHQL_URL
const SCOPES = process.env.CTP_SCOPES
const ACCESS_TOKEN = process.env.CTP_ACCESS_TOKEN

if (!API_URL) {
  throw new Error(
    `The environment variable CTP_API_URL is missing and it's required`
  )
}

if (!AUTH_URL) {
  throw new Error(
    `The environment variable CTP_AUTH_URL is missing and it's required`
  )
}

if (!COMMERCE_URL) {
  throw new Error(
    `The environment variable CTP_GRAPHQL_URL is missing and it's required`
  )
}

if (!ACCESS_TOKEN) {
  throw new Error(
    `The environment variable CTP_ACCESS_TOKEN is missing and it's required`
  )
}

if (!(PROJECT_KEY && CLIENT_ID && CLIENT_SECRET && SCOPES)) {
  throw new Error(
    `The environment variables CTP_PROJECT_KEY, CTP_CLIENT_ID, CTP_CLIENT_SECRET and CTP_SCOPES have to be set`
  )
}

const config: CommercetoolsConfig = {
  applyLocale: false,
  projectKey: PROJECT_KEY,
  clientSecret: CLIENT_SECRET,
  clientId: CLIENT_ID,
  authUrl: AUTH_URL,
  apiUrl: API_URL,
  scopes: SCOPES,
  commerceUrl: COMMERCE_URL,
  apiToken: ACCESS_TOKEN,
  cartCookie: '',
  cartCookieMaxAge: 60 * 60 * 24 * 30,
  fetch: fetchGraphqlApi,
  customerCookie: '',
  storeApiFetch: fetchStoreApi,
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
