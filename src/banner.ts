import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export default function () {
  clear();
  console.log(
    chalk.red(figlet.textSync("sockbasher", { horizontalLayout: "full" }))
  );
}
