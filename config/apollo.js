import { onError } from 'apollo-link-error'
import { apiUrl } from './index'

export default function(context) {
  const link = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      const authError = graphQLErrors.find(
        ({ message, locations, path, extensions }) =>
          extensions.code === 'UNAUTHENTICATED'
      )

      if (authError) {
        context.error({ statusCode: 401 })
      } else {
        // context.error(graphQLErrors[0])
        // console.log(graphQLErrors)
      }
    }
    // if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  return {
    link,
    cache: process.___cache,
    httpEndpoint: apiUrl,
    httpLinkOptions: {
      credentials: 'include',
      headers: process.env.LIMITER_TICKET
        ? { 'Limiter-Ticket': process.env.LIMITER_TICKET }
        : {}
    }
  }
}
