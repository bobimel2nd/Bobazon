var inquirer = require("inquirer");
var mysql = require("mysql");
var prodTableInfo;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "FunFest!123",
  database: "bobazon_db"
});

connection.connect(function(error) {
	if (error) throw error;
	// console.log("connected as id " + connection.threadId);
	displayStock();
});

function displayStock() {
	var query = connection.query("SELECT * FROM products", function(error, response, fields) {
		if (error) throw error;
		console.log("\nAvailable products...");
		prodTableData = response;
		prodTableInfo = fields;
		displayProdTable();
	    inquirer.prompt(
			[{ 	name: "Item",
		        type: "input",
		        message: "Enter item-id to purchase: "
		    },{ name: "Qty",
		        type: "input",
		        message: "Enter how many do you want to buy?"
		    }]
	    ).then(function (response) {
	    	if ((response.Item == 0) || (response.Qty == 0)) {
	    		connection.end();
	    		process.exit();
	    	}
	    	var query = connection.query("SELECT * FROM products where item_id = ?", response.Item, function(error, records, fields) {
	    		if (records.length === 0) {
	    			console.log(`item_id of ${response.Item} is not valid`)
					displayStock();
	    		} else if (response.Qty > records[0].stock_quantity) {
	    			console.log(`Insufficient quantity of ${records[0].product_name} for this purchase (${records[0].stock_quantity} available)`)
					displayStock();
	    		}
	    		else {
	    			records[0].stock_quantity -= response.Qty;
					var query = connection.query("UPDATE products SET ? WHERE ?",
							[{'stock_quantity': records[0].stock_quantity},{'item_id':records[0].item_id}],	function(error, results) {
						if (error) throw error;
						var cost = "$" + (records[0].retail_price * response.Qty).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		    			console.log(`Your order of ${response.Qty} ${records[0].product_name} for ${cost} has been processed`);
						displayStock();
		    		})
	    		}
	    	})
	    })
	});
}

function displayProdTable() {
	l = lineBreak()
	var s = l;
	s += getHeadings()
	s += l
	prodTableData.forEach((rec) => { s += getData(rec) })
	s += l
	console.log(s)
}

function lineBreak() {
	var s = "+"
	for (i=0; i<prodTableInfo.length; i++) {
		s += element('-'.repeat(100), i)
		s += "+"
	}
	return s + '\n';
}

function getHeadings() {
	var s = "|"
	for (i=0; i<prodTableInfo.length; i++) {
		s += element(prodTableInfo[i].name, i)
		s += "|"
	}
	return s + '\n';
}

function getData(data) {
	var s = "|"
	for (i=0; i<prodTableInfo.length; i++) {
		s += element(data[prodTableInfo[i].name], i)
		s += "|"
	}
	return s + '\n';
}

function element(dat, fld) {
	var data = "" + dat
	var length = prodTableInfo[fld].length;
	switch (prodTableInfo[fld].type) {
		case 3: // integer - right justify
			if (data.length > length-2) data = data.substring(0,length-2)
			return (' '.repeat(length-data.length-1) + data + ' ')
		case 253: // varchar - left justify
			length /= 3;
			if (data.length > length) data = data.substring(0,length-2)
			return (' ' + data + ' '.repeat(length-data.length-1))
		case 246: // decimal - right justify
			if (!isNaN(data)) data = Number(data).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			if (data.length > length) data = data.substring(0,length-2)
			return (' '.repeat(length-data.length-1) + data + ' ')
	}
}

/*
function createProduct(product) {
	console.log("Inserting a new product...\n");
	var query = connection.query("INSERT INTO products SET ?", product, function(error, rows, cols) {
		if (error) throw error;
	    console.log(rows.affectedRows + " product inserted!\n");
	});
	console.log(query.sql);
}

function readProducts() {
	console.log("Selecting all products...\n");
	var query = connection.query("SELECT * FROM products", function(error, rows, cols) {
		if (error) throw error;
		console.log(rows);
	});
	console.log(query.sql);
}

function updateProduct() {
	console.log("Updating product...\n");
	var query = connection.query("UPDATE products SET ? WHERE ?", product, function(error, upd) {
		if (error) throw error;
		console.log(upd);
    });
	console.log(query.sql);
}

function deleteProduct() {
	console.log("Deleting product...\n");
	connection.query("DELETE FROM products WHERE ?", product, function(error, del) {
		console.log(del.affectedRows + " products deleted!\n");
    });
	console.log(query.sql);
}
*/