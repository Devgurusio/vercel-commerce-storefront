import type { ServerResponse } from 'http'
import type {
  OperationContext,
  OperationOptions,
} from '@commerce/api/operations'
import { Provider, CommercetoolsConfig } from '..'
import { loginMutation } from 'framework/bigcommerce/api/operations/login'

export default function loginOperation({
  commerce,
}: OperationContext<Provider>) {
  async function login<T extends { variables: any; data: any }>(opts: {
    variables: T['variables']
    config?: Partial<CommercetoolsConfig>
    res: ServerResponse
  }): Promise<T['data']>

  async function login<T extends { variables: any; data: any }>(
    opts: {
      variables: T['variables']
      config?: Partial<CommercetoolsConfig>
      res: ServerResponse
    } & OperationOptions
  ): Promise<T['data']>

  async function login<T extends { variables: any; data: any }>({
    query = loginMutation,
    variables,
    res: response,
    config: cfg,
  }: {
    query?: string
    variables: T['variables']
    res: ServerResponse
    config?: Partial<CommercetoolsConfig>
  }): Promise<T['data']> {
    const config = commerce.getConfig(cfg)
    const data = await config.fetch(query, { variables })
    console.log(data)
    return {
      result: data,
    }
  }

  return login
}
