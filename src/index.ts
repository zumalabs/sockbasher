#!/usr/bin/env node

import banner from "./banner";
import { program } from "commander";
import { setDebug } from "./debug";
import { statusReport } from "./status";

import { fetchAuthTokens } from "./auth";
import ClientHerd from "./ClientHerd";
import ClientFlock from "./ClientFlock";

banner();

program
  .description("bash the sock", {
    url: "the sock to bash",
  })
  .option("-e, --host <host>", "Host", "localhost:3000")
  .option("-n, --num <num>", "Number of websocket connections", "10")
  .option("-u, --user <user>", "User", "bill")
  .option("-p, --password <password>", "Password", "bill")
  .option("-t, --token <token>", "Auth token")
  .option(
    "-m, --num-unstable <numUnstable>",
    "Number of unstable clients to add",
    "10"
  )
  .option(
    "-f, --freq-unstable <freqUnstable>",
    "Unstable client state change frequency (/second)",
    "1"
  )
  .option("-w, --wait <wait>", "Amount of time to wait for each websocket to consume the message (seconds)", "0")
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
  wait,
  debug,
} = program.opts();

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
    const herd = new ClientHerd(
      wsEndpoint,
      authToken,
      statusReport,
      parseInt(num),
      parseInt(wait),
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
