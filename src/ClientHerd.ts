import Client from "./client";
import chalk from "chalk";
import getHash from "./hash";
import pretty from "./pretty";

class ClientHerd {
  private clients: Client[];
  private changeCallback: () => void;
  private uniqueMessageStreams: { [hash: string]: { [hash: string]: number } };

  constructor(
    url: string,
    authToken: string,
    changeCallback?: (herd: ClientHerd) => void,
    n: number = 0
  ) {
    this.uniqueMessageStreams = {};
    this.changeCallback = () => {};
    if (changeCallback) this.changeCallback = () => changeCallback(this);
    this.clients = [];
    this.addClients(n, url, authToken);
  }

  addClients = async (n: number, url: string, authToken: string) => {
    for (let i = 0; i < n; i++) {
      const client = new Client(url, authToken, this.clientCallback);
      await client.ready;
      this.clients.push(client);
    }
    return this;
  };

  clientCallback = (client: Client) => {
    // console.log(chalk.grey(client));
    this.uniqueMessageStreams = this.clients.reduce((acc, c) => {
      const hashCounts = c.hashCounts;
      return { ...acc, [getHash(hashCounts)]: hashCounts };
    }, {});
    this.changeCallback();
  };

  toString() {
    return pretty(this.uniqueMessageStreams);
  }
}

export default ClientHerd;
