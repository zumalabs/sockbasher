import ClientHerd from "./ClientHerd";

class ChaosPromise<T> {
  private promise: Promise<T>;
  resolved = false;

  constructor(p: Promise<T>) {
    this.promise = p;
    this.promise.then(() => {
      this.resolved = true;
    });
  }

  then(cb: (a: T) => any) {
    return this.promise.then(cb);
  }
}

class ClientFlock {
  private herd: ClientHerd;
  private changeCallback: () => void = () => {};
  private promises: ChaosPromise<void>[] = [];
  readonly isClientFlock = true;
  private n: number; // avg number in flock
  private f: number; // change frequency per connection

  constructor(
    url: string,
    authToken: string,
    changeCallback?: (flock: ClientFlock) => void,
    n: number = 0,
    f: number = 1 // avg flock drop/reconn frequency per second
  ) {
    this.herd = new ClientHerd(url, authToken, this.herdCallback, n);
    if (changeCallback) this.changeCallback = () => changeCallback(this);
    this.n = n;
    this.f = f / n; // convert per-flock f to per connection
    this.maintainChaos();
  }

  herdCallback = () => {
    this.changeCallback();
    this.maintainChaos();
  };

  maintainChaos = () => {
    this.promises = this.promises.filter((p) => !p.resolved);
    for (let i = 0; i < this.n - this.promises.length; i++) {
      const coinflip = Math.round(Math.random());
      if (coinflip) this.scheduleConnect();
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
          await this.herd.dropClient();
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
