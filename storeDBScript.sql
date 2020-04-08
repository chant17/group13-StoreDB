#CREATE DATABASE store_database;
#USE store_database;
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE customer;
-- DROP TABLE cart;
-- DROP TABLE department;
-- DROP TABLE order_information;
-- DROP TABLE payment_information;
-- DROP TABLE product;
-- DROP TABLE employee;
-- SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE customer (
membership_ID INT NOT NULL AUTO_INCREMENT,
-- FK_customer_cart INT NOT NULL DEFAULT 0,
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
PRIMARY KEY (membership_ID)
);


CREATE TABLE department(
department_ID INTEGER NOT NULL DEFAULT 0,
department_name VARCHAR(50),
FK_MEMBERSHIP_ID INT NOT NULL DEFAULT 0,
text_descridepartmentption VARCHAR(255),
html_tag VARCHAR(255),
image VARCHAR(100),
PRIMARY KEY (department_ID)
);

CREATE TABLE product(
product_ID INTEGER NOT NULL DEFAULT 0,
FK_product_dept_id INTEGER NOT NULL DEFAULT 0,
product_name VARCHAR(50),
product_desc VARCHAR(255),
vendor VARCHAR(50),
buy_price NUMERIC(19, 2),
MSRP NUMERIC(19, 2),
quantity_inStock INTEGER,
PRIMARY KEY (product_ID)
);

CREATE TABLE cart(
cart_ID INT NOT NULL DEFAULT 0 ,
FK_product_cart INT NOT NULL DEFAULT 0,
FK_MEMBERSHIP_ID INT DEFAULT 0,
cart_description VARCHAR(255),
total_price NUMERIC(19, 2),
quantity INT NOT NULL,
PRIMARY KEY (cart_ID)
);

CREATE TABLE order_information(
transaction_ID INT NOT NULL DEFAULT 0,
FK_member_transaction INT NOT NULL DEFAULT 0,
FK_cart_transaction INT NOT NULL DEFAULT 0,
FK_payment_ID VARCHAR(255) DEFAULT 0,
order_date DATE,
expected_Delivery DATE,
shipped_Date DATE,
order_status INTEGER NOT NULL,
PRIMARY KEY(transaction_ID)
);

CREATE TABLE payment_information(
checkNum VARCHAR(255) DEFAULT 0,
FK_customer_payment INTEGER(10) DEFAULT 0,
payment_date DATE,
amount NUMERIC(19,2),
PRIMARY KEY (checkNum)
);

CREATE TABLE employee(
employee_ID INTEGER DEFAULT 0,
FK_member_employee INTEGER DEFAULT 0,
FK_office_employee INTEGER DEFAULT 0,
FK_transaction_employee INTEGER DEFAULT 0,
FK_supervisor_ID INTEGER DEFAULT 0,
username VARCHAR(32),
first_name VARCHAR(50),
last_name VARCHAR(50),
email VARCHAR(50),
phone_number VARCHAR(50),
office_address VARCHAR(50),
supervisor_ID INTEGER DEFAULT 0,
supervisor BOOL,
PRIMARY KEY (employee_id, supervisor_ID)
);

 


-- ADDING FOREIGN KEYs/connections

ALTER TABLE order_information ADD FOREIGN KEY(FK_member_transaction) REFERENCES customer(membership_ID);
ALTER TABLE order_information ADD FOREIGN KEY(FK_cart_transaction) REFERENCES cart(cart_ID);
ALTER TABLE payment_information ADD FOREIGN KEY (FK_customer_payment) REFERENCES customer (membership_ID);
#ALTER TABLE department ADD FK_MEMBERSHIP_ID INT NOT NULL;
ALTER TABLE department ADD FOREIGN KEY(FK_MEMBERSHIP_ID) REFERENCES customer(membership_ID);
ALTER TABLE product ADD FOREIGN KEY(FK_product_dept_id) REFERENCES department(department_ID);
ALTER TABLE order_information ADD FOREIGN KEY(FK_payment_id) REFERENCES payment_information(checkNum);
ALTER TABLE employee ADD FOREIGN KEY(FK_member_employee) REFERENCES customer(membership_ID);
ALTER TABLE employee ADD FOREIGN KEY(FK_transaction_employee) REFERENCES order_information(transaction_ID);
ALTER TABLE cart ADD FOREIGN KEY(FK_product_cart) REFERENCES product(product_ID);
-- ALTER TABLE employee ADD FOREIGN KEY(FK_supervisor_ID) REFERENCES employee(supervisor_ID);
ALTER TABLE customer ADD password varchar(20) NOT NULL;
ALTER TABLE cart ADD FOREIGN KEY(FK_MEMBERSHIP_ID) REFERENCES customer(MEMBERSHIP_ID);

