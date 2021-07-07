import { normalizeCart } from '@framework/lib/normalize'
import { CommercetoolsGraphQLError } from '@framework/api/utils/errors'
import getCookie from '@framework/api/utils/get-cookie'
import type { CommercetoolsCart } from '@framework/types/cart'
import type { CartEndpoint } from '.'
import { getCartQuery } from '@framework/utils/queries/get-cart-query'

// Return current cart info
const getCart: CartEndpoint['handlers']['getCart'] = async ({
  res,
  body: { cartId },
  config,
}) => {
  let result: { data?: { cart: CommercetoolsCart } } = {}
  const locale = config.getLocale()
  if (cartId) {
    try {
      const variables = {
        id: cartId,
        locale: locale,
      }
      result = await config.fetch(getCartQuery, { variables })
    } catch (error) {
      if (error instanceof CommercetoolsGraphQLError) {
        // Remove the cookie if it exists but the cart wasn't found
        res.setHeader('Set-Cookie', getCookie(config.cartCookie))
      } else {
        throw error
      }
    }
  }
  let normalizedCart = null
  if (result.data) {
    normalizedCart = normalizeCart(result.data.cart)
  }

  res.status(200).json({
    data: normalizedCart,
  })
}
export default getCart
