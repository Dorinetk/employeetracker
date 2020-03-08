const mysql = require("mysql");
const inquirer = require("inquirer");
const ctable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root@2020",
    database: "employee_db"

});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected with DB")
    init();
})
// to add depart, roles and employees first?
// and then make complex queries
// invert sequence below in init


const init = () => {
    console.log("welcome to his app that will assist you manage your employee's database. \n");
    inquirer.prompt(
        {
            type: "list",
            name: "newInfo",
            message: " Select an option:",
            choices: [
                "Add a department",
                "Add a role",
                "Add an employee",
                "View all employees",
                "View employees by a department",
                "View employees by role",
                "View employee by manager",
                "Update an employee role",
                "Update an employee manager",
                "Delete an employee",
                "Delete a department",
                "Quit"
            ]
        }

    ).then(function (response) {

        switch (response.newInfo) {

            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case  "Add an employee":
                addEmployee();
                break;
            case "View all employees":
                viewEmployee();
                break;
            case "View employees by role":
                viewRole();
                break;
            
            case "View employees by a department":
                viewDepartment();
                break;
            
            // case "View employee by manager":
            //         viewManager();
            //         break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
        
            case "Delete an employee":
                deleteEmployee();
                break;
            // case "Delete a department":
            //     deleteDepartment();
            //     break;
            /// view budget??
            default:
                quitProgram(); // displays something in console and connection.end
        }

    });

}

const quitProgram = () => {

    console.log("Thanks for using our app.");
    connection.end();
}

const addDepartment = () => {
    //create department
    // gets input from user
    inquirer.prompt(
        {
            type: "input",
            name: "deptName",
            message: "Enter department's name:",
        }

    ).then(function (response) {
        console.log("Creating a department...\n");

        //query to add input in table
        const query = connection.query("INSERT INTO department SET ?",
            {
                name: response.deptName
            },
            function (err, res) {
            if (err) throw err;
            
            console.log(response.deptName + " departement inserted! \n");

            // display
            console.table(res);

            // re-starts initial questioning app
            init();
            
        });
        //console.log(query.sql);

    });
}


// need to review it



// add roles
const addRole = () => {

    //user selects the department id in DB
   
    connection.query( "SELECT * FROM department", function(err,resultDept) {

        if (err) throw err;

        inquirer.prompt([
            {
                 type: "input",
                 name: "titleEmp",
                 message: "What is the title?"
            },
            {
               type: "input",
               name: "salaryEmp",
               message: "What is the salary?"
           },
           {
             name:"choiceDept",
             type:"rawlist",
             message: "Select the department ID for this role: ",
             choices: resultDept.map (department => {
                return {
                    value: department.id,
                    name: department.name
                }
              })
            }
        ]).then( function(answer){
             connection.query(
                 "INSERT INTO role SET ?",
                 { 
                     title: answer.titleEmp,
                     salary: answer.salaryEmp,
                     department_id: answer.choiceDept
                 },
                 function(err,res) {
                   if (err) throw err;
                   console.log("A role added to your employee");
                   init();
               }
            );
        });


    })
   
}

// add Employee, check role_id in role table and 
// manager_id is another employee from DB
const addEmployee = () => {
    connection.query("SELECT * FROM role", function(err, resultRole) {

        if (err) throw err;

        connection.query("SELECT * FROM employee", function(err,resultEmployee) {

            if (err) throw err;

            let managerSelect = resultEmployee.map(employee => {
                return {
                   name: `${employee.first_name} ${employee.last_name}`,
                   value: employee.id
                }
              });
              managerSelect.push({name:"None", value: null})


             inquirer.prompt([
            {
                type:"input",
                name:"firstName",
                message:"Enter the employee's first name: "
            },
            {
                type:"input",
                name:"lastName",
                message:"Enter the employee's last name: "
            },
            {
                name:"choiceRole",
                type:"rawlist",
                message: "Select the role ID for this employee: ",
                choices: resultRole.map (role => {
                   return {
                       value: role.id,
                       name: role.title
                   }
                 })
            },
            {
                type:"list",
                name:"managerId",
                message: "Select this employee's manager id: ",
                choices: managerSelect

            }]

       ).then(function(response){
           console.log("Adding an employee to the database...\n");
           //update DB
           const query = connection.query(
               "INSERT INTO employee SET ?",
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: response.choiceRole,
                    manager_id: response.managerId || 0
                },
                function(err,res){
                if(err) throw err;
                console.log(response.firstName + " was added to the database");
                console.table(res);
                init();
              }
            );
        });
    })

    })
}
// update Employee Role

