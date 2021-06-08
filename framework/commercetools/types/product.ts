import * as Core from '@commerce/types/product'

export type CommercetoolsProducts = {
  id: string
  masterData: MasterData
}

export type MasterData = {
  current: ProductData
  staged: ProductData
  published: boolean
  hasStagedChanges: boolean
}

export type ProductData = {
  name: LocalString
  description: LocalString
  slug: LocalString
  metaTitle: LocalString
  metaDescription: LocalString
  masterVariant: ProductVariant
  variants: ProductVariant[]
}

export type ProductVariant = {
  id: string
  key: string
  sku: string
  images: Images[]
  prices: CommerceToolsProductPrice[]
}

export type Images = {
  url: string
  dimensions: {
    w: number
    h: number
  }
}

export type CommerceToolsProductPrice = {
  id: string
  value: {
    type: string
    currencyCode: string
    centAmount: number
    fractionDigits: number
  }
}

export type LocalString = {
  en: string
  'es-AR': string
  'es-CL': string
  'es-PE': string
  de: string
}

export type Product = Core.Product
export type ProductPrice = Core.ProductPrice
export type ProductOption = Core.ProductOption
export type ProductOptionValue = Core.ProductOptionValues
export type ProductImage = Core.ProductImage
