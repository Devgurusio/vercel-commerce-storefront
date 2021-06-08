import type {
  CommercetoolsProducts,
  CommerceToolsProductPrice,
  Product,
  ProductVariant,
  ProductData,
  MasterData,
  ProductPrice,
  Images,
  ProductImage,
} from '../types/product'
import type {
  Cart,
  CommercetoolsCart,
  CommercetoolsLineItems,
  LineItem,
} from '../types/cart'
import type { Page } from '../types/page'
import type { BCCategory, Category } from '../types/site'
import { definitions } from '../api/definitions/store-content'

import getSlug from './get-slug'
import { privateDecrypt } from 'crypto'

// function normalizeProductOption(productOption: any) {
//   const {
//     node: {
//       entityId,
//       values: { edges },
//       ...rest
//     },
//   } = productOption

//   return {
//     id: entityId,
//     values: edges?.map(({ node }: any) => node),
//     ...rest,
//   }
// }
function setCurrentData(masterData: MasterData): ProductData {
  return masterData && masterData.current
    ? masterData.current
    : masterData.staged
}

function setProductPrice(prices: CommerceToolsProductPrice): ProductPrice {
  return {
    value: prices.value.centAmount,
    currencyCode: prices.value.currencyCode,
    retailPrice: 0,
    salePrice: 0,
    listPrice: 0,
    extendedListPrice: 0,
    extendedSalePrice: 0,
  }
}

function setImage(images: Images[]): ProductImage[] {
  return images.map((image) => {
    return { url: image.url }
  })
}

export function normalizeProduct(data: CommercetoolsProducts): Product {
  const current = setCurrentData(data.masterData)
  const price = setProductPrice(current.masterVariant.prices[0])
  return {
    id: data.id,
    name: current.name['en'],
    description:
      current.description && current.description['en']
        ? current.description['en']
        : '',
    sku: current.masterVariant.sku,
    slug: current.slug && current.slug['en'] ? current.slug['en'] : '',
    images: setImage(current.masterVariant.images),
    variants: [],
    price,
    options: [],
  }
}

// export function normalizePage(page: definitions['page_Full']): Page {
//   return {
//     id: String(page.id),
//     name: page.name,
//     is_visible: page.is_visible,
//     sort_order: page.sort_order,
//     body: page.body,
//   }
// }

function convertTaxMode(data: CommercetoolsCart): boolean {
  return data && data.taxMode && data.taxMode === 'Disabled'
    ? false
    : data && data.taxMode
    ? true
    : false
}
export function normalizeCart(data: CommercetoolsCart): Cart {
  return {
    id: data.id,
    customerId: data.customerId,
    email: data.customerEmail,
    createdAt: data.createdAt,
    currency: { code: data.totalPrice.currencyCode },
    taxesIncluded: convertTaxMode(data),
    lineItems: data.lineItems.map(normalizeLineItem),
    lineItemsSubtotalPrice: 0,
    subtotalPrice: 0,
    totalPrice: data.totalPrice.centAmount,
    discounts: [],
  }
}

function normalizeLineItem(item: CommercetoolsLineItems): LineItem {
  return {
    id: item.id,
    variantId: item.variant.id,
    productId: item.productId,
    name: item.name['en'],
    quantity: item.quantity,
    variant: {
      id: item.variant.id,
      sku: item.variant.sku,
      name: item.variant.key,
      image: {
        url: item.variant.images[0].url,
      },
      requiresShipping: false,
      price: item.variant.prices[0].value.centAmount,
      listPrice: 0,
    },
    path: item.productSlug['en'],
    discounts: [],
  }
}

export function normalizeCategory(category: ProductVariant): Category {
  return {
    id: category.id,
    name: '',
    slug: category.key,
    path: category.key,
  }
}
