const subscriptions = [
  {
    id: "1",
    type: "start",
    payload: {
      variables: {},
      extensions: {},
      operationName: "dashboardsSubscription",
      query:
        "subscription dashboardsSubscription {\n  dashboardsSubscription {\n    dashboards {\n      ...dashboardFragment\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment dashboardFragment on DashboardType {\n  id\n  name\n  layout\n  removed\n  __typename\n  widgets {\n    __typename\n    ... on WidgetInterface {\n      __typename\n      id\n      layout\n      memberId\n    }\n    ... on BrokerProductGroupWidgetType {\n      __typename\n      productGroup {\n        __typename\n        id\n      }\n    }\n    ... on BrokerContactsWidgetType {\n      __typename\n      desk {\n        __typename\n        id\n        name\n      }\n    }\n    ... on OrderWidgetType {\n      __typename\n      id\n      layout\n      memberId\n    }\n    ... on WhatsappStreamWidgetType {\n      __typename\n      id\n      memberId\n      layout\n      matchers {\n        id\n        name\n        pattern\n        __typename\n      }\n    }\n    ... on RequestForQuotationWidgetType {\n      __typename\n      id\n      memberId\n      layout\n    }\n    ... on MarketSessionWidgetType {\n      __typename\n      id\n      memberId\n      layout\n    }\n    ... on ActivityStreamWidgetType {\n      __typename\n      id\n      memberId\n      layout\n    }\n    ... on MarketDepthWidgetType {\n      __typename\n      id\n      memberId\n      layout\n    }\n    ... on TradeTapeWidgetType {\n      __typename\n      id\n      memberId\n      layout\n    }\n  }\n}\n",
    },
  },
  {
    id: "2",
    type: "start",
    payload: {
      variables: {},
      extensions: {},
      operationName: "ordersSubscription",
      query:
        "subscription ordersSubscription($orderIds: [ID!], $productIds: [ID!]) {\n  ordersSubscription(orderIds: $orderIds, productIds: $productIds) {\n    orders {\n      ...orderFragment\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment orderFragment on OrderType {\n  id\n  limit\n  stop\n  volume\n  displayVolume\n  originUpstream {\n    id\n    __typename\n  }\n  product {\n    id\n    name\n    code\n    clearers\n    ticker\n    fatFingerThreshold\n    __typename\n    market {\n      id\n      name\n      code\n      timeZone\n      timeClose\n      timeOpen\n      decimalPlaces\n      displayColor\n      __typename\n    }\n  }\n  createdFor {\n    ...userFragment\n    organizationName\n    __typename\n  }\n  createdBy {\n    ...userFragment\n    __typename\n  }\n  updatedBy {\n    ...userFragment\n    __typename\n  }\n  validFrom\n  validUntil\n  createdAt\n  clearers\n  originDownstreams {\n    id\n    __typename\n  }\n  orderType\n  side\n  status\n  timeInForce\n  productId\n  ticker\n  deskId\n  publicUntil\n  __typename\n}\n\nfragment userFragment on UserType {\n  id\n  username\n  firstName\n  lastName\n  clearers\n  name\n  metadata\n  __typename\n}\n",
    },
  },
  {
    id: "3",
    type: "start",
    payload: {
      variables: {},
      extensions: {},
      operationName: "ProductActivitySubscription",
      query:
        "subscription ProductActivitySubscription {\n  productActivitySubscription {\n    activity {\n      __typename\n      id\n      typeId\n      isDerived\n      order {\n        ...productActivityOrderFragment\n        __typename\n      }\n      price\n      volume\n      createdAt\n      product {\n        __typename\n        id\n        name\n        code\n        ticker\n        market {\n          id\n          name\n          code\n          decimalPlaces\n          __typename\n        }\n        __typename\n      }\n    }\n    __typename\n  }\n}\n\nfragment productActivityOrderFragment on OrderType {\n  id\n  side\n  orderType\n  status\n  timeInForce\n  limit\n  displayVolume\n  clearers\n  deskId\n  productId\n  ticker\n  __typename\n}\n",
    },
  },
];

export default subscriptions;
