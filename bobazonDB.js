var mySql = require("mysql");
var cliTable = require('cli-table')

var dbBobazon = function() {
	this.connection = mySql.createConnection({
		host: "localhost",
		port: 3306,
		user: "root",
		password: "FunFest!123",
		database: "bobazon_db"
	});

	this.displayAll = function(theCallback) {
		var ttl = "\nBobAZon Available products...\n"
		var sql = "SELECT * FROM products"
		this.display(sql, ttl, theCallback)
	}

	this.displayLowQty = function(theQty, theCallback) {
		var ttl = "\nBobAZon Products with Quantity <= " + theQty + "...\n"
		var sql = "SELECT * FROM products where stock_quantity<=" + theQty
		this.display(sql, ttl, theCallback)
	}

	this.display = function(theQuery, theTitle, theCallback) {
		var query = this.connection.query(theQuery, function(err, rows, cols) {
			if (err) throw err

			zTtl = []
			zWid = []
			zJus = []
			cols.forEach((fld) => {
				zTtl.push(fld.name)
				zWid.push((fld.type===253) ? fld.length/3 : fld.length)
				zJus.push( ((fld.type===3) || (fld.type===246)) ? 'right' : 'left')
			})

			var sTable = new cliTable({
				chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
			        	, 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
			        	, 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
			        	, 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
				style: { 'padding-left': 1
        				, 'padding-right': 1
        				, head: ['white']
        				, border: ['cyan']
        				, compact : true },
				head: zTtl,
				colWidths: zWid,
				colAligns: zJus
			});

			rows.forEach((rec) => {
				var zCol = []
				cols.forEach((fld) => zCol.push((fld.type===246) ?  Number(rec[fld.name]).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : rec[fld.name]))
				sTable.push(zCol)
			})

			console.log(theTitle + sTable.toString());
			theCallback()
	 	})
	}

	this.getProductByID = function(itm, succCallback, failCallback) {
		var query = this.connection.query(
				"SELECT * FROM products where item_id = ?",
				itm,
				function(err, rows, cols) {
			if ((err) || (rows.length !== 1)) {
				failCallback()
			} else {
				succCallback(rows[0])
			}
		})
	}

	this.getProductByName = function(nam, succCallback, failCallback) {
		var query = this.connection.query(
				"SELECT * FROM products where product_name = ?",
				nam,
				function(err, rows, cols) {
			if ((err) || (rows.length !== 1)) {
				failCallback()
			} else {
				succCallback(rows[0])
			}
		})
	}

	this.addProduct = function(nam, dpt, rtl, qty, theCallback) {
		var query = this.connection.query(
				"INSERT INTO products (product_name, department_name, retail_price, stock_quantity) VALUES (?, ?, ?, ?)",
				[nam, dpt, rtl, qty],
				function(error, results) {
			if (error) throw error
			theCallback()
		})
	}

	this.updateProduct = function(itm, qty, theCallback) {
		var query = this.connection.query(
				"UPDATE products SET ? WHERE ?",
				[{'stock_quantity': qty},{'item_id':itm}],
				function(error, results) {
			if (error) throw error
			theCallback()
		})
	}

	this.closeDB = function() {
		this.connection.end();
	}
};

module.exports = dbBobazon;

function Justify(dat, typ, len) {
	switch (typ) {
		case 3: 	// integer - right justify
			if (dat.length > len-2) dat = dat.substring(0,len-2)
			return (' '.repeat(len-dat.length-1) + dat)
		case 246: 	// decimal - right justify
			if (!isNaN(dat)) dat = Number(dat).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			if (dat.length > len) dat = dat.substring(0,len-2)
			return (' '.repeat(len-dat.length-1) + dat)
		case 253: 	// VarChar - Left justify
			len /= 3;
			if (dat.length > len) dat = dat.substring(0,len-2)
			return (dat + ' '.repeat(len-dat.length-1))
		default:
			if (dat.length > len) dat = dat.substring(0,len-2)
			return (' ' + dat + ' '.repeat(len-dat.length-1))
	}

}