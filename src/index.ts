#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { program } from "commander";

import { fetchAuthTokens } from "./auth";
import ClientHerd from "./clientHerd";

clear();
console.log(
  chalk.red(figlet.textSync("sockbasher", { horizontalLayout: "full" }))
);

async function authHandler(env: any, options: any) {
  const { user, password, token, host, num } = program.opts();
  if (!host) program.help();
  const secure = !host.includes("localhost");
  const authEndpoint = `${secure ? "https" : "http"}://${host}/api/graphql`;
  const wsEndpoint = `${secure ? "wss" : "ws"}://${host}/graphql`;

  try {
    const authToken = await fetchAuthTokens(
      user,
      password,
      authEndpoint,
      token
    );
    const herd = new ClientHerd(
      wsEndpoint,
      authToken,
      (herd) => console.log(chalk.magenta(herd)),
      num
    );
  } catch (e) {
    console.log(e);
  }
}

program
  .description("bash the sock", {
    url: "the sock to bash",
  })
  .option("-e, --host <host>", "Host", "localhost:3000")
  .option("-n, --num <num>", "Number of websocket connections", parseInt, 3)
  .option("-u, --user <user>", "User", "bill")
  .option("-p, --password <password>", "Password", "bill")
  .option("-t, --token <token>", "Auth token")
  .action(authHandler)
  .parse(process.argv);
