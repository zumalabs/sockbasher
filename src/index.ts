#!/usr/bin/env node

import banner from "./banner";
import { program } from "commander";
import { setDebug } from "./debug";
import { statusReport } from "./status";

import { fetchAuthTokens } from "./auth";
import ClientHerd from "./clientHerd";

banner();

program
  .description("bash the sock", {
    url: "the sock to bash",
  })
  .option("-e, --host <host>", "Host", "localhost:3000")
  .option("-n, --num <num>", "Number of websocket connections", "3")
  .option("-u, --user <user>", "User", "bill")
  .option("-p, --password <password>", "Password", "bill")
  .option("-t, --token <token>", "Auth token")
  .option("-d, --debug", "Debug mode")
  .parse(process.argv);

const { user, password, token, host, num, debug } = program.opts();
if (!host) program.help();
if (debug) setDebug();
const secure = !host.includes("localhost");
const authEndpoint = `${secure ? "https" : "http"}://${host}/api/graphql`;
const wsEndpoint = `${secure ? "wss" : "ws"}://${host}/graphql`;

const main = (async () => {
  try {
    const authToken = await fetchAuthTokens(
      user,
      password,
      authEndpoint,
      token
    );
    const herd = new ClientHerd(wsEndpoint, authToken, statusReport, parseInt(num));
    process.on("SIGINT", () => process.exit(herd.consistent ? 0 : 1));
    await herd.ready;
  } catch (e) {
    console.log(e);
  }
})();
