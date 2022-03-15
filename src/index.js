const Database = require('./client/database');
const Worker = require('./client/worker');
const { configDB1, configDB2 } = require("./config/configDB");
const { configColumns } = require("./config/configColumns");

const express = require('express');
const app = express();
const port = 3000;

/**
 * @author Jose AHP
 */
app.get('/restoredb', async (req, res) => {
  try {

    const worker = new Worker(new Database(configDB1), new Database(configDB2), configColumns);
    await worker.process();

  } catch (error) {
    console.log(error);
    res.status(500).send(new Error(error));
  }

  res.send('Ok');

})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
