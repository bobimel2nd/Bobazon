var mySql = require("mysql");

var dbBobazon = function() {
	this.connection = mySql.createConnection({
		host: "localhost",
		port: 3306,
		user: "root",
		password: "FunFest!123",
		database: "bobazon_db"
	});

	this.displayAll = function(theCallback) {
		var ttl = "\nAll Available products...\n"
		var sql = "SELECT * FROM products"
		this.display(sql, ttl, theCallback)
	}

	this.displayLowQty = function(theQty, theCallback) {
		var ttl = "\nProducts with Quantity <= " + theQty + "...\n"
		var sql = "SELECT * FROM products where stock_quantity<=" + theQty
		this.display(sql, ttl, theCallback)
	}

	this.display = function(theQuery, theTitle, theCallback) {
		var query = this.connection.query(theQuery, function(err, rows, cols) {
			if (err) throw err
			var l = lineBreak(cols)
			var s= theTitle
			s += l;
			s += getHeadings(cols)
			s += l
			rows.forEach((rec) => { s += getData(rec, cols) })
			s += l
			console.log(s)
			theCallback()
	 	})
	}

	this.getProductByID = function(itm, succCallback, failCallback) {
		var query = this.connection.query(
				"SELECT * FROM products where item_id = ?",
				itm,
				function(err, rows, cols) {
			if ((err) || (rows.length != 1)) {
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
			if (rows.length === 1) {
				failCallback(rows[0])
			} else {
				succCallback()
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

function lineBreak(flds) {
	var s = "+"
	for (i=0; i<flds.length; i++) {
		s += element('-'.repeat(100), flds[i])
		s += "+"
	}
	return s + '\n';
}

function getHeadings(flds) {
	var s = "|"
	for (i=0; i<flds.length; i++) {
		s += element(flds[i].name, flds[i])
		s += "|"
	}
	return s + '\n';
}

function getData(data, flds) {
	var s = "|"
	for (i=0; i<flds.length; i++) {
		s += element(data[flds[i].name], flds[i])
		s += "|"
	}
	return s + '\n';
}

function element(dat, fld) {
	var data = "" + dat
	var length = fld.length;
	switch (fld.type) {
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
