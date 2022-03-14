const { Client } = require("pg");
const { execute } = require('@getvim/execute');
const { Logger } = require('./logger');
// const { exec } = require("child_process");

/**
 * Class to communicate with the database
 */
module.exports = class DatabaseClient {

    constructor(configDB) {
        Logger.info(`Initialising database client - ${configDB.database}`);
        this._configDB = configDB;
        this._currentDay = this._getCurrentDate();
    }

    /**
     * Export a "backup" of the database
     * @returns 
     */
    async backup() {
        Logger.debug(`Start to back up db ${this._configDB.database}`);

        let backupFile = `./backup/backup_${this._currentDay}.sql`;

        try {

            // not the best practice because we are logging the credentials
            // await exec(`pg_dump -a postgresql://${this._configDB.user}@${this._configDB.host}:5432/${cthis._onfigDB.database} > ${backupFile}`);

            await execute(`pg_dump ${this._configDB.database} > ${backupFile}`,);

            Logger.debug(`Backup for db ${this._configDB.database} done.`);

        } catch (error) {
            throw new Error(`Error importing schema for the db: ${error.message}`);
        }

        return backupFile;
    }

    /**
     * Method for restoring a backup into the database
     * @param {*} schemaFile 
     */
    async restoreBackup(schemaFile) {
        await this._dropDatabase();
        await this._importSchema(schemaFile);
    }

    /**
     * Import a schema into the database
     * @param {*} schemaFile 
     */
    async _importSchema(schemaFile) {
        Logger.debug(`Importing schema from ${schemaFile} into db ${this._configDB.database}`);

        try {

            // not the best practice because we are logging the credentials
            // await exec(`psql -h localhost -d ${this._configDB.database} -U ${this._configDB.user} -f ${schemaFile}`);

            await execute(`psql -d ${this._configDB.database} -f ${schemaFile}`,);

            Logger.debug(`Schema imported for db ${this._configDB.database}.`);

        } catch (error) {
            throw new Error(`Error importing schema for the db: ${error.message}`);
        }
    }

    /**
     * Drop the database
     */
    async _dropDatabase() {
        Logger.debug(`Dropping db ${this._configDB.database}`);

        try {
            await this._dropSchema();
            await this._createPublicSchema();

        } catch (error) {
            throw new Error(`Error dropping the database: ${error.message}`);
        }
    }

    async _dropSchema() {
        const postgresClient = new Client(this._configDB);
        postgresClient.connect();

        await postgresClient.query('DROP SCHEMA public CASCADE;')
        await postgresClient.end();
    }

    async _createPublicSchema() {
        const postgresClient = new Client(this._configDB);
        postgresClient.connect();

        await postgresClient.query('CREATE SCHEMA public;');
        await postgresClient.end();
    }

    /**
     * Check if every table contains any column passed by parameter and anonymise them
     * @param {*} columns 
     */
    async anonymisedColumnsTables(columns) {
        // Create a function in the database for retrieving random values.
        await this._createFunctionRandomWords();

        // Retrieve all the tables.
        let tables = await this._getTables();
        console.log(tables);

        // For each table, check if they contain the columns to anonymise.
        for (let t in tables) {
            for (let c in columns) {

                let tableName = tables[t].table_fullname.split('.')[1];
                if (await this._isColumnInTable(tableName, columns[c].name)) {

                    Logger.debug(`Table ${tableName} contains column ${columns[c].name} -> anonymise`);
                    this._anonymisedColumns(tableName, columns[c].name, columns[c].values);
                }
            }
        }
    }

    /**
     * Anonymise a column of a table
     * @param {*} table 
     * @param {*} column 
     * @param {*} values 
     */
    async _anonymisedColumns(table, column, values) {
        try {
            const postgresClient = new Client(this._configDB);
            postgresClient.connect();

            let vals = '';
            for (let v in values) {
                vals = vals + "'" + values[v] + "'";
                if (v < values.length - 1) {
                    vals = vals + ",";
                }
            }

            await postgresClient.query('UPDATE "' + table + '" SET "' + column + '" = ' + "random_words(array[" + vals + "]);");

            await postgresClient.end();

        } catch (error) {
            throw new Error(`Error while anonymise columns: ${error.message}`);
        }
    }

    /**
     * Check if a table contains a specific column
     * @param {*} table 
     * @param {*} column 
     * @returns 
     */
    async _isColumnInTable(table, column) {
        try {
            const postgresClient = new Client(this._configDB);
            postgresClient.connect();

            let query = 'SELECT column_name\n'
                + 'FROM information_schema.columns\n'
                + `WHERE table_name='${table}' AND column_name='${column}';`;

            const res = await postgresClient.query(query);

            await postgresClient.end()

            return res.rowCount > 0;

        } catch (error) {
            throw new Error(`Error getting columns: ${error.message}`);
        }
    }

    async _getTables() {
        try {
            const postgresClient = new Client(this._configDB);
            postgresClient.connect();

            let query = "SELECT table_schema||'.'||table_name as table_fullname\n"
                + 'FROM information_schema."tables"\n'
                + "WHERE table_type = 'BASE TABLE'\n"
                + "AND table_schema not in ('pg_catalog', 'information_schema');"

            const res = await postgresClient.query(query);

            await postgresClient.end();

            return res.rows;

        } catch (error) {
            throw new Error(`Error getting tables: ${error.message}`);
        }
    }

    /**
     * Creates a function in Postgresql which return a random value from a list
     */
    async _createFunctionRandomWords() {
        try {
            const postgresClient = new Client(this._configDB);
            postgresClient.connect();

            let query = 'CREATE OR REPLACE FUNCTION random_words(choices text[])\n'
                + '  RETURNS text\n'
                + '  LANGUAGE plpgsql\n'
                + 'AS\n'
                + '$$\n'
                + 'DECLARE\n'
                + 'BEGIN\n'
                + '  RETURN (choices)[floor(random()*array_length(choices, 1))+1];\n'
                + 'END;\n'
                + '$$;\n'

            await postgresClient.query(query);

            await postgresClient.end()

        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    _getCurrentDate() {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    }
}