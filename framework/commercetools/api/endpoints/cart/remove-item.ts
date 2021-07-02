import { normalizeCart } from '@framework/lib/normalize'
import getCookie from '@framework/api/utils/get-cookie'
import type { CartEndpoint } from '.'
import { getCartQuery } from '@framework/utils/queries/get-cart-query'
import { updateCartMutation } from '@framework/utils/mutations/update-cart-mutation'
import type { CommercetoolsCart } from '@framework/types/cart'
import findItemQuantity from '@framework/api/utils/find-item-quantity'

const removeItem: CartEndpoint['handlers']['removeItem'] = async ({
  res,
  body: { cartId, itemId },
  config,
}) => {
  if (!cartId || !itemId) {
    return res.status(404).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }
  const locale = config.getLocale()
  const variables = {
    id: cartId,
    locale: locale,
  }
  const activeCart: CommercetoolsCart = (
    await config.fetch(getCartQuery, { variables })
  )?.data?.cart
  const quantity: number = findItemQuantity(activeCart.lineItems, itemId)
  const body = {
    id: cartId,
    version: activeCart?.version,
    actions: [
      {
        removeLineItem: {
          lineItemId: itemId,
          quantity: quantity,
        },
      },
    ],
  }
  const result: CommercetoolsCart = (
    await config.fetch(updateCartMutation, { variables: body })
  )?.data?.updateCart

  res.setHeader(
    'Set-Cookie',
    result
      ? // Update the cart cookie
        getCookie(config.cartCookie, cartId, config.cookieMaxAge)
      : // Remove the cart cookie if the cart was removed (empty items)
        getCookie(config.cartCookie)
  )
  res.status(200).json({ data: result ? normalizeCart(result) : null })
}

export default removeItem
