// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');


// MySQL DB Connection Information (remember to change this with our specific credentials)
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Packers11",
  database: "employee_trackerDB"
});

// Initiate MySQL Connection.
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

let sqlQuery =  "SELECT * FROM employee " +
                "INNER JOIN role ON employee.id = role.id " +
                "INNER JOIN department ON role.department_id = department.id"

connection.query(sqlQuery, function(err, result) {
    if (err) throw err;
    console.table(result);
});

