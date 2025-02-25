import { SWRHook } from '@commerce/utils/types'
import useSearch, { UseSearch } from '@commerce/product/use-search'
import { Product } from '@commerce/types/product'
import type { SearchProductsHook } from '../../commerce/types/product'

export default useSearch as UseSearch<typeof handler>

export type SearchProductsInput = {
  search?: string
  categoryId?: string
  brandId?: string
  sort?: string
  locale?: string
}

export type SearchProductsData = {
  products: Product[]
  found: boolean
}

export const handler: SWRHook<SearchProductsHook> = {
  fetchOptions: {
    url: 'api/catalog/products',
    method: 'GET',
  },
  async fetcher({ input, options, fetch }) {
    const { search, categoryId, brandId, sort, locale } = input
    const url = new URL(options.url!, 'http://a')

    if (search) url.searchParams.set('search', search)
    if (categoryId) url.searchParams.set('categoryId', String(categoryId))
    if (brandId) url.searchParams.set('brandId', String(brandId))
    if (sort) url.searchParams.set('sort', sort)
    if (locale) url.searchParams.set('locale', locale)

    return await fetch({
      url: url.pathname + url.search,
      method: options.method,
    })
  },
  useHook: ({ useData }) => (input = {}) => {
    return useData({
      input: [
        ['search', input.search],
        ['categoryId', input.categoryId],
        ['brandId', input.brandId],
        ['sort', input.sort],
        ['locale', input.locale],
      ],
      swrOptions: {
        revalidateOnFocus: false,
        ...input.swrOptions,
      },
    })
  },
}
