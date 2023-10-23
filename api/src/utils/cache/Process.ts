
import { config } from "../.."

/**
 * Get the enviornment api key for stripe
 * @return stripe api key
 */

export function getStripeAPIKey() {

    const arg: string = process.argv[2];
    let apiKey: string = "";

    switch (arg) {

        case "prod":
            apiKey = config.stripe.prod_secret_key;
            break;
        case "dev":
            apiKey = config.stripe.test_secret_key;
            break;

    }

    return apiKey;

}

/**
 * Get the database credentials for a database that is in the configuration.
 * redis
 * postgresql
 * @param database string
 * @returns string | object
 */
export function getDatabaseCredentials(database: string) {

    let credentials;
    const arg: string = process.argv[2];

    switch (database) {

        case "postgresql":

            switch (arg) {

                case "prod":
                    credentials = config.database.prod;
                    break;
                case "dev":
                    credentials = config.database.dev;
                    break;

            }
            break;

        case "redis":

            switch (arg) {
                case "prod":
                    credentials = config.redis.prod;
                    break;
                case "dev":
                    credentials = config.redis.dev;
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
