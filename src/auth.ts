import { GraphQLClient, gql } from 'graphql-request'

const endpoint = "http://localhost/api/graphql"
const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
        "content-type": "application/json",
    },
})
const mutation = gql`
    mutation LoginMutation($username: String!, $password: String!) {
      tokenAuth(username: $username, password: $password) {
        token
        refreshToken
      }
    } 
  `
interface TAuthTokens {
    AuthTokens: { token: string; refreshToken: string }
}

async function fetchAuthTokens(username: string, password: string) {
    return await graphQLClient.request<TAuthTokens>(mutation, {
        username: username,
        password: password
    })
}
