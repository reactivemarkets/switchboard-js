import * as yargs from "yargs";

export const parseCommandLine = (commandLine: string[]) => {
    return yargs
        .env("REACTIVE_PLATFORM")
        .config()
        .option("api-key", {
            description: "The switchboard API key",
            string: true,
        })
        .option("markets", {
            alias: "m",
            array: true,
            default: ["BTCUSD-CNB"],
        })
        .strict()
        .parse(commandLine);
};
