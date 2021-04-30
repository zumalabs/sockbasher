import ClientHerd from "./ClientHerd";
import chalk from "chalk";
import banner from "./banner";
import { debugMode } from "./debug";

let errorTimer: any

export function statusReport(herd: ClientHerd) {
  const status = herd.consistent
    ? chalk.bgGreen("Consistent")
    : chalk.bgRed("Inconsistent");
  const numSocks = chalk.cyanBright(herd.numSocks);

  if (!debugMode) banner();

  if (!herd.consistent) {
    clearTimer()
    errorTimer = setTimeout(function() {
      logStatus(numSocks, status)
      console.log(chalk.magenta(herd));
    }, herd.waitForErrorMillis);
  } else {
    clearTimer()
    logStatus(numSocks, status)
  }
}

function clearTimer() {
  if (errorTimer) {
    clearTimeout(errorTimer)
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
