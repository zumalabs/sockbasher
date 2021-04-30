import ClientHerd from "./ClientHerd";

class ClientFlock {
  private herd: ClientHerd;
  private changeCallback: () => void = () => {};
  private promises: Set<Promise<void>> = new Set();
  readonly isClientFlock = true;
  private f: number; // change frequency per connection

  constructor(
    url: string,
    authToken: string,
    changeCallback?: (flock: ClientFlock) => void,
    n: number = 0,
    f: number = 1 // avg flock drop/reconn frequency per second
  ) {
    this.herd = new ClientHerd(url, authToken, this.clientCallback, n);
    if (changeCallback) this.changeCallback = () => changeCallback(this);
    this.f = f / n; // convert per-flock f to per connection
    console.log(f, n, this.f);
    const initPromise = this.init(n);
    this.promises.add(
      initPromise.then(() => {
        this.promises.delete(initPromise);
      })
    );
  }

  async init(n: number) {
    await this.herd.addClients(n);
    this.maintainChaos();
  }

  clientCallback = () => {
    this.changeCallback();
    this.maintainChaos();
  };

  maintainChaos = () => {
    for (let i = 0; i++; i < this.herd.numSocks - this.promises.size) {
      if (Math.round(Math.random())) this.scheduleConnect();
      else this.scheduleDisconnect();
    }
  };

  getEtaMillis = () => {
    // model as posson process rate f, so arrival time
    // exponentially distributed

    return (-1000 * Math.log(Math.random())) / this.f;
  };

  wait = () =>
    new Promise((resolve) => setTimeout(resolve, this.getEtaMillis()));

  // TODO some DRY
  scheduleConnect = () => {
    const p = (async () => {
      await this.wait();
      await this.herd.addClients(1);
      this.changeCallback();
    })();
    this.promises.add(
      p.then(() => {
        this.promises.delete(p);
      })
    );
  };

  scheduleDisconnect = () => {
    const p = (async () => {
      await this.wait();
      this.herd.dropClient();
      this.changeCallback();
    })();
    this.promises.add(
      p.then(() => {
        this.promises.delete(p);
      })
    );
  };

  get numSocks() {
    return this.herd.numSocks;
  }
}

Object.defineProperty(ClientFlock, Symbol.hasInstance, {
  value: function (obj: any) {
    return obj.isClientFlock;
  },
});

export default ClientFlock;
