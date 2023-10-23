/**
 * Get the enviornment api key for stripe
 * @return stripe api key
 */
export declare function getStripeAPIKey(): string;
/**
 * Get the database credentials for a database that is in the configuration.
 * redis
 * postgresql
 * @param database string
 * @returns string | object
 */
export declare function getDatabaseCredentials(database: string): any;
