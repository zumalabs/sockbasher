#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { program } from "commander";

import { fetchAuthTokens } from "./auth"
import { getAuthedWebsocket } from "./client";

clear();
console.log(
  chalk.red(figlet.textSync("sockbasher", { horizontalLayout: "full" }))
);

async function authHandler (env: any, options: any) {
    const { user, password, host } = program.opts();
    if (!host) program.help();
    const auth_endpoint = `https://${host}/api/graphql`
    const ws_endpoint = `ws://${host}/graphql`

    try {
        const auth = await fetchAuthTokens(user, password, auth_endpoint)
        const ws = getAuthedWebsocket(ws_endpoint, auth.tokenAuth.token, console.log);
    } catch (e) {
        console.log(e);
    }
}

program
  .description("bash the sock", {
    url: "the sock to bash",
  })
  .option(
    "-e, --endpoint <endpoint>",
    "Endpoint",
    "ws://localhost:3000/graphql"
  )
  .option("-n <number>", "Number of websocket connections", parseInt, 10)
  .option("-u, --user <user>", "User", "bill")
  .option("-p, --password <password>", "Password", "bill")
  .option("-t, --token <token>", "Auth token", "bla")
  .action(authHandler)
  .parse(process.argv);
