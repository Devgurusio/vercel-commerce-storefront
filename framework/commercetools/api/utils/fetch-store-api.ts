import type { RequestInit, Response } from '@vercel/fetch'
import { provider } from '..'
import { CommercetoolsApiError, CommercetoolsNetworkError } from './errors'
import fetch from './fetch'

export default async function fetchStoreApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const { config } = provider
  let res: Response

  try {
    const url = config.apiUrl + '/' + config.projectKey + endpoint
    res = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiToken}`,
      },
    })
  } catch (error) {
    throw new CommercetoolsNetworkError(
      `Fetch to Commercetools failed: ${error.message}`
    )
  }

  const contentType = res.headers.get('Content-Type')
  const isJSON = contentType?.includes('application/json')

  if (!res.ok) {
    const data = isJSON ? await res.json() : await getTextOrNull(res)
    const headers = getRawHeaders(res)
    const msg = `Commercetools API error (${
      res.status
    }) \nHeaders: ${JSON.stringify(headers, null, 2)}\n${
      typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    }`

    throw new CommercetoolsApiError(msg, res, data)
  }

  if (res.status !== 204 && !isJSON) {
    throw new CommercetoolsApiError(
      `Fetch to Commercetools API failed, expected JSON content but found: ${contentType}`,
      res
    )
  }
  // If something was removed, the response will be empty
  return res.status === 204 ? null : await res.json()
}

function getRawHeaders(res: Response) {
  const headers: { [key: string]: string } = {}

  res.headers.forEach((value, key) => {
    headers[key] = value
  })

  return headers
}

function getTextOrNull(res: Response) {
  try {
    return res.text()
  } catch (err) {
    return null
  }
}
