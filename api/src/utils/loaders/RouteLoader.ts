
import express from "express";
import * as fs from "fs";
import { config } from "../../index";
import { write_to_logs } from "../cache/Logger";

/**
 * Loads static exports from the "routes" folder
 * @param app express.Application
 */

export function RouteLoader(app: express.Application): void {

    fs.readdir("./dist/routes", async (err: any, filenames: Array<string>) => {
        if (err) return console.error(`[ROUTE INIT] ${err}`);

        filenames.forEach(async (filename: string) => {
            
            if (!filename.endsWith(".js")) return;
            const filename_without_suffix = filename.split(".js")[0];
            const route_string: string = `/${config.server.api_path}/${filename_without_suffix}`;

            try {
                const default_export: any = await (await import(`../routes/${filename}`)).default;

                app.use(route_string, default_export);

                // let routes = [];
                // for (let i: number = 0; i < default_export.stack.length; i++) {
                //     console.log(default_export.stack[i]);
                // }

                write_to_logs('service', `${route_string} has been loaded.`, true);
            } catch(e) {
                write_to_logs('errors', `${route_string} has failed: \n ${e}`, true)
            }

        });
    })

}
