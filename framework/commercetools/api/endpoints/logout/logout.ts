import type { LogoutEndpoint } from '.'
import getCookie from '../../utils/get-cookie'

const logout: LogoutEndpoint['handlers']['logout'] = async ({
  res,
  body: { redirectTo },
  config,
}) => {
  // TODO: set cart cookie too
  res.setHeader('Set-Cookie', getCookie(config.customerCookie, ''))

  // Only allow redirects to a relative URL
  if (redirectTo?.startsWith('/')) {
    res.redirect(redirectTo)
  } else {
    res.status(200).json({ data: null })
  }
}

export default logout
