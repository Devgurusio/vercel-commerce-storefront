import { Product } from '@commerce/types/product'
import { OperationContext } from '@commerce/api/operations'
import { Provider, CommercetoolsConfig } from '../'
import getProductQuery from '../../utils/queries/get-product-query'
import { normalizeProduct } from '../../lib/normalize'

export default function getProductOperation({
  commerce,
}: OperationContext<Provider>) {
  async function getProduct({
    query = getProductQuery,
    variables,
    config: cfg,
  }: {
    query?: string
    variables: {
      slug?: string
      id?: string
      locale?: string
    }
    config?: Partial<CommercetoolsConfig>
    preview?: boolean
  }): Promise<Product | {} | any> {
    const config = commerce.getConfig(cfg)

    const locale = config.locale?.split('-')[0]
    //Query the id
    const queryArg = {
      limit: 20,
      where: `slug(en="${variables.slug}")`,
    }
    const projection = await config.fetchProducts(queryArg)
    const product = projection.body.results[0]

    if (product) {
      return { product: normalizeProduct(product) }
    }

    return {}
  }

  return getProduct
}
