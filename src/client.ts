import WebSocket from "ws";
import chalk from "chalk";
import getHash from "./hash";
import subscriptions from "./subscriptions";
import pretty from "./pretty";

class Client {
  private ws: Promise<WebSocket>;
  private changeCallback: () => void;
  private messageRoster: { [name: string]: number };

  constructor(
    url: string,
    authToken: string,
    changeCallback?: (client: Client) => void
  ) {
    this.messageRoster = {};
    this.changeCallback = () => {};
    if (changeCallback) this.changeCallback = () => changeCallback(this);
    this.ws = getAuthedWebsocket(url, authToken, this.onMessage, subscriptions);
  }

  onMessage = (m: string) => {
    console.log(chalk.yellow(m));
    try {
      const { type, ...data } = JSON.parse(m);
      this.logMessage(m);
      if (type === "data") this.changeCallback();
    } catch (e) {
      console.log(chalk.redBright(e));
    }
  };

  get hashCounts() {
    return { ...this.messageRoster };
  }

  logMessage = (m: string) => {
    const hash = getHash(m);
    const count = (this.messageRoster[hash] || 0) + 1;
    this.messageRoster[hash] = count;
  };

  toString() {
    return pretty(this.hashCounts);
  }

  get ready() {
    return this.ws.then(() => true);
  }
}

const getAuthedWebsocket = (
  url: string,
  authToken: string,
  messageCallback = (m: string) => {},
  payloadsOnAck: any[] = []
) => {
  console.log(chalk.bgGreen("getAuthedWebsocket"));

  const promise = new Promise<WebSocket>((resolve, reject) => {
    const ws = new WebSocket(url, ["graphql-ws"]);

    ws.on("open", function open() {
      ws.addListener("message", messageCallback);
      ws.on("message", function incoming(json) {
        try {
          //@ts-ignore
          const { type } = JSON.parse(json);
          if (type === "connection_ack") {
            console.log(
              chalk.cyanBright("Connection Acknowledged, send payloads")
            );
            for (const payload of payloadsOnAck) {
              ws.send(JSON.stringify(payload));
            }
            resolve(ws);
          }
        } catch (e) {
          reject(e);
        }
      });
      ws.send(
        JSON.stringify({
          type: "connection_init",
          payload: {
            authToken,
          },
        })
      );
    });
  });

  return promise;
};

export default Client;
