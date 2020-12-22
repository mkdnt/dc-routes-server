const app = require("./app");
const { PORT, TEST_DB_URL } = require("./config");
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: TEST_DB_URL
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Express server is listening at http://localhost:${PORT}`);
});
