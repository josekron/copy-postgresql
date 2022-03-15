# Overview

Copy a postgres database to another postgres database

### Running Locally

* Requirements:
* * Postgres database installed with a database `postgres`
* * Restore the backup in the folder `src/backup/init.sql`
* * Note: I'm using the same database for restoring the backup but it can be
configured in the file `/src/config/configDB.js`
* `cd src` & `npm install`
* `node index.js`
* `http://localhost:3000/restoredb`

### Running Tests

* `npm test`

Note: only tested the configuration files for the database connection and the
tables to anonymise.

### Running Local Docker Container

* uncomment line `host: 'host.docker.internal',` in the file `src/config/configDB.js`
* `docker build -t liftdocker .`
* `docker compose up --build`
* `http://localhost:3000/restoredb`

Note: it will fail due to an issue with having postgres and the app in the same
docker container.

`await execute(`pg_dump ${this._configDB.database} > ${backupFile}`,);`

I tried it in different ways (child_process, execute) but didn't work.
