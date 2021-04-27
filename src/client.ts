import WebSocket from "ws";

export const getAuthedWebsocket = (
  url: string,
  authToken: string,
  messageCallback = () => {}
) => {
  const ws = new WebSocket(url, ["graphql-ws"]);

  ws.on("open", function open() {
    ws.send(
      JSON.stringify({
        type: "connection_init",
        payload: {
          authToken,
        },
      })
    );
  });

  ws.addListener("message", messageCallback);

  return ws;
};
