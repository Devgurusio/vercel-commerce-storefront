import { Product } from '../../../commerce/types/product'
import { Provider, CommercetoolsConfig } from '../'
import { GetAllProductsQuery } from '../../schema'
import { normalizeProduct } from '../../lib/normalize'
import { searchAllProducts } from '../../lib/queries/search-all-products'
import { OperationContext } from '../../../commerce/api/operations'

export type ProductVariables = { first?: number }

export default function getAllProductsOperation({
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
    const variables = {
      input: {
        take: vars.first,
        groupByProduct: true,
      },
    }
    const data = await config.fetch<any>(query, {
      variables,
    })
    console.log('llegue acaaaa', JSON.stringify(data))
    return {
      products: data.products.results.map((item: any) =>
        normalizeProduct(item)
      ),
    }
  }

  return getAllProducts
}
