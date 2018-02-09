var inquirer = require("inquirer");
var dbTable = require("./bobazonDB.js")

var itm = 0
var nam = ""
var dpt = ""
var rtl = 0.00
var qty = 0
var rec

var tbl = new dbTable()
runManagerMenu();

// Work Starts Here
function runManagerMenu() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit Manager Menu"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          mgrViewAll();
          break;

        case "View Low Inventory":
          mgrViewLow();
          break;

        case "Add to Inventory":
          mgrAddInv();
          break;

        case "Add New Product":
          mgrAddProd();
          break;

        case "Exit Manager Menu":
          tbl.closeDB();
          process.exit();

      }
    });
}

function mgrViewAll() {
  tbl.displayAll(runManagerMenu)
}

function mgrViewLow() {
    inquirer.prompt(
      [{  name: "Qty",
          type: "input",
          message: "View items with Quantity <= ?"
      }])
    .then(function (response) {
      tbl.displayLowQty(response.Qty, runManagerMenu)
    })
}

function mgrAddInv() {
    inquirer.prompt(
    [{  name: "Item",
          type: "input",
          message: "Enter item-id received: "
      },{ name: "Qty",
          type: "input",
          message: "Enter quantity received: "
      }]
    ).then(function (response) {
      itm = Number(response.Item)
      qty = Number(response.Qty)
      tbl.getProductByID(itm, itemUpdate, itemNotUpdatable)
    })
}

function itemUpdate(record) {
  rec = record
  rec.stock_quantity += qty
  tbl.updateProduct(itm, rec.stock_quantity, runManagerMenu)
}

function itemNotUpdatable() {
  console.log(`item_id of ${itm} is not valid`)
  runManagerMenu()
}

function mgrAddProd() {
    inquirer.prompt(
    [{  name: "Name",
          type: "input",
          message: "Enter Name of New Item: "
      },{ name: "Dept",
          type: "input",
          message: "Enter Department for New Item: "
      },{ name: "Retail",
          type: "input",
          message: "Enter Retail Price for New Item: "
      },{ name: "Qty",
          type: "input",
          message: "Enter Stock Quantity for New Item: "
      }]
    ).then(function (response) {
      nam = response.Name
      dpt = response.Dept
      rtl = Number(response.Retail)
      qty = Number(response.Qty)
      tbl.getProductByName(nam, itemAdd, itemNotAddable)
    })
}

function itemAdd() {
  tbl.addProduct(nam, dpt, rtl, qty, runManagerMenu)
}

function itemNotAddable(record) {
  console.log(`Item ${record.product_name} already exists`)
  runManagerMenu()
}
