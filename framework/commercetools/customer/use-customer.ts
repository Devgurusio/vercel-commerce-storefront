import useCustomer, { UseCustomer } from '@commerce/customer/use-customer'
import type { CustomerHook } from '../types/customer'
import { SWRHook } from '@commerce/utils/types'
//import { getCustomerToken } from '../utils/customer-token'
import { loginMutation, dataLogin } from '../utils/mutations/log-in-mutation'

export default useCustomer as UseCustomer<typeof handler>

export const handler: SWRHook<CustomerHook> = {
  fetchOptions: {
    query: '',
  },

  async fetcher({ options, fetch }) {
    console.log(options)
    const data: any = await fetch<any, any>({
      ...options,
      query: loginMutation,
      variables: { dataLogin },
    })
    console.log('data1::', data)
    return data.customer
  },

  useHook:
    ({ useData }) =>
    (input) => {
      return useData({
        swrOptions: {
          revalidateOnFocus: false,
          ...input?.swrOptions,
        },
      })
    },
}
