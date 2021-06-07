import fetcher from './fetcher'
export const commercetoolsProvider = {
  locale: 'en-us',
  cartCookie: 'ct_cartId',
  fetcher,
  products: {},
}

export type CommercetoolsProvider = typeof commercetoolsProvider
