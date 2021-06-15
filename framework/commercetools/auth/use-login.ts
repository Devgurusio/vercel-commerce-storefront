import { useCallback } from 'react'
import { MutationHook } from '@commerce/utils/types'
import useLogin, { UseLogin } from '@commerce/auth/use-login'
import { CommerceError } from '@commerce/utils/errors'
import { loginMutation } from '../utils/mutations/log-in-mutation'
import { setCustomerToken } from '../utils/customer-token'

export default useLogin as UseLogin<typeof handler>

export const handler: MutationHook<any> = {
  fetchOptions: {
    query: '',
  },
  async fetcher({ input: { email, password }, options, fetch }) {
    if (!(email && password)) {
      throw new CommerceError({
        message: 'An email and password are required to login',
      })
    }

    const data = {
      data: {
        email,
        password,
      },
    }

    const dataLogin = await fetch({
      ...options,
      query: loginMutation,
      variables: { data },
    })

    if (dataLogin.body.errors == null) {
      setCustomerToken(data.data['email'])
    }

    return dataLogin
  },
  useHook:
    ({ fetch }) =>
    () => {
      return useCallback(
        async function login(input) {
          const data = await fetch({ input })
          console.log('data::::', data)
          return data
        },
        [fetch]
      )
    },
}
