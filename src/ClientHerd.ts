import Client from "./client";
import chalk from "chalk";

class ClientHerd {
  private clients: Client[];
  private changeCallback: ((herd: ClientHerd) => void) | null;

  constructor(
    url: string,
    authToken: string,
    changeCallback?: (herd: ClientHerd) => void,
    n: number = 5
  ) {
    this.changeCallback = changeCallback || null;
    this.clients = [Array.from(Array(n).keys())].map(
      () => new Client(url, authToken, this.clientCallback)
    );
  }

  clientCallback = (client: Client) => {
    console.log(chalk.grey(client));
    if (this.changeCallback) this.changeCallback(this);
  };
}

export default ClientHerd;
