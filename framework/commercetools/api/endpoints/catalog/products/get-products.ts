import { ProductsEndpoint } from '.'
import { normalizeProduct } from '@framework/lib/normalize'

const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  res,
  body: { search, categoryId, brandId, sort },
  config,
}) => {
  const queries: string[] = []
  const isSearch = true
  if (search) {
    queries.push(`name.en: "${search}"`)
  }
  if (categoryId) {
    queries.push(`categories.id: "${categoryId}"`)
  }
  if (brandId) {
    queries.push(`variants.attributes.designer.key: "${brandId}"`)
  }
  let sorting
  if (sort) {
    switch (sort) {
      case 'price-asc':
        sorting = 'price asc'
        break
      case 'price-desc':
        sorting = 'price desc'
        break
      case 'latest-desc':
      default:
        sorting = 'lastModifiedAt desc'
        break
    }
  }

  const query = {
    filter: queries,
    sort: sorting,
  }

  const data = await config.fetchProducts(query, isSearch)
  const products = data.body.results

  res.status(200).json({
    data: {
      found: data.body.total > 0,
      products: products.map((item) => normalizeProduct(item)),
    },
  })
}

export default getProducts
