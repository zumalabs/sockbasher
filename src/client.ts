import { GraphQLClient } from "kikstart-graphql-client";
import subscriptions from "./subscriptions";
import chalk from "chalk";

export const getAuthedClient = (url: string, authToken: string) => {
  return new GraphQLClient({
    url: "wahtevs",
    wsUrl: url,
    connectionParams: { authToken },
    wsOptions: {
      wsProtocols: "graphql-ws",
    },
  });
};

const pretty = (m: any) => JSON.stringify(m, null, 2);

const onMessageDefault = (m: any) => console.log(chalk.yellow(pretty(m)));
const onErrorDefault = (e: any) => console.log(chalk.red(pretty(e)));
const onCompleteDefault = () => console.log(chalk.cyan("complete"));

export const getAuthedSubscribedClient = (
  url: string,
  authToken: string,
  onMessage = onMessageDefault,
  onError = onErrorDefault,
  onComplete = onCompleteDefault
) => {
  const client = getAuthedClient(url, authToken);

  for (const sub of subscriptions) {
    console.log(sub);
    client
      .runSubscription(sub)
      .subscribe({ next: onMessage, error: onError, complete: onComplete });
  }
};
