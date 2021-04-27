import * as http from "http";
import * as url from "url";
import WebSocket from "ws";
import { createClient } from "graphql-ws";
import subscriptions from "./subscriptions";
import chalk from "chalk";

class webSocketImpl extends WebSocket {
  constructor(
    address: string | url.URL,
    options?: WebSocket.ClientOptions | http.ClientRequestArgs
  ) {
    super(address, "graphql-ws", options);
  }
}

export const getAuthedClient = (url: string, authToken: string) => {
  return createClient({
    url,
    connectionParams: { authToken },
    webSocketImpl,
    // lazy: false,
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
    client.subscribe(
      {
        query: sub,
      },
      { next: onMessage, error: onError, complete: onComplete }
    );
  }
};
