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
  })
  mainMenu()
}

const viewDepartments = () => {
  db.query(`SELECT * FROM departments`, (err, data) => {
    if (err) { console.log(err) }
    console.table(data)
  })
  mainMenu()
}

const viewRoles = () => {
  db.query(`SELECT * FROM roles`, (err, data) => {
    if (err) { console.log(err) }
    console.table(data)
  })
  mainMenu()
}

const viewEmployees = () => {
  db.query(`SELECT * FROM employees`, (err, data) => {
    if (err) { console.log(err) }
    console.table(data)
  })
  mainMenu()
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
    })
  })
  .catch(err => console.log(err))
  mainMenu()
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
          name: `${department.title}`,
          value: department.id
        }))
      }
    ])

    .then(res => {
      db.query('INSERT INTO roles SET ?', res, err => {
        if (err) { console.log(err) }
        console.log('Role added!')
        })
    })
    .catch(err => console.log(err))
  })
  mainMenu()
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
      })
    })
    .catch(err => console.log(err))
  })
  mainMenu()
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
        })
      })
    .catch(err => console.log(err))
  
  })
  mainMenu()
}

mainMenu()





  

// const changeEntree = () => {
//   db.query('SELECT * FROM entrees', (err, entrees) => {
//     prompt([
//       {
//         type: 'list',
//         name: 'id',
//         message: 'Select a Entree to Update the Price Of:',
//         choices: entrees.map(entree => ({
//           name: `${entree.name} ${entree.price}`,
//           value: entree.id
//         }))
//       },
//       {
//         type: 'number',
//         name: 'price',
//         message: 'Set a New Price For the Entree:'
//       }
//     ])
//       .then(({ id, price }) => {
//         db.query('UPDATE entrees SET ? WHERE ?', [{ price }, { id }], err => {
//           if (err) { console.log(err) }
//           console.log('Entree Price Updated!')
//           mainMenu()
//         })
//       })
//   })
// }

// const changeDrink = () => {
//   db.query('SELECT * FROM drinks', (err, drinks) => {
//     prompt([
//       {
//         type: 'list',
//         name: 'id',
//         message: 'Select a Drink to Update the Price Of:',
//         choices: drinks.map(drink => ({
//           name: `${drink.name} $${drink.price}`,
//           value: drink.id
//         }))
//       },
//       {
//         type: 'number',
//         name: 'price',
//         message: 'Set a New Price For the Drink:'
//       }
//     ])
//       .then(({ id, price }) => {
//         db.query('UPDATE drinks SET ? WHERE ?', [{ price }, { id }], err => {
//           if (err) { console.log(err) }
//           console.log('Drink Price Updated!')
//           mainMenu()
//         })
//       })
//   })
// }

// const deleteEntree = () => {
//   db.query('SELECT * FROM entrees', (err, entrees) => {
//     prompt({
//       type: 'list',
//       name: 'id',
//       message: 'Select a Entree to Delete:',
//       choices: entrees.map(entree => ({
//         name: `${entree.name} ${entree.price}`,
//         value: entree.id
//       }))
//     })
//       .then(res => {
//         db.query('DELETE FROM entrees WHERE ?', res, err => {
//           if (err) { console.log(err) }
//           console.log('Entree Deleted!')
//           mainMenu()
//         })
//       })
//   })
// }

// const deleteDrink = () => {
//   db.query('SELECT * FROM drinks', (err, drinks) => {
//     prompt({
//       type: 'list',
//       name: 'id',
//       message: 'Select a Drink to Delete:',
//       choices: drinks.map(drink => ({
//         name: `${drink.name} $${drink.price}`,
//         value: drink.id
//       }))
//     })
//       .then(res => {
//         db.query('DELETE FROM drinks WHERE ?', res, err => {
//           if (err) { console.log(err) }
//           console.log('Drink Deleted!')
//           mainMenu()
//         })
//       })
//   })
// }

