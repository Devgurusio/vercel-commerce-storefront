import type {
  CommercetoolsProducts,
  Product,
  ProductVariant,
  CommercetoolsProductVariant,
  CommerceToolsProductPrice,
  ProductPrice,
  LocalString,
} from '../types/product'
import type {
  Cart,
  CommercetoolsCart,
  CommercetoolsLineItems,
  LineItem,
} from '../types/cart'

import type {
  CommercetoolsBrands,
  CommercetoolsCategory,
  Category,
  Brand,
} from '../types/site'

//TODO: Add locale in api config and provider of commercetools
type LocalKey = keyof LocalString

function normalizeVariants(
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

function normalicePrice(price: CommerceToolsProductPrice): ProductPrice {
  const value =
    price.discounted && price.discounted.value
      ? price.discounted.value.centAmount
      : price.value.centAmount
  return {
    value,
    currencyCode: price.value.currencyCode,
    retailPrice: 0,
    salePrice: 0,
    listPrice: 0,
    extendedListPrice: 0,
    extendedSalePrice: 0,
  }
}

export function normalizeProduct(
  data: CommercetoolsProducts,
  locale: LocalKey
): Product {
  return {
    id: data.id,
    name: data.name[locale],
    description:
      data.metaDescription && data.metaDescription[locale]
        ? data.metaDescription[locale]
        : 'No description',
    slug: data.slug[locale],
    path: data.slug[locale],
    images: data.masterVariant.images,
    variants: normalizeVariants(data.variants, data.published),
    options: [],
    price: normalicePrice(data.masterVariant.prices[0]),
    sku: data.masterVariant.sku,
  }
}

function convertTaxMode(data: CommercetoolsCart): boolean {
  return data && data.taxMode && data.taxMode === 'Disabled'
    ? false
    : data && data.taxMode
    ? true
    : false
}
export function normalizeCart(data: CommercetoolsCart, locale: LocalKey): Cart {
  const totalPrice =
    data.taxedPrice &&
    data.taxedPrice.totalGross &&
    data.taxedPrice.totalGross.centAmount
      ? data.taxedPrice.totalGross.centAmount
      : data.totalPrice.centAmount
  return {
    id: data.id,
    customerId: data.customerId,
    email: data.customerEmail,
    createdAt: data.createdAt,
    currency: { code: data.totalPrice.currencyCode },
    taxesIncluded: convertTaxMode(data),
    lineItems: data.lineItems.map((item) => normalizeLineItem(item, locale)),
    lineItemsSubtotalPrice: 0,
    subtotalPrice: 0,
    totalPrice,
    discounts: [],
  }
}

function normalizeLineItem(
  item: CommercetoolsLineItems,
  locale: LocalKey
): LineItem {
  const price =
    item.price && item.price.value && item.price.value.centAmount
      ? item.price.value.centAmount
      : item.variant.prices[0].value.centAmount
  return {
    id: item.id,
    variantId: item.variant.id,
    productId: item.productId,
    name: item.name[locale],
    quantity: item.quantity,
    variant: {
      id: item.variant.id,
      sku: item.variant.sku,
      name: item.variant.key,
      image: {
        url:
          item.variant.images &&
          item.variant.images[0] &&
          item.variant.images[0].url
            ? item.variant.images[0].url
            : '',
        width:
          item.variant.images &&
          item.variant.images[0] &&
          item.variant.images[0].dimensions &&
          item.variant.images[0].dimensions.w
            ? item.variant.images[0].dimensions.w
            : undefined,
        height:
          item.variant.images &&
          item.variant.images[0] &&
          item.variant.images[0].dimensions &&
          item.variant.images[0].dimensions.h
            ? item.variant.images[0].dimensions.h
            : undefined,
      },
      requiresShipping: false,
      price,
      listPrice: 0,
    },
    path: item.productSlug[locale],
    discounts: [],
  }
}

type Site = { categories: Category[]; brands: Brand[] }

export function normalizeSite(
  ctCategories: CommercetoolsCategory[],
  ctBrands: CommercetoolsBrands[]
): Site {
  const categories = ctCategories.map((ctCategory) => {
    return {
      id: ctCategory.id,
      name: ctCategory.name,
      slug: ctCategory.slug,
      path: ctCategory.slug,
    }
  })

  const brands = ctBrands.map((ctBrand) => {
    return {
      name: ctBrand.label,
      node: {
        path: `brands/${ctBrand.key}`,
      },
    }
  })

  return {
    categories,
    brands,
  }
}
