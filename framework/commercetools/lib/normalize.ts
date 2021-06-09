import type {
  CommercetoolsProducts,
  CommerceToolsProductPrice,
  Product,
  ProductVariant,
  CommercetoolsProductVariant,
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

function setVariants(
  variants: CommercetoolsProductVariant[],
  published: boolean
): ProductVariant[] {
  return variants.map((variant) => {
    return {
      id: variant.id,
      options: [],
      availableForSale: published,
    }
  })
}

export function normalizeProduct(data: CommercetoolsProducts): Product {
  const price = setProductPrice(data.masterVariant.prices[0])
  const product = {
    id: data.id,
    name: data.name.en,
    description:
      data.metaDescription && data.metaDescription.en
        ? data.metaDescription.en
        : 'No description',
    slug: data.slug.en,
    path: data.slug.en,
    images: data.masterVariant.images,
    variants: [],
    options: [],
    price: {
      value: data.masterVariant.prices[0].value.centAmount / 100,
      currencyCode: data.masterVariant.prices[0].value.currencyCode,
    },
    sku: data.masterVariant.sku,
  }
  return product
}

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
