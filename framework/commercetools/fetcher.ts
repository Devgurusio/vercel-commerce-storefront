import { FetcherError } from '@commerce/utils/errors'
import type { Fetcher } from '@commerce/utils/types'
import Commercetools from './utils/commercetools'

async function getText(res: Response) {
  try {
    return (await res.text()) || res.statusText
  } catch (error) {
    return res.statusText
  }
}

async function getError(res: Response) {
  if (res.headers.get('Content-Type')?.includes('application/json')) {
    const data = await res.json()
    return new FetcherError({ errors: data.errors, status: res.status })
  }
  return new FetcherError({ message: await getText(res), status: res.status })
}

const fetcher: Fetcher = async ({ variables, body: bodyObj, query }) => {
  const commercetools = Commercetools({
    clientId: 'OfwXOPjkddECcNQhfZPaS6pZ',
    clientSecret: 'Sqj896_Iv2ovUVayskpxCGKlcEYabTy4',
    projectKey: 'vercel-commerce-20210601',
    host: 'https://api.us-central1.gcp.commercetools.com',
    oauthHost: 'https://auth.us-central1.gcp.commercetools.com',
    concurrency: 10,
  })

  console.log('data body: ', bodyObj)
  console.log('data query: ', query)
  console.log('data variables: ', variables.data)

  const { requestExecute } = commercetools

  try {
    return await requestExecute
      .graphql()
      .post({
        body: {
          query: query,
          variables: variables.data,
        },
      })
      .execute()
  } catch (err) {
    throw err
  }
}

export default fetcher
