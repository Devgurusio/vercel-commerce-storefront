import { Product } from '@commerce/types/product'
import { OperationContext } from '@commerce/api/operations'
import { Provider, CommercetoolsConfig } from '@framework/api'
import { normalizeProduct } from '@framework/lib/normalize'

export default function getProductOperation({
  commerce,
}: OperationContext<Provider>) {
  async function getProduct({
    variables,
    config: cfg,
  }: {
    variables: {
      slug?: string
      path?: string
    }
    config?: Partial<CommercetoolsConfig>
    preview?: boolean
  }): Promise<Product | {} | any> {
    const config = commerce.getConfig(cfg)
    const locale = config.getLocale()

    const queryArg = {
      where: `slug(${locale}="${variables.slug}")`,
    }

    const projection = await config.fetchProducts(queryArg)

    const product = projection.body.results[0]
    if (product) {
      return { product: normalizeProduct(product, locale) }
    }

    return {}
  }

  return getProduct
}
