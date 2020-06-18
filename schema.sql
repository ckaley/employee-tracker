DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;
USE employee_trackerDB;

CREATE TABLE department (
	id int AUTO_INCREMENT,
	name varchar(30),
	PRIMARY KEY(id)
);

CREATE TABLE role (
	id int AUTO_INCREMENT,
	title varchar(30),
	salary decimal,
	department_id int,
    PRIMARY KEY(id),
	FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id int AUTO_INCREMENT,
  first_name varchar(30),
  last_name varchar(30),
  role_id int,
  manager_id int,
  PRIMARY KEY(id),
  FOREIGN KEY(role_id) REFERENCES role(id),
  FOREIGN KEY(manager_id) REFERENCES employee(id)
);

INSERT INTO department (name) VALUES ("Finance");
INSERT INTO department (name) VALUES ("Operations");
INSERT INTO department (name) VALUES ("Human Resources");
INSERT INTO department (name) VALUES ("Information Technology");

INSERT INTO role (title, salary, department_id) VALUES ("Software Engineer", 80000, 4);
INSERT INTO role (title, salary, department_id) VALUES ("QA Engineer", 65000, 4);
INSERT INTO role (title, salary, department_id) VALUES ("HR Manager", 70000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("HR Admin", 55000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Processor", 50000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("IT Manager", 95000, 4);
INSERT INTO role (title, salary, department_id) VALUES ("Finance Analyst", 62000, 1);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Jacob", "Knowitall", 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Fred", "Flinstone", 1, 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Sally", "Cartwright", 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Mary", "Johnson", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Susan", "Smith", 2, 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("David", "Barnes", 7);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Kelly", "Wells", 5);