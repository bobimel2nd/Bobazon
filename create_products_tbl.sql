USE bobazon_db;
DROP TABLE IF EXISTS products;

CREATE TABLE products(
  item_id  integer(11) auto_increment not null primary key,
  product_name  VARCHAR(50) not null,
  department_name varchar(25) not null,
  retail_price decimal(6,2) not null,
  stock_quantity integer(7) not null
);

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES
	("T-Shirt",		"Mens",		4.90, 350),
	("Tires", 		"Auto",		99.99, 100),
	("Necklace", 	"Jewelry",	995.99, 10),
	("Skirt", 		"Womens",	29.99, 350),
	("Blouse", 		"Womens",	29.99, 500),
	("Sandles", 	"Shoes",	19.99, 100),
	("Socks(3pk)",	"Mens",		9.90, 350),
	("Stockings",	"Womens",	9.99, 1000),
	("Tie",			"Mens",	 	20.00, 100),
	("Battery",		"Auto", 	99.99, 100),
	("Ring", 		"Jewelry", 5.99, 500)
    ;
