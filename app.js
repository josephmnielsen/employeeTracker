const { createConnection } = require('mysql2')
const { prompt } = require('inquirer')
require('console.table')

const db = createConnection('mysql://root:rootroot@localhost/employees_db')


const mainMenu = () => {
  prompt ({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View All','View Roles','View Departments','View Employees','Add Department','Add Role','Add Employee','Change Employee Role', 'Exit']
  })
  .then(({action}) => {
    switch (action) {
      case 'View All':
        viewAll()
        break
      case 'View Roles':
        viewRoles()
        break
      case 'View Departments':
        viewDepartments()
        break
      case 'View Employees':
        viewEmployees()
        break
      case 'Add Department':
        addDept()
        break
      case 'Add Role':
        addRole()
        break
      case 'Add Employee':
        addEmployee()
        break
      case 'Change Employee Role':
        updateRole()
        break
      case 'Exit':
        process.exit()
    }
  })
}

const viewAll = () => {
  db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS 'department', CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees manager ON manager.id = employees.manager_id;`, (err, data) => {
    if (err) { console.log(err) }
    console.table(data)
    mainMenu()
  })
}

const viewDepartments = () => {
  db.query(`SELECT * FROM departments`, (err, data) => {
    if (err) { console.log(err) }
    console.table(data)
    mainMenu()
  })
}

const viewRoles = () => {
  db.query(`SELECT * FROM roles`, (err, data) => {
    if (err) { console.log(err) }
    console.table(data)
    mainMenu()
  })
}

const viewEmployees = () => {
  db.query(`SELECT * FROM employees`, (err, data) => {
    if (err) { console.log(err) }
    console.table(data)
    mainMenu()
  })
}


const addDept = () => {
  prompt({
    type: 'input',
    name: 'name',
    message: 'What department would you like to add?'
  })

  .then(res => {
    db.query('INSERT INTO departments SET ?', res, err => {
      if (err) {console.log(err)}
      console.log('Department added!')
      mainMenu()
    })
  })
  .catch(err => console.log(err))
}

const addRole = () => {
  db.query('SELECT * FROM departments', (err, data) => {
    prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What role would you like to add?'
      }, {
        type: 'number',
        name: 'salary',
        message: 'What is the salary for this role?'
      }, {
        type: 'list',
        name: 'department_id',
        message: 'Choose which department this role belongs to:',
        choices: data.map(department => ({
          name: `${department.name}`,
          value: department.id
        }))
      }
    ])

    .then(res => {
      db.query('INSERT INTO roles SET ?', res, err => {
        if (err) { console.log(err) }
        console.log('Role added!')
        mainMenu()
        })
    })
    .catch(err => console.log(err))
  })
}


const addEmployee = () => {
  db.query(`SELECT * FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id`, 
  (err, data) => {
    if (err) { console.log(err) }
    
    prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'What is the first name of the employee?',
        
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'What is the last name of the employee?',
        
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'What is the role of the employee?',
        choices: data.map(role => ({
          name: `${role.title}`,
          value: role.id
        }))
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Who is the manager of the employee?',
        choices: data.map(manager => ({
          name: `${manager.first_name} ${ manager.last_name }`,
          value: manager.id
        }))
      }
    ])
    .then(res => {
      db.query('INSERT INTO employees SET ?', res, err => {
        if (err) { console.log(err) }
        console.log('Employee added!')
        mainMenu()
      })
    })
    .catch(err => console.log(err))
  })
}

const updateRole = () => {
  db.query(`SELECT * FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id`,
    (err, data) => {
    if (err) { console.log(err) }

    prompt([
      {
        type: 'list',
        name: 'employees.id',
        message: 'Which employee would you like to update?',
        choices: data.map(employee => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        }))
      },
      {
        type: 'list',
        name: 'newRole',
        message: 'Choose the new role for the employee',
        choices: data.map(role => ({
          name: `${role.title}`,
          value: role.id
        }))
      }
    ])
    .then(res => {
      db.query('UPDATE employees SET role_id = ? WHERE id = ?', [res.newRole, res.employees.id], err => {
        if (err) { console.log(err) }
        console.log('Role updated!')
        mainMenu()
        })
      })
    .catch(err => console.log(err))
  
  })
}

mainMenu()