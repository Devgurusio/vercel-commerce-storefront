export const getAllCategoriesAndBrandsQuery = /* GraphQL */ `
  query getCategoriesAndBrands($locale: Locale!, $brandAttribute: [String!]) {
    categories {
      results {
        id
        name(locale: $locale)
        slug(locale: $locale)
      }
    }
    productTypes {
      results {
        attributeDefinitions(includeNames: $brandAttribute) {
          results {
            type {
              ... on EnumAttributeDefinitionType {
                values {
                  results {
                    key
                    label
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
