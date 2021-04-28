import ClientHerd from "./ClientHerd";
import chalk from "chalk";
import debug from "./debug";

enum Status {
  Consistent,
  Inconsistent,
}

export function statusReport(herd: ClientHerd) {
  const status = herd.consistent
    ? chalk.bgGreen("Consistent")
    : chalk.bgRed("Inconsistent");
  const numSocks = chalk.blue(herd.numSocks);

  if (!herd.consistent) console.log(chalk.magenta(herd));
  console.log(
    chalk.white("Num socks: "),
    numSocks,
    chalk.white("Status: "),
    status
  );
}
