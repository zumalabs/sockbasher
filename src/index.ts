#!/usr/bin/env node

import banner from "./banner";
import { program } from "commander";
import { setDebug } from "./debug";
import { statusReport } from "./status";

import { fetchAuthTokens } from "./auth";
import ClientHerd from "./clientHerd";
import ClientFlock from "./ClientFlock";

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
  .option(
    "-m, --num-unstable <numUnstable>",
    "Number of unstable clients to add",
    "1"
  )
  .option(
    "-f, --freq-unstable <freqUnstable>",
    "Unstable client state change frequency (/second)",
    "1"
  )
  .option("-d, --debug", "Debug mode")
  .parse(process.argv);

const {
  user,
  password,
  token,
  host,
  num,
  numUnstable,
  freqUnstable,
  debug,
} = program.opts();
if (!host) program.help();
if (debug) setDebug();
const secure = !host.includes("localhost");
const authEndpoint = `${secure ? "https" : "http"}://${host}/api/graphql`;
const wsEndpoint = `${secure ? "wss" : "ws"}://${host}/graphql`;

// console.log(numUnstable, parseInt(numUnstable));
// console.log(freqUnstable, parseFloat(freqUnstable));

const main = (async () => {
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
      statusReport,
      parseInt(num)
    );
    const flock = new ClientFlock(
      wsEndpoint,
      authToken,
      statusReport,
      parseInt(numUnstable),
      parseFloat(freqUnstable)
    );
    process.on("SIGINT", () => process.exit(herd.consistent ? 0 : 1));
    await herd.ready;
  } catch (e) {
    console.log(e);
  }
})();
