const mysql = require("mysql");
const inquirer = require("inquirer");
const sqlQueries = require("./lib/sqlQueries");

let departmentList = [];
let roleList = [];
let employeeList = [];

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306,
    user: "root",
    password: " ",
    database: "employee_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    createDepList();    // create the list (array) of departments
    createRoleList();   // create the list (array) of roles
    createEmpList();    // create the list (array) of employees
    init();             // run the init function after the connection is made
});

function init() {
    inquirer
    .prompt({
        type: "list",
        name: "task",
        message: "What would you like to do?",
        choices: [
            "Add Department", 
            "Add Role", 
            "Add Employee",
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Update Employee's Role",
            "Exit"
        ]
    })
    .then(function(answer) {
        switch(answer.task) {
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Update Employee's Role":
                updateEmployeeRole();
                break;
            case "Exit":
                connection.end();           // end connection on employeeTracker.js
                sqlQueries.endConnection(); // end connection on sqlQueries.js
                break;
        }
    });
}

function addDepartment() {
    inquirer
    .prompt({
        type: "confirm",
        name: "task",
        message: "You are about to add a department. Would you like to continue?"
    })    
    .then(function(answer) {
        if(answer.task) {
            inquirer
            .prompt({
                type: "input",
                name: "department",
                message: "Enter the new department name:",
            })
            .then(function(answer) {
                if(answer.department == "") {
                    console.log("The department name cannot be empty.");
                    addDepartment();
                } else {
                    sqlQueries.addDepartment(answer.department);
                    confirmMoreTask();
                }
            });
        } else {
            init();
        }
    });
}

function addRole() {
    createDepList();    // Update the departmentList
    inquirer
    .prompt({
        type: "confirm",
        name: "task",
        message: "You are about a role. Would you like to continue?"
    })    
    .then(function(answer) {
        if(answer.task) {
            inquirer
            .prompt([
            {
                type: "input",
                name: "role",
                message: "Enter the new role name:"
            },
            {
                type: "input",
                name: "salary",
                message: "Enter salary of the new role:"
            },
            {
                type: "list",
                name: "department",
                message: "Choose a department for the new role:",
                choices: departmentList
            }
            ])
            .then(function(answer) {
                if(answer.role == "") {
                    console.log("The role name cannot be empty.");
                    addRole();
                } else {
                    // regex /.+?(?=\,)/ picks up a part of a string before the first comma "," (comma not included)
                    const depID = answer.department.match(/.+?(?=\,)/);
                    sqlQueries.addRole(answer.role, answer.salary, depID);
                    confirmMoreTask();
                }
            });
        } else {
            init();
        }
    });
}

function addEmployee() {
    createEmpList();    // Update the employeeList
    createRoleList();   // Update the roleList
    inquirer
    .prompt({
        type: "confirm",
        name: "task",
        message: "You are about to add an employee. Would you like to continue?"
    })
    .then(function(answer) {
        if(answer.task) {
            inquirer
            .prompt([     
            {
                type: "input",
                name: "firstName",
                message: "Enter the new employee's first name:"
            },
            {
                type: "input",
                name: "lastName",
                message: "Enter the new employee's last name:"
            },
            {
                type: "list",
                name: "role",
                message: "Choose a role for the new employee:",
                choices: roleList
            },
            {
                type: "list",
                name: "manager",
                message: "Choose a manager of the new employee:",
                choices: employeeList
            }
            ])
            .then(function(answer) {
                if (answer.firstName == "" || answer.lastName == "") {
                    console.log("Both first and last names need to be entered.");
                    addEmployee();
                } else {
                    const roleID = answer.role.match(/.+?(?=\,)/);
                    const managerID = answer.manager.match(/.+?(?=\,)/);
                    sqlQueries.addEmployee(answer.firstName, answer.lastName, roleID, managerID);
                    confirmMoreTask();
                }
            });
        } else {
            init();
        }
    });
}

function viewAllDepartments() {
    sqlQueries.viewDepartments();
    confirmMoreTask();
}

function viewAllRoles() {
    sqlQueries.viewRoles();
    confirmMoreTask();
}

function viewAllEmployees() {
    sqlQueries.viewEmployees();
    confirmMoreTask();
}

function updateEmployeeRole() {
    createEmpList();    // Update the employeeList
    createRoleList();   // update the roleList
    inquirer
    .prompt({
        type: "confirm",
        name: "task",
        message: "You are about to change an employee's role. Would you like to continue?"
    })
    .then(function(answer) {
        if(answer.task) {
            inquirer
            .prompt([     
            {
                type: "list",
                name: "employee",
                message: "Choose an employee to update the role:",
                choices: employeeList
            },
            {
                type: "list",
                name: "role",
                message: "Choose a new role for the employee:",
                choices: roleList
            }
            ])
            .then(function(answer) {
                const empID = answer.employee.match(/.+?(?=\,)/);
                const roleID = answer.role.match(/.+?(?=\,)/);
                sqlQueries.updateEmployeeRole(empID, roleID);
                confirmMoreTask();
            });
        } else {
            init();
        }
    });   
}

// function to ask the user if he/she has more to do with the app during the session
function confirmMoreTask() {
    inquirer
    .prompt({
        type: "confirm",
        name: "task",
        message: "Would you like to continue managing employees' data?"
    })
    .then(function(answer) {
        if(answer.task) {
            init();
        } else {    // if no more task, end mysql connections
            connection.end();
            sqlQueries.endConnection();
        }
    });   
}

// functions to create the lists (array) of departments, roles, and employees for the "choices" of inquirer prompt
function createDepList() {
    departmentList = [];
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        res.forEach(department => {
            const eachDep = `${department.id}, ${department.name}`;
            departmentList.push(eachDep);
        });
    });
}
 
function createRoleList() {
    roleList = [];
    connection.query('SELECT r.id "ID", r.title "Title", r.salary "Salary", d.name "Department" FROM role r LEFT JOIN department d ON r.department_id = d.id', function(err, res) {
        if (err) throw err;
        res.forEach(role => {
            const eachRole = `${role.ID}, ${role.Title}, ${role.Salary}, ${role.Department}`;
            roleList.push(eachRole);
        });
    });
}

function createEmpList() {
    employeeList = [];
    connection.query('SELECT e.id "ID", CONCAT(e.first_name, " ", e.last_name) "Name", r.title "Role", d.name "Department" FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id;', function(err, res) {
        if (err) throw err;
        res.forEach(employee => {
            const eachEmp = `${employee.ID}, ${employee.Name}, ${employee.Role}, ${employee.Department}`;
            employeeList.push(eachEmp);
        });
        employeeList.push("None");
    });
}