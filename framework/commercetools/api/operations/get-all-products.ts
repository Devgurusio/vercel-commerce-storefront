import { Product } from '@commerce/types/product'
import { Provider, CommercetoolsConfig } from '../'
import { normalizeProduct } from '../../lib/normalize'
import { OperationContext } from '@commerce/api/operations'

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
    query,
    variables: { ...vars } = {},
    config: cfg,
  }: {
    query?: string
    variables?: ProductVariables
    config?: Partial<CommercetoolsConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] | any[] }> {
    const config = commerce.getConfig(cfg)
    const data: any = await config.fetchProducts()

    const prods = data.body.results.map((prod: any) => normalizeProduct(prod))

    return {
      products: prods,
    }
  }

  return getAllProducts
}