const updateEmployeeRole = () => {

    connection.query( "SELECT * FROM employee", function(err, employeeUpdate) {

       if (err) throw err;


      connection.query ("SELECT * FROM role", function(err, newRole) {

        if (err) throw err;

        inquirer.prompt([
            {
                type: "rawlist",
                name: "updateEmpId",
                massage: "Select the employee to update:",
                choices: employeeUpdate.map(employee => {
                        return {
                           name: `${employee.first_name} ${employee.last_name}`,
                           value: employee.id
                        }
                      })
            },
            {   type: "rawlist",
                name: "updateRole",
                massage: "Select the new role: ",
                choices: newRole.map(role => {
                    return {
                       name: role.title,
                       value: role.id
                    }
                  })
            }
    
        ])
        .then(function(response){

           console.log("Adding an employee to the database...\n");
           //update DB
           const query = connection.query(
               "UPDATE employee SET ? WHERE ?",
               [{
                   role_id: response.updateRole
                },
               {
                   id: response.updateEmpId
               }
               ],
                
                function(err,res){
                if(err) throw err;
                console.log(" Employee's role updated");
                init();
              }
            );
    
        })

      });
    });
}

const viewEmployee = () => {


    console.log("Displaying all the employees");
    const query = "SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id";
    connection.query(query, 
       
        function(err,res){
            if (err) throw err;
            console.table(res);
            init();
    })
    
}

const viewRole = () => {

    connection.query("SELECT * FROM role", function(err, rolesToView){

        inquirer.prompt(
            {
                type: "list",
                name: "roleToView",
                message:"Select the role that you want to view: ",
                choices: rolesToView.map(role => {
                    return {
                        value: role.id,
                        name: role.title
                    }
                })
            }
        )
        .then(function(response){

    
        console.log("Displaying employees with the chosen role");
        
        const query = "SELECT role.title, role.salary, employee.first_name, employee.last_name FROM role LEFT JOIN employee ON role.id = employee.role_id WHERE ?";
        connection.query(query,
            {
                role_id: response.roleToView
            },
            function(err,res){
                if (err) throw err;
                console.table(res);
                init();
            })
        })
  });
}

const viewDepartment = () => {

    connection.query("SELECT * FROM department", function(err, departmentToView){

        inquirer.prompt(
            {
                type: "list",
                name: "deptToView",
                message:"Select the department that you want to view: ",
                choices: departmentToView.map(department => {
                    return {
                        value: department.name,
                        name: department.name
                    }
                })
            }
        )
        .then(function(response){

    
        console.log("Displaying employees of the " + response.deptToView +"department ");
        
        const query = "SELECT department.name, employee.first_name, employee.last_name FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON employee.role_id = role.id WHERE ?";
        connection.query(query,
            {
                name: response.deptToView
            },
            function(err,res){
                if (err) throw err;
                console.table(res);
                init();
            })
        })
  });
}

const deleteEmployee = () => {
    connection.query("SELECT * FROM employee", function(err,delEmployee){
        if (err) throw err;
        inquirer.prompt({
            name: "delEmp",
             type:"rawlist",
             message: "Select the employee to be deleted: ",
             choices: delEmployee.map (employee => {
                return {
                    value: employee.id,
                    name: employee.first_name
                }
            
              })
            
        })
        .then(function(response){
            let query = "DELETE FROM employee WHERE ? ";
            connection.query(query,
            {
                id: response.delEmp
            },
            function(err, ans){
                if (err) throw err;
                console.log("Employee deleted.");
                viewEmployee();
                init();
            }
            )

        });


    });
}












