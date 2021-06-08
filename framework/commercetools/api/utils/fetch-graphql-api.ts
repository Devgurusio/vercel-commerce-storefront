import { FetcherError } from '@commerce/utils/errors'
import type { GraphQLFetcher } from '@commerce/api'
import { provider } from '..'
import fetch from './fetch'

const fetchGraphqlApi: GraphQLFetcher = async (
  query: string,
  { variables } = {},
  fetchOptions
) => {
  const { config } = provider

  const res = await fetch(config.commerceUrl, {
    ...fetchOptions,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      ...fetchOptions?.headers,
      'Content-Type': 'application/json',
      'X-Graphql-Target': 'ctp',
      'X-Project-Key': config.projectKey,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    throw new FetcherError({
      errors: json.errors ?? [{ message: 'Failed to fetch Commercetools API' }],
      status: res.status,
    })
  }

  return { data: json.data, res }
}

export default fetchGraphqlApi
