import { Provider } from '@commerce'
// import { handler as useCart } from './cart/use-cart'
// import { handler as useAddItem } from './cart/use-add-item'
// import { handler as useUpdateItem } from './cart/use-update-item'
// import { handler as useRemoveItem } from './cart/use-remove-item'
import { handler as useCustomer } from './customer/use-customer'
import { handler as useSearch } from './product/use-search'
import { handler as useLogin } from './auth/use-login'
// import { handler as useLogout } from './auth/use-logout'
import { handler as useSignup } from './auth/use-signup'
import fetcher from './fetcher'

// Export a provider with the CommerceHooks
export const commercetoolsProvider: Provider = {
  locale: 'en-us',
  cartCookie: 'session',
  fetcher,
  // cart: { useCart, useAddItem, useUpdateItem, useRemoveItem },
  customer: { useCustomer },
  products: { useSearch },
  auth: { useLogin, useSignup }, // useLogout
}

export type CommercetoolsProvider = typeof commercetoolsProvider
