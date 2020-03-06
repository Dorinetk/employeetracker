const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"root",
    password : "root@2020",
    database: "employee_db"

});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected with DB")
    init();
})

const init = () => {
    inquirer.prompt(
        {
            type:"list",
            name: "newInfo",
            message: "welcome to his app that will assist you manage your employee's database. \n  Select an option:",
            choices: [
                "Add a department",
                "View a department",
                "Add a role",
                "View a role",
                "Add an employee",
                "View an  employee",
                "Update an employee role",
                "Quit"
            ]
        }

    ).then(function (response){

        switch (response.newInfo) {

            case "Add Department": 
                addDepartment();
                //create depart
                //query
                // display
                break;
            case "View Department":
                    viewDepartment();
                     break;
            case "Add role":
                addRole();
                break;
            case "Add employee":
                addEmployee();
                break;
             
            default:
                quitProgram(); // displays something in console and connection.end
        }

     });
}

const quitProgram = () => {

    console.log("Thanks for using our app.");
    connection.end();

}


