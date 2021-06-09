import { FetcherError } from '@commerce/utils/errors'
import type { GraphQLFetcher } from '@commerce/api'
import Commercetools from '../../utils/commercetools'
import { provider } from '..'

const fetchProducts = async (query?: any) => {
  const { config } = provider
  const commercetools = Commercetools({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    projectKey: config.projectKey,
    host: config.host,
    oauthHost: config.oauthHost,
    concurrency: config.concurrency,
  })
  const { requestExecute } = commercetools
  try {
    return await requestExecute
      .productProjections()
      .get({ queryArgs: query })
      .execute()
  } catch (err) {
    throw err
  }
}

export default fetchProducts
