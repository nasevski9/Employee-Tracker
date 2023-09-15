const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employeetracker_db'
    }
);

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the employeetracker_db database');
});

const question = [
    {
        type: 'list',
        name: 'choice',
        message: 'What do you want to do',
        choices: [
            'View all departments', 
            'View all roles', 
            'View all employees', 
            'Add a department', 
            'Add a role', 
            'Add an employee', 
            'Exit']
    }
];

const addDepartment = {
    type: 'input',
    name: 'name',
    message: 'Enter the name of the department'
};


async function init() {
    try {
        const answers = await inquirer.prompt(question);

        switch (answers.choice) {
            case 'View all departments':
                connection.query('SELECT * FROM department', function (err, results) {
                    console.table(results);
                    init();
                });
                break;
            case 'View all roles':
                connection.query('SELECT * FROM role', function (err, results) {
                    console.table(results);
                    init();
                });
                break;
            case 'View all employees':
                connection.query('SELECT * FROM employee', function (err, results) {
                    console.table(results);
                    init();
                });
                break;
            case 'Add a department':
                const departmentAnswer = await inquirer.prompt(addDepartment);
                connection.query('INSERT INTO department (department_name) VALUES (?)', [departmentAnswer.name], (err, results) => {
                    if (err) throw err;
                    console.log(`Added a department: ${departmentAnswer.name}`);
                    init();
                });
                break;
            case 'Add a role':
                let departments = [];
                connection.query('SELECT department_name FROM department;', (err, result) => {
                result.forEach(element => {
                    departments.push(element.department_name);
                })});
                const addRole = [
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Enter the title for the role'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Enter the salary for this role'
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Select the department for this role',
                        choices: departments
                    }
                ];
                const roleAnswer = await inquirer.prompt(addRole);
                const id = departments.indexOf(roleAnswer.department) + 1;
                connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [roleAnswer.title, roleAnswer.salary, id], (err, results) => {
                    if (err) throw err;
                    console.log(`Added role: ${roleAnswer.title}`);
                    init();
                });
                break;
            case 'Add an employee':
                let roles = [];
                let managers = ['None'];
                connection.query('SELECT title FROM role', (err, result) => {
                    result.forEach(element => {
                        roles.push(element.title);
                    });
                });
                connection.query('SELECT first_name,last_name FROM employee', (err, res) => {
                    res.forEach(person => {
                        managers.push(person.first_name + ' ' + person.last_name);
                    });
                });
                const addEmployee = [
                    {
                        type: 'input',
                        name: 'first',
                        message: 'Enter First Name'
                    },
                    {
                        type: 'input',
                        name: 'last',
                        message: 'Enter Last Name'
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Select role',
                        choices: roles
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Select manager',
                        choices: managers
                    }
                ];
                const employeeAnswer = await inquirer.prompt(addEmployee);
                const roleId = roles.indexOf(employeeAnswer.role) + 1;
                const managerId = employeeAnswer.manager === 'None' ? 'null' : managers.indexOf(employeeAnswer.manager);
                connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [employeeAnswer.first, employeeAnswer.last, roleId, managerId], (err, results) => {
                    if (err) throw err;
                    console.log(`Added Employee: ${employeeAnswer.first} ${employeeAnswer.last}.`);
                    init();
                });
                break;
            case 'Exit':
                connection.end();
                console.log('Goodbye!');
                break;
            default:
                console.log('Invalid choice. Please select a valid option.');
                init();
                break;
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

init();
