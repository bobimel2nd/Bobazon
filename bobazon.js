var inquirer = require("inquirer");
var dbTable = require("./bobazonDB.js")

var itm = 0
var qty = 0
var rec

var tbl = new dbTable()
showTableToUser();

// Work Starts Here
function showTableToUser() {
	tbl.displayAll(getCustomerRequest)
}

function getCustomerRequest() {
    inquirer.prompt(
		[{ 	name: "Item",
	        type: "input",
	        message: "Enter item-id to purchase: "
	    },{ name: "Qty",
	        type: "input",
	        message: "Enter how many do you want to buy?"
	    }]
    ).then(function (response) {
    	itm = Number(response.Item)
    	qty = Number(response.Qty)
    	if ((itm == 0) || (qty == 0)) {
    		tbl.closeDB();
    		process.exit();
    	}
    	tbl.getProductByID(itm, itemFound, itemNotFound)
    })
}

function itemFound(record) {
	rec = record
	if (rec.stock_quantity >= qty) {
		tbl.updateProduct(itm, rec.stock_quantity - qty, saleComplete)
	} else {
		console.log(`Insufficient quantity of ${rec.product_name} for this purchase (${rec.stock_quantity} available)`)
		showTableToUser()
	}
}

function itemNotFound() {
	console.log(`item_id of ${itm} is not valid`)
	showTableToUser()
}

function saleComplete() {
	var cost = "$" + (rec.retail_price * qty).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	console.log(`Your order of ${qty} ${rec.product_name} for ${cost} has been processed`);
	showTableToUser();
}
