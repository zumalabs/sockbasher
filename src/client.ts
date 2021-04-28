import WebSocket from "ws";
import chalk from "chalk";
import subscriptions from "./subscriptions";

class Client {
  private ws: WebSocket;

  constructor(url: string, authToken: string) {
    this.ws = getAuthedWebsocket(url, authToken, this.onMessage, subscriptions);
  }

  onMessage = (m: any) => console.log(chalk.yellow(m));
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
