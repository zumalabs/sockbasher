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
    n: number = 5
  ) {
    this.uniqueMessageStreams = {};
    this.changeCallback = () => {};
    if (changeCallback) this.changeCallback = () => changeCallback(this);
    this.clients = Array.from(Array(n).keys()).map(
      () => new Client(url, authToken, this.clientCallback)
    );
    // console.log(this.clients);
  }

  clientCallback = (client: Client) => {
    console.log(chalk.grey(client));
    this.uniqueMessageStreams = this.clients.reduce(
      (acc, c) => ({ ...acc, [getHash(c.hashCounts)]: c.hashCounts }),
      {}
    );
    this.changeCallback();
  };

  toString() {
    return pretty(this.uniqueMessageStreams);
  }
}

export default ClientHerd;
