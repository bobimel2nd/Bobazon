# BobAZon

## Bob's Store

Bob's Store is an Amazon-like storefront using npm Inquirer and npm MySql. The project includes the following:
    * bobazonCustomer.js - Customer Resource
    * bobazonManager.js - Manager Resource
    * bobazonDB.js - BobAZon Database handler
    * create_bobazon_db.sql - MySQL Script to Create Database
    * create_products_tbl.sql - MySQL Script to Create/Load Mock Product Table

### Customer View Access - node.js bobazonCustomer.js

This command will start the Customer facing applicaton.  The user will indicated the product and quantity they wish to purchase. If available, the purchase will be completed and the customer billed.

### Manager View Access - node.js bobazonManager.js

This command will start the Manager Facing applicaton.
It will present the manager a list of options:
    * View Products for Sale - View all Products
    * View Low Inventory - View Products with Quantities less that a value
    * Add to Inventory - Add Inventory to existing product
    * Add New Product - Add New Product to inventory
    * Exit Manager Menu
