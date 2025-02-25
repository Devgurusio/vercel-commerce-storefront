import { GetAPISchema, createEndpoint } from '@commerce/api'
import signupEndpoint from '@commerce/api/endpoints/signup'
import type { SignupSchema } from '../../../types/signup'
import type { CommercetoolsAPI } from '../..'
import signup from './signup'

export type SignupAPI = GetAPISchema<CommercetoolsAPI, SignupSchema>

export type SignupEndpoint = SignupAPI['endpoint']

export const handlers: SignupEndpoint['handlers'] = { signup }

const singupApi = createEndpoint<SignupAPI>({
  handler: signupEndpoint,
  handlers,
})

export default singupApi
