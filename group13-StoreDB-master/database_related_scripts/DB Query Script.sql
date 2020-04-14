CREATE DATABASE store_database;

<<<<<<< HEAD

USE store_database;

CREATE TABLE customer (
membership_ID INT NOT NULL AUTO_INCREMENT,
-- FK_customer_cart INT NOT NULL,
=======
USE store_database;

ALTER TABLE customer ADD FK_customer_cart INT NOT NULL;

CREATE TABLE customer (
membership_ID INT NOT NULL AUTO_INCREMENT,
FK_customer_cart INT NOT NULL,
>>>>>>> a28d83802671b6cefcce1cf676bbef816a0e1e7d
username VARCHAR(32),
first_name VARCHAR(50),
last_name VARCHAR(50),
email VARCHAR(50),
phone_number VARCHAR(50),
adress1 VARCHAR(50),
address2 VARCHAR(50),
city VARCHAR(32),
state VARCHAR(32),
zip_code VARCHAR(32),
country VARCHAR(32),
store_credit NUMERIC(19, 2),
PRIMARY KEY (membership_ID),
<<<<<<< HEAD
-- FOREIGN KEY (FK_customer_cart) REFERENCES cart(cart_ID)
=======
FOREIGN KEY (FK_customer_cart) REFERENCES cart(cart_ID)
>>>>>>> a28d83802671b6cefcce1cf676bbef816a0e1e7d
);

CREATE TABLE department(
department_ID INTEGER NOT NULL,
text_description VARCHAR(255),
html_tag VARCHAR(255),
image VARCHAR(100),
PRIMARY KEY (department_ID)
);

CREATE TABLE product(
product_ID INTEGER NOT NULL,
product_dept INTEGER NOT NULL,
product_name VARCHAR(50),
product_desc VARCHAR(255),
vendor VARCHAR(50),
buy_price NUMERIC(19, 2),
MSRP NUMERIC(19, 2),
quantity_inStock INTEGER,
PRIMARY KEY (product_ID)
);
<<<<<<< HEAD

CREATE TABLE cart(
cart_ID INT NOT NULL AUTO_INCREMENT,
-- FK_product_cart INT NOT NULL,
=======
ALTER TABLE cart ADD FK_product_cart INT NOT NULL;
CREATE TABLE cart(
cart_ID INT NOT NULL AUTO_INCREMENT,
FK_product_cart INT NOT NULL,
>>>>>>> a28d83802671b6cefcce1cf676bbef816a0e1e7d
transaction_ID INT NOT NULL,
cart_description VARCHAR(255),
total_price NUMERIC(19, 2),
quantity INT NOT NULL,
PRIMARY KEY (cart_ID),
<<<<<<< HEAD
-- FOREIGN KEY(FK_product_cart) REFERENCES cart(cart_ID)
=======
FOREIGN KEY(FK_product_cart) REFERENCES cart(cart_ID)
>>>>>>> a28d83802671b6cefcce1cf676bbef816a0e1e7d
);

CREATE TABLE order_information(
transaction_ID INT NOT NULL,
<<<<<<< HEAD
-- FK_member_transaction INT NOT NULL,
-- FK_cart_transaction INT NOT NULL,
=======
FK_member_transaction INT NOT NULL,
FK_cart_transaction INT NOT NULL,
>>>>>>> a28d83802671b6cefcce1cf676bbef816a0e1e7d
order_date DATE,
expected_Delivery DATE,
shipped_Date DATE,
order_status INTEGER NOT NULL,
PRIMARY KEY(transaction_ID),
<<<<<<< HEAD
-- FOREIGN KEY(FK_member_transaction) REFERENCES customer(membership_ID),
-- FOREIGN KEY(FK_cart_transaction) REFERENCES cart(cart_ID)
=======
FOREIGN KEY(FK_member_transaction) REFERENCES customer(membership_ID),
FOREIGN KEY(FK_cart_transaction) REFERENCES cart(cart_ID)
>>>>>>> a28d83802671b6cefcce1cf676bbef816a0e1e7d
);

CREATE TABLE payment_information(
checkNum VARCHAR(255),
<<<<<<< HEAD
-- FK_customer_payment INTEGER(10),
payment_date DATE,
amount NUMERIC(19,2),
PRIMARY KEY (checkNum),
-- FOREIGN KEY (FK_customer_payment) REFERENCES customer (customer_ID)
=======
FK_customer_payment INTEGER(10),
payment_date DATE,
amount NUMERIC(19,2),
PRIMARY KEY (checkNum),
FOREIGN KEY (FK_customer_payment) REFERENCES customer (customer_ID)
>>>>>>> a28d83802671b6cefcce1cf676bbef816a0e1e7d
);

CREATE TABLE employee(
employee_ID INTEGER,
<<<<<<< HEAD
-- FK_member_employee INTEGER,
-- FK_office_employee INTEGER,
-- FK_transaction_employee INTEGER,
=======
FK_member_employee INTEGER,
FK_office_employee INTEGER,
FK_transaction_employee INTEGER,
>>>>>>> a28d83802671b6cefcce1cf676bbef816a0e1e7d
username VARCHAR(32),
first_name VARCHAR(50),
last_name VARCHAR(50),
email VARCHAR(50),
phone_number VARCHAR(50),
office_address VARCHAR(50),
supervisor BOOL
<<<<<<< HEAD
);
=======
);

>>>>>>> a28d83802671b6cefcce1cf676bbef816a0e1e7d
