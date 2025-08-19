const { Pool } = require('pg');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
};

if (process.env.DB_SOCKET_PATH) {
  config.host = `${process.env.DB_SOCKET_PATH}/${process.env.DB_CONNECTION_NAME}`;
} else {

  config.host = process.env.DB_HOST;
  config.port = process.env.DB_PORT;
}

const pool = new Pool(config);

module.exports = pool;