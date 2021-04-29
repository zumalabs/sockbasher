import Client from "./client";
import getHash from "./hash";
import pretty from "./pretty";

const MAX_SET_TIMER_VALUE = 2147483647

class ClientHerd {
  private clients: Client[];
  private changeCallback: () => void;
  private uniqueMessageStreams: { [hash: string]: { [hash: string]: number } };
  private clientsPromise: Promise<ClientHerd>;
  private waitForErrorStatus: number;

  constructor(
    url: string,
    authToken: string,
    changeCallback?: (herd: ClientHerd) => void,
    n: number = 0,
    waitForErrorStatus: number = 0,
  ) {
    this.uniqueMessageStreams = {};
    this.changeCallback = () => {};
    if (changeCallback) this.changeCallback = () => changeCallback(this);
    this.clients = [];
    this.clientsPromise = this.addClients(n, url, authToken);
    this.waitForErrorStatus = waitForErrorStatus;
  }

  addClients = async (n: number, url: string, authToken: string) => {
    const newClients = Array.from(Array(n).keys()).map(async () => {
      const client = await new Client(url, authToken, this.clientCallback)
        .ready;
      this.clients.push(client);
      this.changeCallback();
    });
    await Promise.all(newClients);
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

  get numSocks() {
    return this.clients.length;
  }

  get consistent() {
    return Object.keys(this.uniqueMessageStreams).length < 2;
  }

  get ready() {
    return this.clientsPromise.then(() => true);
  }

  get waitForErrorMillis() {
    return this.waitForErrorStatus === 0 ? MAX_SET_TIMER_VALUE : (this.waitForErrorStatus * 1000)
  }
}

export default ClientHerd;
