DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;

USE employee_db;

-- creat department table
CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);

SELECT * FROM department;

-- dreate role table
CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY(id),
  FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE SET NULL
);

SELECT * FROM role;

-- create employee table
CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE SET NULL,
  FOREIGN KEY(manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

SELECT * FROM employee;