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
            case "Add Employee":
                addEmployee();
            break;
            case "Update Employee Role":
                updateEmployeeRole();
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
    "role.title as 'Title', role.salary as 'Salary', department.name as 'Department', employee.manager_id as 'Manager ID' " +
    "FROM employee " +
    "INNER JOIN role ON employee.role_id = role.id " +
    "INNER JOIN department ON department.id = role.department_id " +
    "ORDER BY employee.id;"

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
         let sqlQuery =  "INSERT INTO department (name) VALUES ( ? );"

    connection.query(sqlQuery, answer.department, function(err, result) {
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
            connection.query("SELECT department.id FROM department WHERE department.name = ?", answer.depart, function(err, result2) {
                if (err) throw err;

                let sqlQuery =  "INSERT INTO role (title, salary, department_id) VALUES ( ?, ? , ? );"

                connection.query(sqlQuery, [answer.title, parseInt(answer.salary), result2[0].id], function(err, result3) {
                    if (err) throw err;
                    console.log(answer.title + " successfully added.")
                    mainMenu();
                });
            }); 
        });
    });
};

function addEmployee(){
    const empRole = [];
    const empManager = ["No Manager"];
    connection.query("SELECT role.title FROM role ORDER BY role.id;", function(err, result) {
        if (err) throw err;

            connection.query("SELECT employee.first_name, employee.last_name FROM employee ORDER BY employee.id;", function(err, result2) {
                if (err) throw err;
                for (var j = 0; j < result2.length; j++){
                    empManager.push(result2[j].first_name + " " + result2[j].last_name)
                }
            });
            
        for (var i = 0; i < result.length; i++){
            empRole.push(result[i].title)
        }
        inquirer.prompt([{
            type: "input",
            message: "What is the Employee First Name you would like to add?",
            name: "firstName",
        },
        {
            type: "input",
            message: "What is the Employee Last Name you would like to add?",
            name: "lastName",
        },
        {   type: "list",
            message: "What Role is this new employee assigned to?",
            name: "assignedRole",
            choices: empRole
        },
        {   type: "list",
            message: "What Manager is this new employee assigned to?",
            name: "assignedManager",
            choices: empManager
        }])
        .then (function(answer){
            console.log(answer.assignedRole);
            connection.query("SELECT role.id FROM role WHERE role.title = ? ;", answer.assignedRole, function(err, result3) {
                if (err) throw err;
                    if (answer.assignedManager  == "No Manager"){
                       
                        let sqlQuery =  "INSERT INTO employee (first_name, last_name, role_id) VALUES ( ?, ? , ? );"

                        connection.query(sqlQuery, [answer.firstName, answer.lastName, result3[0].id], function(err, result4) {
                            if (err) throw err;
                            console.log(answer.firstName + " " + answer.lastName + " successfully added.")
                            mainMenu();
                        });
                    } else {
                        console.log("Employee: " + answer.firstName  + " Last Name: " + answer.lastName + " Role: " + answer.assignedRole + " Manager: " + answer.assignedManager);

                        
                            connection.query("SELECT employee.id from employee where concat_ws(' ',first_name,last_name) like ?;", answer.assignedManager, function(err, result4) {
                                if (err) throw err;
                                
                                let sqlQuery =  "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ( ?, ?, ?, ? );"

                                connection.query(sqlQuery, [answer.firstName, answer.lastName, result3[0].id, result4[0].id], function(err, result5) {
                                    if (err) throw err;
                                    console.log(answer.firstName + " " + answer.lastName + " successfully added.")
                                    mainMenu();
                                });

                            });

                    }                    
            }); 
        });
    });
};

function updateEmployeeRole(){
    let employeeList = [];
    connection.query("SELECT employee.id, employee.first_name, employee.last_name from employee", function(err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++){
            employeeList.push(result[i].first_name + " " + result[i].last_name)
        }
        inquirer.prompt([{
            type: "list",
            message: "What Employee would you like to update their role?",
            name: "empChoice",
            choices: employeeList
        }])
        .then (function(answer){
            let roleList = [];
            connection.query("SELECT role.title from role;", function(err, result1) {
                if (err) throw err;
                for (var j = 0; j < result1.length; j++){
                    roleList.push(result1[j].title)
                }
                inquirer.prompt([{
                    type: "list",
                    message: "What Role would you like " + answer.empChoice + " to have?",
                    name: "roleChoice",
                    choices: roleList
                }])
                .then (function(answer1){
                    connection.query("SELECT role.id from role WHERE role.title = ?;", answer1.roleChoice, function(err, result1) {
                        if (err) throw err;
                        connection.query("SELECT employee.id from employee where concat_ws(' ',first_name,last_name) like ?;", answer.empChoice, function(err, result2) {
                            if (err) throw err;
                                connection.query("UPDATE employee SET role_id = ? WHERE id = ?;", [result1[0].id, result2[0].id], function(err, result2) {
                                console.log("Updated role for " + answer.empChoice);
                                mainMenu();
                                });
                        });
                    });
                });
            });

           
    
        });
    });
};