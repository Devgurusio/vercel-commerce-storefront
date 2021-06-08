import { Product } from '@commerce/types/product'
import { OperationContext } from '@commerce/api/operations'
import { Provider, CommercetoolsConfig } from '../'
import getProductQuery from '../../utils/queries/get-product-query'

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
    const projection: {
      results: [{ id: string }]
    } = await config.storeApiFetch(
      `/product-projections?where=slug%28${locale}%3D%22${variables.slug}%22%29`
    )
    variables = { id: projection.results[0].id, locale: locale }
    //Query using GraphQL
    const { data } = await config.fetch(query, { variables })
    const product = data.product

    if (product) {
      return {
        product: {
          id: product.id,
          name: product.masterData.current.name,
          description: product.masterData.current.metaDescription,
          slug: product.masterData.current.slug,
          path: product.masterData.current.slug,
          images: product.masterData.current.masterVariant.images,
          variants: [],
          options: [],
          price: {
            value:
              product.masterData.current.masterVariant.prices[0].value
                .centAmount / 100,
            currencyCode:
              product.masterData.current.masterVariant.prices[0].value
                .currencyCode,
          },
          sku: product.masterData.current.masterVariant.sku,
        } as Product,
      }
    }

    return {}
  }

  return getProduct
}
