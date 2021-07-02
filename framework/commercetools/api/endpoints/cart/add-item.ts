import { normalizeCart } from '@framework/lib/normalize'
import getCookie from '@framework/api/utils/get-cookie'
import type { CartEndpoint } from '.'
import { createCartMutation } from '@framework/utils/mutations/create-cart-mutation'
import { updateCartMutation } from '@framework/utils/mutations/update-cart-mutation'
import { getCartQuery } from '@framework/utils/queries/get-cart-query'
import type { CommercetoolsCart } from '@framework/types/cart'

//TODO: Use anonymous session, set customerId on cart and handle currency with locale
const addItem: CartEndpoint['handlers']['addItem'] = async ({
  res,
  body: { cartId, item },
  config,
}) => {
  if (!item) {
    return res.status(404).json({
      data: null,
      errors: [{ message: 'Missing item' }],
    })
  }

  if (!item.quantity) item.quantity = 1
  const { currency } = config
  let result = null
  if (!cartId) {
    const body = {
      draft: {
        currency: currency,
        lineItems: [
          {
            productId: item.productId,
            quantity: item.quantity,
            variantId: Number(item.variantId),
          },
        ],
      },
    }
    result = (await config.fetch(createCartMutation, { variables: body }))?.data
      ?.createCart
  } else {
    const locale = config.getLocale()
    const variables = {
      id: cartId,
      locale: locale,
    }
    const activeCart: CommercetoolsCart = (
      await config.fetch(getCartQuery, { variables })
    )?.data?.cart

    const body = {
      version: activeCart.version,
      id: cartId,
      actions: [
        {
          addLineItem: {
            productId: item.productId,
            variantId: Number(item.variantId),
            quantity: item.quantity,
          },
        },
      ],
    }

    result = (await config.fetch(updateCartMutation, { variables: body }))?.data
      ?.updateCart
  }
  if (result) {
    res.setHeader(
      'Set-Cookie',
      getCookie(config.cartCookie, result.id, config.cookieMaxAge)
    )
    res.status(200).json({ data: result && normalizeCart(result) })
  }
}

export default addItem
