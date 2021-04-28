import WebSocket from "ws";
import chalk from "chalk";
import crypto from "crypto";
import subscriptions from "./subscriptions";

class Client {
  private ws: WebSocket;
  private changeCallback: ((client: Client) => void) | null;
  private messageRoster: { [name: string]: number };

  constructor(
    url: string,
    authToken: string,
    changeCallback?: (client: Client) => void
  ) {
    this.messageRoster = {};
    this.changeCallback = changeCallback || null;
    this.ws = getAuthedWebsocket(url, authToken, this.onMessage, subscriptions);
  }

  onMessage = (m: string) => {
    console.log(chalk.yellow(m));
    try {
      const { type, ...data } = JSON.parse(m);
      this.logMessage(m);
      if (type === "data" && this.changeCallback) this.changeCallback(this);
    } catch {}
  };

  get hashCounts() {
    return { ...this.messageRoster };
  }

  logMessage = (m: string) => {
    const hash = crypto.createHash("sha1").update(m).digest("base64");
    const count = (this.messageRoster[hash] || 0) + 1;
    this.messageRoster[hash] = count;
  };

  toString() {
    return JSON.stringify(this.messageRoster, null, 2);
  }
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
