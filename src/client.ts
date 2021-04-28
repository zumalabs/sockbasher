import WebSocket from "ws";
import chalk from "chalk";
import subscriptions from "./subscriptions";

export const getAuthedWebsocket = (
  url: string,
  authToken: string,
  messageCallback = () => {},
  payloadsOnAck = []
) => {
  const ws = new WebSocket(url, ["graphql-ws"]);

  ws.on("open", function open() {
    ws.addListener("message", messageCallback);
    ws.on("message", function incoming(json) {
      try {
        //@ts-ignore
        const { type } = JSON.parse(json);
        if (type === "connection_ack") {
          console.log(
            chalk.cyanBright("Connection Acknowledged, send subscriptions")
          );
          for (const sub of subscriptions) {
            ws.send(JSON.stringify(sub));
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
