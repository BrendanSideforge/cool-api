"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.write_to_logs = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs = tslib_1.__importStar(require("fs"));
const index_1 = require("../index");
const service_writeStream = fs.createWriteStream("./logs/service.log");
const errors_writeStream = fs.createWriteStream("./logs/errors.log");
const actions_writeStream = fs.createWriteStream("./logs/actions.log");
const connections_writeStream = fs.createWriteStream("./logs/connections.log");
const svelte_writeStream = fs.createWriteStream("./logs/svelte.log");
const stripe_writeStream = fs.createWriteStream("./logs/stripe.log");
const console_colors = {
    'service': 'green',
    'accounts': 'cyan',
    'errors': 'red',
    'actions': 'magenta',
    'connections': 'yellow',
    'svelte': 'blue',
    'stripe': 'cyan'
};
/**
 * This will colorize and prettify console content
 * @param log_type type of log
 * @param contents type of contents
 * @returns string
 */
function edit_ConsoleLogContent(log_type, contents) {
    const dateString = chalk_1.default.yellow(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`);
    const logString = chalk_1.default[console_colors[log_type]](`[${log_type.toUpperCase()}]`);
    return `${dateString} ${logString} ${contents}\n`;
}
/**
 * This will prettify the content of a string into something that can be formatted in a .log file
 * @param log_type string
 * @param contents string
 * @returns string
 */
function edit_LogContent(log_type, contents) {
    const dateString = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`;
    const logString = `[${log_type.toUpperCase()}]`;
    return `${dateString} ${logString} ${contents}\n`;
}
/**
 * This will log into a log file, and will log into console if console_log is true
 * @param log_type string
 * @param contents string
 * @param console_log boolean
 */
function write_to_logs(log_type, contents, console_log = false) {
    const log_contents = edit_ConsoleLogContent(log_type, contents);
    contents = edit_LogContent(log_type, contents);
    if (console_log)
        console.log(log_contents);
    const detailed_log_type = log_type.split(":");
    switch (detailed_log_type[0]) {
        case 'stripe':
            if (!index_1.config.server.logs.stripe_logs)
                break;
            stripe_writeStream.write(contents);
            break;
        case 'svelte':
            if (!index_1.config.server.logs.svelte_logs)
                break;
            svelte_writeStream.write(contents);
            break;
        case 'errors':
            if (!index_1.config.server.logs.error_logs)
                break;
            errors_writeStream.write(contents);
            break;
        case 'service':
            if (!index_1.config.server.logs.service_logs)
                break;
            service_writeStream.write(contents);
            break;
        case 'actions':
            if (!index_1.config.server.logs.actions_logs)
                break;
            actions_writeStream.write(contents);
            break;
        case 'connections':
            if (!index_1.config.server.logs.connections_logs)
                break;
            connections_writeStream.write(contents);
            break;
    }
}
exports.write_to_logs = write_to_logs;
