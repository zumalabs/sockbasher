import ClientHerd from "./ClientHerd";
import chalk from "chalk";
import banner from "./banner";
import { debugMode } from "./debug";

export function statusReport(herd: ClientHerd) {
  const status = herd.consistent
    ? chalk.bgGreen("Consistent")
    : chalk.bgRed("Inconsistent");
  const numSocks = chalk.blue(herd.numSocks);

  if (!debugMode) banner();
  console.log(
    chalk.white("Num socks: "),
    numSocks,
    chalk.white("Status: "),
    status
  );
  if (!herd.consistent) console.log(chalk.magenta(herd));
}
