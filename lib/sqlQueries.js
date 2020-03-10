const mysql = require("mysql");
const cTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306,
    user: "root",
    password: " ",
    database: "employee_db"
});

function addDepartment(depName) {
    connection.query("INSERT INTO department (name) VALUES (?)", [depName], function(err, res) {
        if (err) throw err;
        veiwDepartments();
    });  
}

function addRole(roleTitle, roleSalary, depID) {
    connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [roleTitle, roleSalary, depID], function(err, res) {
        if (err) throw err;
        viewRoles();
    });  
}

function addEmployee(empFirstName, empLastName, empRoleID, empMngId) {
    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [empFirstName, empLastName, empRoleID, empMngId], function(err, res) {
        if (err) throw err;
        viewEmployees();
    });  
}

function viewDepartments() {
    connection.query('SELECT id "Department ID", name "Name" FROM department;', function(err, res) {
        if (err) throw err;
        console.log("\n\n", cTable.getTable(res));
    });   
}

function viewRoles() {
    connection.query('SELECT r.id "Role ID", r.title "Title", r.salary "Salary", d.name "Department" FROM role r LEFT JOIN department d ON r.department_id = d.id', function(err, res) {
        if (err) throw err;
        console.log("\n\n", cTable.getTable(res));
    });   
}

// work: figure out the way to combine manager's first and last names and display in one column
function viewEmployees() {
    connection.query('SELECT e1.id "ID", e1.first_name "First Name", e1.last_name "Last Name", r.title "Role", r.salary "Salary", d.name "Department", e2.first_name "Manager (first name)", e2.last_name "Manager (last name)" FROM employee e1 LEFT JOIN role r ON e1.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee e2 ON e1.manager_id = e2.id', function(err, res) {
        if (err) throw err;
        console.log("\n\n", cTable.getTable(res));
    });   
}

function updateEmployeeRole(empID, roleID) {
    connection.query('UPDATE employee SET role_id = ? WHERE id = ?;', [roleID, empID], function(err, res) {
        if(err) throw err;
        viewEmployees();
    });
}

module.exports = {
    addDepartment,
    addRole,
    addEmployee,
    viewDepartments, 
    viewRoles, 
    viewEmployees,
    updateEmployeeRole
};