const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "hotwax",
  multipleStatements: true,
});

pool.on("error", (err) => {
  console.log("Error in pool", err);

  console.log("Db connected");
});

module.exports = pool;
