import { normalizeCart } from '@framework/lib/normalize'
import getCookie from '@framework/api/utils/get-cookie'
import type { CartEndpoint } from '.'
import type { CommercetoolsCart } from '@framework/types/cart'
import { updateCartMutation } from '@framework/utils/mutations/update-cart-mutation'
import { getCartQuery } from '@framework/utils/queries/get-cart-query'
import { QUANTITY_TO_UPDATE } from '@framework/consts'
const updateItem: CartEndpoint['handlers']['updateItem'] = async ({
  res,
  body: { cartId, itemId, item },
  config,
}) => {
  if (!cartId || !itemId || !item) {
    return res.status(400).json({
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
  const lineItemToUpdate = activeCart
    ? activeCart.lineItems.find(
        (lineItem) => lineItem.productId === item.productId
      )
    : null

  const actions =
    lineItemToUpdate &&
    lineItemToUpdate.quantity &&
    item.quantity &&
    lineItemToUpdate.quantity > item.quantity
      ? {
          removeLineItem: {
            lineItemId: itemId,
            quantity: QUANTITY_TO_UPDATE,
          },
        }
      : {
          addLineItem: {
            productId: item.productId,
            variantId: item.variantId,
            quantity: QUANTITY_TO_UPDATE,
          },
        }

  const body = {
    version: activeCart.version,
    id: activeCart.id,
    actions: [actions],
  }
  try {
    const result: CommercetoolsCart = (
      await config.fetch(updateCartMutation, { variables: body })
    )?.data?.updateCart
    res.setHeader(
      'Set-Cookie',
      getCookie(config.cartCookie, cartId, config.cookieMaxAge)
    )
    res.status(200).json({ data: result && normalizeCart(result) })
  } catch (error) {
    throw Error(`Error updating: ${error}`)
  }
}

export default updateItem
