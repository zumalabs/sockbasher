import { GraphQLClient, gql } from "graphql-request"

const mutation = gql`
    mutation LoginMutation($username: String!, $password: String!) {
      tokenAuth(username: $username, password: $password) {
        token
        refreshToken
      }
    }
  `
interface TAuthTokens {
    tokenAuth: { token: string; refreshToken: string }
}

export async function fetchAuthTokens(username: string, password: string, endpoint: string, token?: string) {
    if (token) {
        return token
    }
    const graphQLClient = new GraphQLClient(endpoint)
    const { tokenAuth } = await graphQLClient.request<TAuthTokens>(mutation, {
        username: username,
        password: password
    })
    return tokenAuth.token
}
