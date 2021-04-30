import ClientHerd from "./ClientHerd";

class ClientFlock {
  private herd: ClientHerd;
  private changeCallback: () => void = () => {};
  private promises: Promise<void>[] = [];

  constructor(
    url: string,
    authToken: string,
    changeCallback?: (flock: ClientFlock) => void,
    n: number = 0,
    f: number = 100 // avg drop/reconn frequency in millis
  ) {
    this.herd = new ClientHerd(url, authToken);
    if (changeCallback) this.changeCallback = () => changeCallback(this);
  }
}

export default ClientFlock;
