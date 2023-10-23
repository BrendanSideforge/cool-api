"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseCredentials = exports.getStripeAPIKey = void 0;
const __1 = require("..");
/**
 * Get the enviornment api key for stripe
 * @return stripe api key
 */
function getStripeAPIKey() {
    const arg = process.argv[2];
    let apiKey = "";
    switch (arg) {
        case "prod":
            apiKey = __1.config.stripe.prod_secret_key;
            break;
        case "dev":
            apiKey = __1.config.stripe.test_secret_key;
            break;
    }
    return apiKey;
}
exports.getStripeAPIKey = getStripeAPIKey;
/**
 * Get the database credentials for a database that is in the configuration.
 * redis
 * postgresql
 * @param database string
 * @returns string | object
 */
function getDatabaseCredentials(database) {
    let credentials;
    const arg = process.argv[2];
    switch (database) {
        case "postgresql":
            switch (arg) {
                case "prod":
                    credentials = __1.config.database.prod;
                    break;
                case "dev":
                    credentials = __1.config.database.dev;
                    break;
            }
            break;
        case "redis":
            switch (arg) {
                case "prod":
                    credentials = __1.config.redis.prod;
                    break;
                case "dev":
                    credentials = __1.config.redis.dev;
                    break;
            }
    }
    if (credentials.url) {
        credentials = {
            url: credentials.url
        };
    }
    return credentials;
}
exports.getDatabaseCredentials = getDatabaseCredentials;
