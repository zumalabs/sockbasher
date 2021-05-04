import ClientHerd from "./ClientHerd";
import ClientFlock from "./ClientFlock";
import chalk from "chalk";
import banner from "./banner";
import { debugMode } from "./debug";

class StatusReporter {
  private consistent?: boolean;
  private diff?: string;
  private status?: string;
  private nHerdSocks?: string;
  private nFlockSocks?: number;
  private errorTimer: any
  private waitForErrorMillis?: number;

  reportHerd = (herd: ClientHerd) => {
    this.consistent = herd.consistent;
    this.status = this.consistent
      ? chalk.bgGreen("Consistent")
      : chalk.bgRed("Inconsistent");
    this.nHerdSocks = chalk.cyanBright(herd.numSocks);
    this.diff = chalk.magenta(herd);
    this.waitForErrorMillis = herd.waitForErrorMillis;
    this.print();
  };

  reportFlock = (flock: ClientFlock) => {
    this.nFlockSocks = flock.numSocks;
    this.print();
  };

  print = () => {
    if (!debugMode) banner();
    const output: string[] = [];
    if (this.nHerdSocks)
      output.push(chalk.white("Num socks: "), this.nHerdSocks);
    if (this.status) output.push(chalk.white("Status: "), this.status);
    if (this.nFlockSocks !== undefined)
      output.push(chalk.white("Chaos Sockets: ", this.nFlockSocks));

    if (this.consistent === false) {
      this.clearTimer()
      const diff = this.diff
      this.errorTimer = setTimeout(function() {
        console.log(...output);
        console.log(diff)
      }, this.waitForErrorMillis);
    } else {
      this.clearTimer()
      console.log(...output);
    }
  };

  clearTimer = () => {
    if (this.errorTimer) {
      clearTimeout(this.errorTimer)
    }
  }
}

const statusReporter = new StatusReporter();

export function statusReport(collection: ClientHerd | ClientFlock) {
  if (collection instanceof ClientHerd) statusReporter.reportHerd(collection);
  else if (collection instanceof ClientFlock)
    statusReporter.reportFlock(collection);
}
