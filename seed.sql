DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
 id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
 name VARCHAR(30)
);

CREATE TABLE role (
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INTEGER NOT NULL
    
);

CREATE TABLE employee(
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER NOT NULL,
    manager_id INTEGER

);
