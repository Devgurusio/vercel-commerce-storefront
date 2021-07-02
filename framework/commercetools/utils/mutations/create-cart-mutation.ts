export const createCartMutation = /* GraphQL */ `
  mutation createCart($draft: CartDraft!) {
    createCart(draft: $draft) {
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
