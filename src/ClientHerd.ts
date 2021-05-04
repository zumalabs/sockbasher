import Client from "./client";
import getHash from "./hash";
import pretty from "./pretty";

const MAX_SET_TIMER_VALUE = 2147483647

class ClientHerd {
  private url: string;
  private authToken: string;
  private clients: Client[] = [];
  private changeCallback: () => void = () => {};
  private uniqueMessageStreams: {
    [hash: string]: { [hash: string]: number };
  } = {};
  private clientsPromise: Promise<ClientHerd>;
  private waitForErrorStatus: number;
  readonly isClientHerd = true;

  constructor(
    url: string,
    authToken: string,
    changeCallback?: (herd: ClientHerd) => void,
    n: number = 0,
    waitForErrorStatus: number = 0,
  ) {
    if (changeCallback) this.changeCallback = () => changeCallback(this);
    this.url = url;
    this.authToken = authToken;
    this.clientsPromise = this.addClients(n);
    this.waitForErrorStatus = waitForErrorStatus;
  }

  addClients = async (n: number) => {
    const newClients = Array.from(Array(n).keys()).map(async () => {
      const client = await new Client(
        this.url,
        this.authToken,
        this.clientCallback
      ).ready;
      this.clients.push(client);
      this.changeCallback();
    });
    await Promise.all(newClients);
    return this;
  };

  dropClient = async () => {
    if (this.clients.length < 1) return;
    const removeIndex = Math.floor(Math.random() * this.clients.length);
    await this.clients[removeIndex].close();
    this.clients.splice(removeIndex, 1);
    this.changeCallback();
  };

  clientCallback = (client: Client) => {
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

Object.defineProperty(ClientHerd, Symbol.hasInstance, {
  value: function (obj: any) {
    return obj.isClientHerd;
  },
});

export default ClientHerd;
