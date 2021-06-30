import { serialize, CookieSerializeOptions } from 'cookie'
export default function getCookie(
  name: string,
  value?: string,
  maxAge?: number
) {
  const options: CookieSerializeOptions =
    value && maxAge
      ? {
          maxAge,
          expires: new Date(Date.now() + maxAge * 1000),
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
        }
      : { maxAge: -1, path: '/' } // Removes the cookie
  return serialize(name, value || '', options)
}
