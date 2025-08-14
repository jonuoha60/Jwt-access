import mysql from "mysql2";

//im using sql you can use any database of your choice like mongodb

const pool = mysql.createPool({
  host: "localhost",       // your MySQL host
  user: "root",            // your MySQL username
  password: "", // your MySQL password
  database: "users"  // your database name
});

export default pool.promise();
