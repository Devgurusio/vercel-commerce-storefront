import type { SignupEndpoint } from '.'
import type { CommercetoolsCustomer } from '../../../types/customer'
import { signupMutation } from '../../../utils/mutations/sign-up-mutation'
const jwt = require('jwt-simple')
import getCookie from '../../utils/get-cookie'

const signup: SignupEndpoint['handlers']['signup'] = async ({
  res,
  body: { firstName, lastName, email, password },
  config,
}) => {
  if (!(firstName && lastName && email && password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }

  try {
    const newCustomer: CommercetoolsCustomer = (
      await config.fetch(signupMutation, {
        variables: { data: { firstName, lastName, email, password } },
      })
    ).data?.customerSignUp.customer

    const customerToken = jwt.encode(newCustomer.id, process.env.SECRET_KEY)

    res.setHeader(
      'Set-Cookie',
      getCookie(config.customerCookie, customerToken, config.cookieMaxAge)
    )

    res.status(200).json({ data: null })
  } catch (error) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Error on response' }],
    })
  }
}

export default signup
