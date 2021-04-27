const ProductActivityOrderFragment = `
  fragment productActivityOrderFragment on OrderType {
    id
    side
    orderType
    status
    timeInForce
    limit
    displayVolume
    clearers
    deskId
    productId
    ticker
    __typename
  }
`;

const subscriptions = [
  `
    subscription ProductActivitySubscription {
      productActivitySubscription {
        activity {
          __typename
          id
          typeId
          isDerived
          order {
            ...productActivityOrderFragment
          }
          price
          volume
          createdAt
          product {
            __typename
            id
            name
            code
            ticker
            market {
              id
              name
              code
              decimalPlaces
              __typename
            }
            __typename
          }
        }
      }
    }
    ${ProductActivityOrderFragment}
  `,
];

export default subscriptions;
