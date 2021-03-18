const mysql = require("mysql");
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "fact12345",
  database: "smc_test",
});
//stackoverflow.com/questions/43560213/connection-query-is-not-a-function-node-js-mysql
mysqlConnection.connect(function (err) {
  //muestra error de conexion por consola
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("DB is connected");
  }
});

module.exports = mysqlConnection;
