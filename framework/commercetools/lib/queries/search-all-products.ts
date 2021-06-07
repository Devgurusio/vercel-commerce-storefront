import { CurrentProduct } from '../fragments/product-response-fragment'
export const searchAllProducts = /* GraphQL */ `
  query getAllProducts {
    products(limit: 10) {
      ...CurrentProduct
    }
  }
  ${CurrentProduct}
`
