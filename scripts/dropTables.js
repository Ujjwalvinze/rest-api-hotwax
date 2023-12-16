const mysql = require("mysql");
const db = require("./connectDb");

const dropQuery = "DROP TABLE ";

db.query(orderHeaderQuery, (err, res) => {
  if (err) throw err;

  console.log("Query run!");
});
