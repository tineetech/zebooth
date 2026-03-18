import mysql from "mysql2/promise";

const pool = mysql.createPool({
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "zebooth",
  // waitForConnections: true,
  // connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;