import type { ServerResponse } from 'http'
import type {
  OperationContext,
  OperationOptions,
} from '@commerce/api/operations'
import type { LoginOperation } from '../../types/login'
import { Provider, CommercetoolsConfig } from '..'
import { loginMutation } from '../../utils/mutations/log-in-mutation'
const jwt = require('jwt-simple')
import getCookie from '../utils/get-cookie'

export default function loginOperation({
  commerce,
}: OperationContext<Provider>) {
  async function login<T extends LoginOperation>(opts: {
    variables: T['variables']
    config?: Partial<CommercetoolsConfig>
    res: ServerResponse
  }): Promise<T['data']>

  async function login<T extends LoginOperation>(
    opts: {
      variables: T['variables']
      config?: Partial<CommercetoolsConfig>
      res: ServerResponse
    } & OperationOptions
  ): Promise<T['data']>

  async function login<T extends LoginOperation>({
    query = loginMutation,
    variables,
    config: cfg,
    res: response,
  }: {
    query?: string
    variables: T['variables']
    res: ServerResponse
    config?: Partial<CommercetoolsConfig>
  }): Promise<T['data']> {
    const config = commerce.getConfig(cfg)

    const { data } = await config.fetch<any>(query, {
      variables,
    })

    if (data) {
      const customerToken = jwt.encode(
        data.customerSignIn.customer.id,
        process.env.SECRET_KEY
      )
      response.setHeader(
        'Set-Cookie',
        getCookie(config.customerCookie, customerToken, config.cookieMaxAge)
      )
      return { result: data.customerSignIn.customer.id }
    } else {
      return {}
    }
  }
  return login
}
