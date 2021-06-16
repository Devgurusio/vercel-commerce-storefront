import type {
  CommercetoolsProducts,
  Product,
  ProductVariant,
  CommercetoolsProductVariant,
  CommerceToolsProductPrice,
  ProductPrice,
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

import { arrayToTree } from './array-to-tree'

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

export function normalizeProduct(data: CommercetoolsProducts): Product {
  return {
    id: data.id,
    name: data.name.en,
    description:
      data.metaDescription && data.metaDescription.en
        ? data.metaDescription.en
        : 'No description',
    slug: data.slug.en,
    path: data.slug.en,
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
export function normalizeCart(data: CommercetoolsCart): Cart {
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
    lineItems: data.lineItems.map((item) => normalizeLineItem(item)),
    lineItemsSubtotalPrice: 0,
    subtotalPrice: 0,
    totalPrice,
    discounts: [],
  }
}

function normalizeLineItem(item: CommercetoolsLineItems): LineItem {
  const price =
    item.price && item.price.value && item.price.value.centAmount
      ? item.price.value.centAmount
      : item.variant.prices[0].value.centAmount
  return {
    id: item.id,
    variantId: item.variant.id,
    productId: item.productId,
    name: item.name.en,
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
    path: item.productSlug.en,
    discounts: [],
  }
}

type Site = { categories: any[]; brands: Brand[] }

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
      //add a random parentId to add in children array
      parent: ctCategory.parent ? ctCategory.parent : { id: 'idRoot' },
    }
  })

  const treeCategories = arrayToTree(categories).children

  const brands = ctBrands.map((ctBrand) => {
    return {
      node: {
        name: ctBrand.label,
        path: `brands/${ctBrand.key}`,
        entityId: ctBrand.key,
      },
    }
  })

  return {
    categories: treeCategories,
    brands,
  }
}
