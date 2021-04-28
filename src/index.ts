#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { program } from "commander";

import ClientHerd from "./clientHerd";

clear();
console.log(
  chalk.red(figlet.textSync("sockbasher", { horizontalLayout: "full" }))
);

program
  .description("bash the sock", {
    url: "the sock to bash",
  })
  .option(
    "-e, --endpoint <endpoint>",
    "Endpoint",
    "ws://localhost:3000/graphql"
  )
  .option("-n <num>", "Number of websocket connections", parseInt, 10)
  .option("-u, --user <user>", "User", "bill")
  .option("-p, --password <password>", "Password", "bill")
  .option("-t, --token <token>", "Auth token", "bla")
  .parse(process.argv);

const { token, endpoint, num } = program.opts();
if (!endpoint) program.help();

try {
  const herd = new ClientHerd(
    endpoint,
    token,
    (herd) => console.log(chalk.magenta(herd)),
    num
  );
} catch (e) {
  console.log(e);
}
