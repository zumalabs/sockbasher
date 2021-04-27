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

export async function fetchAuthTokens(username: string, password: string, endpoint: string) {
    const graphQLClient = new GraphQLClient(endpoint)
    return await graphQLClient.request<TAuthTokens>(mutation, {
        username: username,
        password: password
    })
}
