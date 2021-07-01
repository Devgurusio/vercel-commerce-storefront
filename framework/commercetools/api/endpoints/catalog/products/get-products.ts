import { ProductsEndpoint } from '.'
import { normalizeProduct } from '@framework/lib/normalize'

const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  res,
  body: { search, categoryId, brandId, sort, locale },
  config,
}) => {
  const queries: string[] = []
  const isSearch = true

  if (categoryId) {
    queries.push(`categories.id: "${categoryId}"`)
  }
  if (brandId) {
    queries.push(`variants.attributes.designer.key: "${brandId}"`)
  }
  let sorting
  if (sort) {
    sorting = getSortingValue(sort)
  }
  let currentLocale = 'en'
  if (locale) {
    currentLocale = getLocale(locale)
  }
  if (search) {
    queries.push(`name.${currentLocale}: "${search}"`)
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
      products: products.map((item) => normalizeProduct(item, currentLocale)),
    },
  })
}

function getSortingValue(sort: string): string {
  switch (sort) {
    case 'price-asc':
      return 'price asc'
    case 'price-desc':
      return 'price desc'
    case 'latest-desc':
    default:
      return 'lastModifiedAt desc'
  }
}

function getLocale(locale: string): string {
  if (locale.indexOf('-') != -1) {
    return locale.split('-')[0]
  }
  return locale
}

export default getProducts