// const createEmployee = () => {
//   db.query('SELECT * FROM employees', (err, employees) => {
//     prompt([
    
//     {
//       type: 'input',
//       name: 'first',
//       message: 'What is the employees first name?'
//     },
//     {
//       type: 'input',
//       name: 'last',
//       message: 'What is the employees last name?'
//     },
//     {
//       type: 'list',
//       name: 'manager_id',
//       message: 'Who is the employees manager?',
//       choices: employees.map(employees => ({
//         name: `${employees.first_name} ${employees.last_name}`,
//         value: employees.id
//       }))
//     },
//     {
//       type: 'list',
//       name: 'role',
//       message: 'What is the employees role?',
//       choices: ['Sales Lead','Sales Person','Lead Engineer','Software Engineer','Accountant','Lawyer','Legal Team Lead']
//     }
//    ])
//     .then(employee => {
//       db.query('INSERT INTO employees SET ?', employee, err => {
//         if (err) { console.log(err) }
//         console.log('Employee Created!')
//         // mainMenu()
//       })
//     })
//     .catch(err => console.log(err))
//   })
// }

// const createDrink = () => {
//   prompt([
//     {
//       type: 'input',
//       name: 'name',
//       message: 'What is the drink name?'
//     },
//     {
//       type: 'list',
//       name: 'size',
//       message: 'What size is the drink?',
//       choices: ['Small', 'Medium', 'Large']
//     },
//     {
//       type: 'number',
//       name: 'price',
//       message: 'What is the price of the drink?'
//     }
//   ])
//     .then(employee => {
//       db.query('INSERT INTO drinks SET ?', drink, err => {
//         if (err) { console.log(err) }
//         console.log('Drink Created!')
//         mainMenu()
//       })
//     })
//     .catch(err => console.log(err))
// }

// const viewEntrees = () => {
//   db.query('SELECT * FROM entrees', (err, entrees) => {
//     if (err) { console.log(err) }
//     console.table(entrees)
//     mainMenu()
//   })
// }

// const viewDrinks = () => {
//   db.query('SELECT * FROM drinks', (err, drinks) => {
//     if (err) { console.log(err) }
//     console.table(drinks)
//     mainMenu()
//   })
// }

// const mainMenu = () => {
//   prompt({
//     type: 'list',
//     name: 'action',
//     message: 'What would you like to do?',
//     choices: [
//       'Create an Entree',
//       'Create a Drink',
//       'Change an Entree Price',
//       'Change a Drink Price',
//       'View All Entrees',
//       'View All Drinks',
//       'Delete an Entree',
//       'Delete a Drink']
//   })
//     .then(({ action }) => {
//       switch (action) {
//         case 'Create an Entree':
//           createEntree()
//           break
//         case 'Create a Drink':
//           createDrink()
//           break
//         case 'Change an Entree Price':
//           changeEntree()
//           break
//         case 'Change a Drink Price':
//           changeDrink()
//           break
//         case 'View All Entrees':
//           viewEntrees()
//           break
//         case 'View All Drinks':
//           viewDrinks()
//           break
//         case 'Delete an Entree':
//           deleteEntree()
//           break
//         case 'Delete a Drink':
//           deleteDrink()
//           break
//       }
//     })
//     .catch(err => console.log(err))
// }

// mainMenu()

// db.query('SELECT * FROM entrees WHERE price > ?', [9], (err, entrees) => {
//   if (err) { console.log(err) }
//   console.log(entrees)
// })

// let name = 'Nachos'

// db.query('SELECT * FROM entrees WHERE ?', [{ name }], (err, entrees) => {
//   if (err) { console.log(err) }
//   console.log(entrees)
// })

// let entree = {
//   name: 'Birria Tacos',
//   description: 'tacos with melted cheese and meat with a dipping sauce',
//   price: 9
// }

// db.query('INSERT INTO entrees SET ?', entree, err => {
//   if (err) { console.log(err) }
//   console.log('Entree added!')
// })