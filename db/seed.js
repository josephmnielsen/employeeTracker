USE employees_db;

INSERT INTO departments(name)
VALUES('Finance'), ('Legal'), ('Engineering'), ('Sales');

INSERT INTO roles(title, salary, department_id)
VALUES('Sales Lead', 100000, 4),
  ('Salesperson', 80000, 4),
  ('Lead Engineer', 150000, 3),
  ('Software Engineer', 120000, 3),
  ('Accountant', 125000, 1),
  ('Lawyer', 190000, 2),
  ('Legal Team Lead', 250000, 2);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES('John', 'Doe', 1, NULL),
  ('Mike', 'Chan', 2, 1),
  ('Ashley', 'Rodriguez', 3, NULL),
  ('Kevin', 'Tupik', 4, 3),
  ('Malia', 'Brown', 5, NULL),
  ('Sarah', 'Lourd', 7, NULL),
  ('Tom', 'Allen', 6, 6);