import { FetcherError } from '@commerce/utils/errors'
import type { GraphQLFetcher } from '@commerce/api'
import Commercetools from '../../utils/commercetools'
import { provider } from '..'

const fetchGraphqlApi: GraphQLFetcher = async (
  query: string,
  { variables } = {}
) => {
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
    const result = await requestExecute
      .graphql()
      .post({
        body: {
          query,
          variables,
        },
      })
      .execute()

    return result.body
  } catch (err) {
    throw err
  }

  // log.warn(query)
  // const { config } = provider
  // const res = await fetch(config.commerceUrl + (preview ? '/preview' : ''), {
  //   ...fetchOptions,
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${config.apiToken}`,
  //     ...fetchOptions?.headers,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     query,
  //     variables,
  //   }),
  // })

  // const json = await res.json()
  // if (json.errors) {
  //   throw new FetcherError({
  //     errors: json.errors ?? [{ message: 'Failed to fetch Bigcommerce API' }],
  //     status: res.status,
  //   })
  // }

  // return { data: json.data, res }
}

export default fetchGraphqlApi
