const Product = /* GraphQL */ `
  fragment Product on ProductData {
    skus
    name(locale: "en")
    description(locale: "en")
    variants {
      sku
    }
    masterVariant {
      id
      sku
      prices {
        value {
          centAmount
          currencyCode
        }
      }
      images {
        url
        dimensions {
          height
          width
        }
      }
    }
  }
`

export const CurrentProduct = /* GraphQL */ `
  fragment CurrentProduct on ProductQueryResult {
    results {
      id
      masterData {
        current {
          ...Product
        }
      }
    }
  }
  ${Product}
`
