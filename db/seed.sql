USE employee_db;

-- seed department table
INSERT INTO department (name) 
VALUES  ("Development"), ("Sales"), ("HR")
;

-- seed role table
INSERT INTO role (title, salary, department_id) 
VALUES  ("Development Manager", 150000, 1),
        ("Developer I", 50000, 1),
        ("Developer II", 65000, 1),
        ("Developer III", 85000, 1),
        ("Development Intern", 40000, 1),
        ("Sales Manager", 120000, 2),
        ("Sales Associate I", 35000, 2),
        ("Sales Associate II", 45000, 2),
        ("Sales Associate III", 55000, 2),
        ("Sales Intern", 25000, 2),
        ("HR Manager", 100000, 3),
        ("HR Assistant", 45000, 3)
;

-- seed employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  ("Hideko", "Kotaki", 1, NULL),
        ("Emi", "Clar", 2, 1),
        ("Sabrina", "Clar", 3, 2),
        ("Kaori", "Kaneko", 11, NULL),
        ("Kazyuya", "Kamenashi", 12, 4)
;