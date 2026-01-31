const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "mysql-298e82d9-myrp-0530.i.aivencloud.com",
  port: 18349,
  user: "avnadmin",
  password: "AVNS_-aTSgL7Kmsebu3q0dfv",
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool.promise();
