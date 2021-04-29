import ClientHerd from "./ClientHerd";
import chalk from "chalk";
import banner from "./banner";
import { debugMode } from "./debug";
import clear from "clear";

let errorTimer: any
let shownBanner: boolean = false

export function statusReport(herd: ClientHerd) {
  const status = herd.consistent
    ? chalk.bgGreen("Consistent")
    : chalk.bgRed("Inconsistent");
  const numSocks = chalk.cyanBright(herd.numSocks);

  if (!debugMode) banner();
  // if (!debugMode) {
  //   if (!shownBanner) {
  //     banner()
  //     shownBanner = true
  //   } else {
  //     clear();
  //   }
  // }

  if (!herd.consistent) {
    errorTimer = setTimeout(function() {
      logStatus(numSocks, status)
      console.log(chalk.magenta(herd));
    }, herd.waitForErrorMillis);
  } else {
    logStatus(numSocks, status)
    if (errorTimer) {
      clearTimeout(errorTimer)
    }
  }
}

function logStatus(numSocks: string, status: string) {
  console.log(
      chalk.white("Num socks: "),
      numSocks,
      chalk.white("Status: "),
      status
  );
}
