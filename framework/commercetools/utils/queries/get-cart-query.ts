export const getCartQuery = `
query getCart($id: String!, $locale: Locale!) {
    cart(id: $id) {
      id
      version
      createdAt
      customerEmail
      customerId
      taxMode
      taxedPrice{
        totalGross{
          centAmount
        }
      }
      totalPrice{
        centAmount
        currencyCode
      }
      lineItems{
        id
        productSlug(locale: $locale)
        name(locale: $locale)
        variant{
          id
        }
        quantity
        price{
          value{
            centAmount
          }
        }
        variant{
          id
          sku
          key
          images{
            url
            dimensions{
              width
              height
            }
          }
          prices{
            value{
              centAmount
            }
          }
        }
        productId
      }
    }
  }
`
