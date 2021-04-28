import ClientHerd from "./ClientHerd";
import chalk from "chalk";
import debug from "./debug";

enum Status {
  Consistent,
  Inconsistent,
}

export function statusReport(herd: ClientHerd) {
  const status = herd.consistent ? Status.Consistent : Status.Inconsistent;

  if (status === Status.Consistent) {
    console.log(chalk.white("Status: "), chalk.bgGreen("Consistent"));
  } else {
    console.log(chalk.magenta(herd));
    console.log(chalk.white("Status: "), chalk.bgRed("Inconsistent"));
  }
}
