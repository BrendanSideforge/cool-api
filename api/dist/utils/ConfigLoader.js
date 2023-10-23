"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigLoader = void 0;
const tslib_1 = require("tslib");
const yaml = tslib_1.__importStar(require("js-yaml"));
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
/**
 * Load the configs from a yaml file
 * @param directory - string
 */
function ConfigLoader(filename) {
    const directory_path = path.join("../config", filename);
    const directory_file = fs.readFileSync(directory_path, 'utf8');
    const config = yaml.load(directory_file);
    return config;
}
exports.ConfigLoader = ConfigLoader;
