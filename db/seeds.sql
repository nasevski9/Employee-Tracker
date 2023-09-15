INSERT INTO department (department_name)
VALUES ('Sales'),
       ('Finance'),
       ('Engineering');

INSERT INTO role (title, salary,department_id)
VALUES ('Sales Lead',100000,1),
       ('Salesperson',80000,1),
       ('Lead Engineer',150000,3),
       ('Software Engineer', 11000,3),
       ('Accountant',80000,2),
       ('Account Manager',100000,2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ('John','Smith',1,null),
       ('Mike','Pence',3,null),
       ('Samantha','Douglas',6,null),
       ('Tony','Soprano',2,1),
       ('Tommy','Jackson',4,2),
       ('Alicia','Keyston',5,3),
       ('Zack','Morris',5,3),
       ('Christian','Bale',2,1),
       ('Angelina','Thomas',4,2);