"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteLoader = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const index_1 = require("../index");
const Logger_1 = require("./Logger");
/**
 * Loads static exports from the "routes" folder
 * @param app express.Application
 */
function RouteLoader(app) {
    fs.readdir("./dist/routes", async (err, filenames) => {
        if (err)
            return console.error(`[ROUTE INIT] ${err}`);
        filenames.forEach(async (filename) => {
            if (!filename.endsWith(".js"))
                return;
            const filename_without_suffix = filename.split(".js")[0];
            const route_string = `/${index_1.config.server.api_path}/${filename_without_suffix}`;
            try {
                const default_export = await (await Promise.resolve(`${`../routes/${filename}`}`).then(s => tslib_1.__importStar(require(s)))).default;
                app.use(route_string, default_export);
                // let routes = [];
                // for (let i: number = 0; i < default_export.stack.length; i++) {
                //     console.log(default_export.stack[i]);
                // }
                (0, Logger_1.write_to_logs)('service', `${route_string} has been loaded.`, true);
            }
            catch (e) {
                (0, Logger_1.write_to_logs)('errors', `${route_string} has failed: \n ${e}`, true);
            }
        });
    });
}
exports.RouteLoader = RouteLoader;
