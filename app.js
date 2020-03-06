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

const init = () => {
    console.log("welcome to his app that will assist you manage your employee's database. \n");
    inquirer.prompt(
        {
            type: "list",
            name: "newInfo",
            message: " Select an option:",
            choices: [
                "Add a department",
                "View a department",
                "Add a role",
                "View a role",
                "Add an employee",
                "View an employee",
                "Update an employee role",
                "Quit"
            ]
        }

    ).then(function (response) {

        switch (response.newInfo) {

            case "Add a department":
                addDepartment();
                break;
            case "View a department":
                viewDepartment();
                break;
            // case "Add a role":
            //     addRole();
            //     break;
            // case "View a role":
            //     viewRole();
            //     break;

            // case  "Add an employee":
            //     addEmployee();
            //     break;
            // case "View an employee":
            //     viewEmployee();
            //     break;
            // case "Update an employee role":
            //     updateEmployeeRole();
            //     break;

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
        console.log(query.sql);

    });
}

const viewDepartment = () => {

    inquirer.prompt(
        {
            type: "input",
            name: "deptView",
            message: "Enter the name of the depart. you want to view:",
        }

    ).then(function (response) {
        console.log("Displaying a department...\n");
        //view employees in the marketing dept
        // join query on dept and employee right
        var query = connection.query(
            //"SELECT name, first_name, last_name FROM department LEFT JOIN employee ON department.id = ",
            "SELECT ? FROM department",
            {
                name: response.deptView
            },
            function(err,res){
                if (err) throw err;
                console.log(response.deptView + " department displayed");
                console.log(res);//??
                init();
            });
            
        console.log(query.sql);

    });
}






