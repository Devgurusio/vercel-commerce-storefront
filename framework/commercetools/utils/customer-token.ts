import Cookies, { CookieAttributes } from 'js-cookie'
import { CT_COOKIE_EXPIRE, CT_CUSTOMER_TOKEN_COOKIE } from './../const'

export const getCustomerToken = () => Cookies.get(CT_CUSTOMER_TOKEN_COOKIE)

export const setCustomerToken = (
  token: string | null,
  options?: CookieAttributes
) => {
  if (!token) {
    Cookies.remove(CT_CUSTOMER_TOKEN_COOKIE)
  } else {
    Cookies.set(
      CT_CUSTOMER_TOKEN_COOKIE,
      token,
      options ?? {
        expires: CT_COOKIE_EXPIRE,
      }
    )
  }
}
