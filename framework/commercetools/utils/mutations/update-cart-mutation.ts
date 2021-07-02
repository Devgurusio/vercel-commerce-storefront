export const updateCartMutation = /* GraphQL */ `
  mutation updateCart(
    $version: Long!
    $actions: [CartUpdateAction!]!
    $id: String
  ) {
    updateCart(version: $version, actions: $actions, id: $id) {
      id
      version
      createdAt
      customerEmail
      customerId
      taxMode
      taxedPrice {
        totalGross {
          centAmount
        }
      }
      totalPrice {
        centAmount
        currencyCode
      }

      lineItems {
        id
        productId
        variant {
          id
        }
        quantity
        price {
          value {
            centAmount
          }
        }
        variant {
          id
          sku
          key
          images {
            url
            dimensions {
              width
              height
            }
          }
          prices {
            value {
              centAmount
            }
          }
        }
      }
    }
  }
`
