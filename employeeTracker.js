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
    init(); // run the init function after the connection is made
});

// work: change to call this function where init() is called
function start() {
    createDepList();    // create the list (array) of departments
    createRoleList();   // create the list (array) of roles
    createEmpList();    // create the list (array) of employees
    init(); // run the init function after the connection is made
}

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
        // regex /.+?(?=\,)/ picks up a part of a string before the first comma "," (comma not included)
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

function updateEmployeeRole() {
    inquirer
    .prompt([     
    {
        type: "list",
        name: "employee",
        message: "Choose a employee to update the role:",
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
        init();
    });
}

// functions to create the lists (array) of departments, roles, and employees for the "choices" of inquirer prompt
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