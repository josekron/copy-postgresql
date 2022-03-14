const { Logger } = require('./logger');

/**
 * Main worker to do all the process of writing the data of one database into another database
 */
module.exports = class WorkerClient {

    constructor(databaseFrom, databaseTo, anonymisedColumns) {
        Logger.info('Initialising worker client');
        this.databaseFrom = databaseFrom;
        this.databaseTo = databaseTo;
        this.anonymisedColumns = anonymisedColumns;
    }

    /**
     * Main method to write the data of one database into another database
     */
    async process() {
        Logger.info('Process started');

        // 1 - Create a backup of the Production database.
        let backupFile = await this.databaseFrom.backup();
        
        // It'd be recommended to take a snapshot of the UAT database in case something goes wrong.
        Logger.info('A snapshot of the db should be taken before restoring backup');

        // 2 - Restore the backup on the UAT database.
        await this.databaseTo.restoreBackup(backupFile);

        // 3 - Anonymise the columns defined in a config file.
        await this.databaseTo.anonymisedColumnsTables(this.anonymisedColumns);

        Logger.info('Process finished');
    }
}