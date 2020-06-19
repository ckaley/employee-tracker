// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const banner =  "-----------------------------------\n" +
                "|                                 |\n" +
                "|     Employee Tracking System    |\n" +
                "|                                 |\n" +
                "-----------------------------------\n";

// Main Menu Options
const menuList = {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    pageSize: "8",
    choices: [
      "View Departments",
      "View Employees",
      "View Roles",
      "Add Department",
      "Add Employee",
      "Add Role",
      "Update Employee Role",
      "Exit"
    ]
  };

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
    console.log(banner);
    mainMenu()
});

// Set the Main Menu funciton
function mainMenu() {
    inquirer.prompt(menuList)
    .then (function (answer) {
        // Based upon their answer, select the right path
        switch(answer.choice) {
            case "View Employees":
                viewEmployees();
            break;
            case "View Departments":
                viewDepartments();
            break;
            case "View Roles":
                viewRoles();
            break;
            case "Add Department":
                addDepartment();
            break;
            case "Add Role":
                addRole();
            break;
            case "Exit":
                // This selection is when the user selects to exit the application
                console.log("End CRM Application")
                connection.end();
            break;
        }
    });
}

function viewDepartments(){
    // Function to Display All Employees
    let sqlQuery =  "SELECT department.id, department.name as 'Department'" +
    "FROM department " +
    "ORDER BY department.id"

    connection.query(sqlQuery, function(err, result) {
        if (err) throw err;
        console.table(result);
        mainMenu();
    });
}

function viewEmployees(){
    // Function to Display All Employees
    let sqlQuery =  "SELECT employee.id, employee.first_name as 'First Name', employee.last_name as 'Last Name', " +
    "role.title as 'Title', role.salary as 'Salary', department.name as 'Department'" +
    "FROM employee " +
    "INNER JOIN role ON employee.id = role.id " +
    "INNER JOIN department ON role.department_id = department.id " +
    "ORDER BY employee.id"

    connection.query(sqlQuery, function(err, result) {
        if (err) throw err;
        console.table(result);
        mainMenu();
    });
}

function viewRoles(){
    // Function to Display All Employees
    let sqlQuery =  "SELECT role.id, role.title as 'Title', role.salary as 'Salary'" +
    "FROM role " +
    "ORDER BY role.id"

    connection.query(sqlQuery, function(err, result) {
        if (err) throw err;
        console.table(result);
        mainMenu();
    });
}

function addDepartment(){
    inquirer.prompt({
        type: "input",
        message: "What is the Department name you would like to add?",
        name: "department",
    })
    .then (function (answer){
         let sqlQuery =  "INSERT INTO department (name) VALUES ('" + answer.department + "');"

    connection.query(sqlQuery, function(err, result) {
        if (err) throw err;
        console.log(answer.department + " successfully added.")
        mainMenu();
    });
    })
}

function addRole(){
    const depart = [];
    connection.query("SELECT department.name FROM department ORDER BY department.id", function(err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++){
            depart.push(result[i].name)
        }
        inquirer.prompt([{
            type: "input",
            message: "What is the Role you would like to add?",
            name: "title",
        },
        {
            type: "input",
            message: "What is Salary for this role?",
            name: "salary",
        },
        {   type: "list",
            message: "What Department is this Role in?",
            name: "depart",
            choices: depart
        }])
        .then (function(answer){
            connection.query("SELECT department.id FROM department WHERE department.name = '" + answer.depart +"'", function(err, result2) {
                if (err) throw err;

                console.log("Role:" + answer.title  + " Salary:" + answer.salary + " Department: " + result2[0].id);

                let sqlQuery =  "INSERT INTO role (title, salary, department_id) VALUES ('" + answer.title + "','" + parseInt(answer.salary) +"','" + result2[0].id + "');"

                connection.query(sqlQuery, function(err, result3) {
                    if (err) throw err;
                    console.log(answer.title + " successfully added.")
                    mainMenu();
                });
            }); 
        });
    });
};

