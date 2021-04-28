#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { program } from "commander";

import { fetchAuthTokens } from "./auth"
import ClientHerd from "./clientHerd";

clear();
console.log(
  chalk.red(figlet.textSync("sockbasher", { horizontalLayout: "full" }))
);

async function authHandler (env: any, options: any) {
    const { user, password, token, host } = program.opts();
    if (!host) program.help();
    const auth_endpoint = `https://${host}/api/graphql`
    const ws_endpoint = `ws://${host}/graphql`

    try {
        const auth = await fetchAuthTokens(user, password, auth_endpoint)
        const herd = new ClientHerd(ws_endpoint, token || auth.tokenAuth.token, console.log, 3);
    } catch (e) {
        console.log(e);
    }
}

program
  .description("bash the sock", {
    url: "the sock to bash",
  })
  .option(
    "-h, --host <host>",
    "Host",
    "localhost:3000"
  )
  .option("-n <number>", "Number of websocket connections", parseInt, 10)
  .option("-u, --user <user>", "User", "bill")
  .option("-p, --password <password>", "Password", "bill")
  .option("-t, --token <token>", "Auth token", "-")
  .action(authHandler)
  .parse(process.argv);
