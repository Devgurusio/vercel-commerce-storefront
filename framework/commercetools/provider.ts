import { Provider } from '@commerce'
import { handler as useCustomer } from './customer/use-customer'
import { handler as useSearch } from './product/use-search'
import { handler as useLogin } from './auth/use-login'
import { handler as useLogout } from './auth/use-logout'
import { handler as useSignup } from './auth/use-signup'
import fetcher from './fetcher'

// Export a provider with the CommerceHooks
export const commercetoolsProvider: Provider = {
  locale: 'en-us',
  cartCookie: 'session',
  fetcher,
  customer: { useCustomer },
  products: { useSearch },
  auth: { useLogin, useSignup, useLogout },
}

export type CommercetoolsProvider = typeof commercetoolsProvider
