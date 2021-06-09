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
    // {
    // return {
    //   id: prod.id,
    //   name: prod.name.en,
    //   description: prod.metaDescription
    //     ? prod.metaDescription.en
    //     : 'No Description',
    //   slug: prod.slug.en,
    //   path: prod.slug.en,
    //   images: prod.masterVariant.images,
    //   variants: [],
    //   options: [],
    //   price: {
    //     value: prod.masterVariant.prices[0].value.centAmount / 100,
    //     currencyCode: prod.masterVariant.prices[0].value.currencyCode,
    //   },
    //   sku: prod.masterVariant.sku,
    // }
    // })
    return {
      products: prods,
    }
  }

  return getAllProducts
}
