import ClientHerd from "./ClientHerd";
import debug from "./debug";

class ChaosPromise {
  private promise: Promise<void>;
  resolved = false;

  constructor(p: Promise<void>) {
    this.promise = p;
    this.promise.then(() => {
      this.resolved = true;
    });
  }
}

class ClientFlock {
  private herd: ClientHerd;
  private changeCallback: () => void = () => {};
  private promises: ChaosPromise[] = [];
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
    this.promises.push(new ChaosPromise(this.init(n)));
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
    this.promises = this.promises.filter((p) => !p.resolved);
    for (let i = 0; i <= this.herd.numSocks - this.promises.length; i++) {
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
    this.promises.push(
      new ChaosPromise(
        (async () => {
          await this.wait();
          await this.herd.addClients(1);
          this.changeCallback();
        })()
      )
    );
  };

  scheduleDisconnect = () => {
    this.promises.push(
      new ChaosPromise(
        (async () => {
          await this.wait();
          this.herd.dropClient();
          this.changeCallback();
        })()
      )
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
