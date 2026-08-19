const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "YOUR_DATABASE_NAME",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected");
    connection.release();
  }
});

module.exports = db;