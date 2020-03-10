const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
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
    createDepList();
    createRoleList();
    createEmpList();
    // run the init function after the connection is made
    init();
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
            // "Update Employee's Manager",
            // "View Employees by Manager",
            // "Delete Department",
            // "Delete Role",
            // "Delete Employee"
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
                // sqlQueries.viewDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                // sqlQueries.viewRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                // sqlQueries.viewEmployees();
                break;
            case "Update Employee's Role":
                break;
            case "Exit":
                connection.end();
                break;
        }
    });
}

function addDepartment() {
    inquirer
    .prompt({
        type: "input",
        name: "department",
        message: "Enter the new department name:",
    })
    .then(function(answer) {
       sqlQueries.addDepartment(answer.department);
       init();
    });
}

function addRole() {
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
        message: "Choose a role for the new employee:",
        choices: departmentList
    }
    ])
    .then(function(answer) {
        const depID = answer.department.match(/.+?(?=\,)/);
        sqlQueries.addRole(answer.role, answer.salary, depID);
        init();
    });
}

function addEmployee() {
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
        const roleID = answer.role.match(/.+?(?=\,)/);
        const managerID = answer.manager.match(/.+?(?=\,)/);
        sqlQueries.addEmployee(answer.firstName, answer.lastName, roleID, managerID);
        init();
    });
}

function viewAllDepartments() {
    sqlQueries.viewDepartments();
    init();
}

function viewAllRoles() {
    sqlQueries.viewRoles();
    init();
}

function viewAllEmployees() {
    sqlQueries.viewEmployees();
    init();
}

function createDepList() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        res.forEach(department => {
            const eachDep = `${department.id}, ${department.name}`;
            departmentList.push(eachDep);
        });
    });
}
 
function createRoleList() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        res.forEach(role => {
            const eachRole = `${role.id}, ${role.title}, ${role.salary}`;
            roleList.push(eachRole);
        });
    });
}

function createEmpList() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        res.forEach(employee => {
            const eachEmp = `${employee.id}, ${employee.first_name}, ${employee.last_name}, ${employeeList.role_id}`;
            employeeList.push(eachEmp);
        });
        employeeList.push("None");
    });
}