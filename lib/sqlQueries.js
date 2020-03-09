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

function viewDepartments() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.log(cTable.getTable(res));
    });   
}

function viewRoles() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        console.log(cTable.getTable(res));
    });   
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        console.log(cTable.getTable(res));
    });   
}

module.exports = {viewDepartments, viewRoles, viewEmployees};