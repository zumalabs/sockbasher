#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { program } from "commander";

clear();
console.log(
  chalk.red(figlet.textSync("sockbasher", { horizontalLayout: "full" }))
);

program
  .arguments("<url>")
  .description("bash the sock", {
    url: "the sock to bash",
  })
  .option("-u, --user", "User")
  .option("-p, --password", "Password")
  .parse(process.argv);

const { host, user, password } = program.opts();
if (!host) program.help();
