
import chalk from "chalk";
import * as fs from "fs";
import { config } from "../../index";

const service_writeStream: fs.WriteStream = fs.createWriteStream("./logs/service.log");
const errors_writeStream: fs.WriteStream = fs.createWriteStream("./logs/errors.log");
const actions_writeStream: fs.WriteStream = fs.createWriteStream("./logs/actions.log");
const connections_writeStream: fs.WriteStream = fs.createWriteStream("./logs/connections.log");
const svelte_writeStream: fs.WriteStream = fs.createWriteStream("./logs/svelte.log");
const stripe_writeStream: fs.WriteStream = fs.createWriteStream("./logs/stripe.log");

const console_colors: object | any  = {
    'service': 'green',
    'accounts': 'cyan',
    'errors': 'red',
    'actions': 'magenta',
    'connections': 'yellow',
    'svelte': 'blue',
    'stripe': 'cyan'
}

/**
 * This will colorize and prettify console content
 * @param log_type type of log
 * @param contents type of contents
 * @returns string
 */
function edit_ConsoleLogContent(log_type: string, contents: string): string {

    const dateString: string = chalk.yellow(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`);
    const logString: string = chalk[console_colors[log_type]](`[${log_type.toUpperCase()}]`);

    return `${dateString} ${logString} ${contents}\n`;

}

/**
 * This will prettify the content of a string into something that can be formatted in a .log file
 * @param log_type string
 * @param contents string
 * @returns string
 */
function edit_LogContent(log_type: string, contents: string): string {

    const dateString: string = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`;
    const logString: string = `[${log_type.toUpperCase()}]`;

    return `${dateString} ${logString} ${contents}\n`;

}

/**
 * This will log into a log file, and will log into console if console_log is true
 * @param log_type string
 * @param contents string
 * @param console_log boolean
 */
export function write_to_logs(log_type: string, contents: string, console_log: boolean = false): void {

    const log_contents: string = edit_ConsoleLogContent(log_type, contents);
    contents = edit_LogContent(log_type, contents);

    if (console_log)
        console.log(log_contents);

    const detailed_log_type: Array<string> = log_type.split(":");

    switch (detailed_log_type[0]) {

        case 'stripe':
            if (!config.server.logs.stripe_logs)
                break;

            stripe_writeStream.write(
                contents
            );
            break;
        case 'svelte':
            if (!config.server.logs.svelte_logs)
                break;

            svelte_writeStream.write(
                contents
            );
            break;
        case 'errors':

            if (!config.server.logs.error_logs)
                break;
            errors_writeStream.write(
                contents
            );
            break;
        case 'service':

            if (!config.server.logs.service_logs)
                break;
            service_writeStream.write(
                contents
            );
            break;
        case 'actions':

            if (!config.server.logs.actions_logs)
                break;

            actions_writeStream.write(contents);
            break;
        case 'connections':
            if (!config.server.logs.connections_logs)
                break;

            connections_writeStream.write(contents);
            break;

    }

}
