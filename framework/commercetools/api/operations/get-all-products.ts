import { Product } from '../../../commerce/types/product'
import { Provider, CommercetoolsConfig } from '../'
import Commercetools from '../../utils/commercetools'
import { normalizeProduct } from '../../lib/normalize'
import { searchAllProducts } from '../../lib/queries/search-all-products'
import { OperationContext } from '../../../commerce/api/operations'

export type ProductVariables = { first?: number }

export default function getAllProducts({
  commerce,
}: OperationContext<Provider>) {
  async function getAllProducts(opts?: {
    variables?: ProductVariables
    config?: Partial<CommercetoolsConfig>
    preview?: boolean
  }): Promise<{ products: Product[] }>

  async function getAllProducts({
    query = searchAllProducts,
    variables: { ...vars } = {},
    config: cfg,
  }: {
    query?: string
    variables?: ProductVariables
    config?: Partial<CommercetoolsConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] | any[] }> {
    const config = commerce.getConfig(cfg)
    const commercetools = Commercetools({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      projectKey: config.projectKey,
      host: config.host,
      oauthHost: config.oauthHost,
      concurrency: config.concurrency,
    })
    const { requestExecute } = commercetools
    try {
      const data = await requestExecute
        .productProjections()
        .get({
          queryArgs: {
            limit: 1,
          },
        })
        .execute()
      console.log('dataaa', JSON.stringify(data))
      const result = {
        products: data.body.results.map((item: any) => normalizeProduct(item)),
      }

      console.log('resuuult', JSON.stringify(result))
      return result
    } catch (err) {
      throw err
    }
  }

  return getAllProducts
}
