import WebSocket from "ws";
import chalk from "chalk";
import subscriptions from "./subscriptions";

class Client {
  private ws: WebSocket;
  private changeCallback: ((client: Client) => void) | null;

  constructor(
    url: string,
    authToken: string,
    changeCallback?: (client: Client) => void
  ) {
    this.changeCallback = changeCallback || null;
    this.ws = getAuthedWebsocket(url, authToken, this.onMessage, subscriptions);
  }

  onMessage = (m: any) => {
    console.log(chalk.yellow(m));
    try {
      const { type, ...data } = JSON.parse(m);
      if (type === "data" && this.changeCallback) this.changeCallback(this);
    } catch {}
  };
}

const getAuthedWebsocket = (
  url: string,
  authToken: string,
  messageCallback = (m: any) => {},
  payloadsOnAck: any[] = []
) => {
  const ws = new WebSocket(url, ["graphql-ws"]);

  ws.on("open", function open() {
    ws.addListener("message", messageCallback);
    ws.on("message", function incoming(json) {
      try {
        //@ts-ignore
        const { type } = JSON.parse(json);
        if (type === "connection_ack") {
          // console.log(
          //   chalk.cyanBright("Connection Acknowledged, send payloads")
          // );
          for (const payload of payloadsOnAck) {
            ws.send(JSON.stringify(payload));
          }
        }
      } catch {}
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

  return ws;
};

export default Client;
