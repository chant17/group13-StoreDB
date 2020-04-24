#CREATE DATABASE store_database;
#USE store_database;
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE customer;
-- DROP TABLE cart;
-- DROP TABLE department;
-- DROP TABLE order_information;
-- DROP TABLE payment_information;
-- DROP TABLE product;
-- SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE customer (
membership_ID INT NOT NULL AUTO_INCREMENT,
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
FK_cart_ID INT NOT NULL,
FK_product_cart INT NOT NULL DEFAULT 0,
price FLOAT DEFAULT 0,
quantity INT NOT NULL
);
CREATE TABLE cust_cart(
cartID integer not null auto_increment,
FK_membershipID integer not null,
primary key (cartID)
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

-- ADDING FOREIGN KEYs/connections

ALTER TABLE order_information ADD FOREIGN KEY(FK_member_transaction) REFERENCES customer(membership_ID);
ALTER TABLE order_information ADD CONSTRAINT orderConst1 FOREIGN KEY(FK_member_transaction) REFERENCES customer(membership_ID) on update cascade on delete cascade;
ALTER TABLE order_information ADD FOREIGN KEY(FK_cart_transaction) REFERENCES cust_cart(cartID);
ALTER TABLE order_information ADD CONSTRAINT orderConst2 FOREIGN KEY(FK_cart_transaction) REFERENCES cust_cart(cartID) on update cascade on delete cascade;
ALTER TABLE payment_information ADD FOREIGN KEY (FK_customer_payment) REFERENCES customer (membership_ID);
ALTER TABLE payment_information ADD CONSTRAINT paymentConst FOREIGN KEY (FK_customer_payment) REFERENCES customer (membership_ID) on update cascade on delete cascade;
ALTER TABLE department ADD FOREIGN KEY(FK_MEMBERSHIP_ID) REFERENCES customer(membership_ID);
ALTER TABLE department ADD constraint deptConst1 FOREIGN KEY(FK_MEMBERSHIP_ID) REFERENCES customer(membership_ID) on update cascade on delete cascade;
ALTER TABLE product ADD FOREIGN KEY(FK_product_dept_id) REFERENCES department(department_ID);
ALTER TABLE product ADD constraint prodConst FOREIGN KEY(FK_product_dept_id) REFERENCES department(department_ID) on update cascade on delete cascade;
ALTER TABLE order_information ADD FOREIGN KEY(FK_payment_id) REFERENCES payment_information(checkNum);
ALTER TABLE order_information ADD CONSTRAINT orderConst3 FOREIGN KEY(FK_payment_id) REFERENCES payment_information(checkNum) on update cascade on delete cascade;
ALTER TABLE cart ADD FOREIGN KEY(FK_product_cart) REFERENCES product(product_ID);
ALTER TABLE cart ADD constraint cartConst FOREIGN KEY(FK_product_cart) REFERENCES product(product_ID) on update cascade on delete cascade;
ALTER TABLE customer ADD password varchar(20) NOT NULL; 
ALTER TABLE cart add product_name varchar(40);
ALTER TABLE product add imgLink varchar(255);
ALTER TABLE cart add product_desc varchar(255);
ALTER TABLE cart add imgLink varchar(255);
ALTER TABLE cart ADD FOREIGN KEY(FK_cart_ID) REFERENCES cust_cart(cartID);
ALTER TABLE cart ADD constraint cartConst2 FOREIGN KEY(FK_cart_ID) REFERENCES cust_cart(cartID) on update cascade on delete cascade;
ALTER TABLE cust_cart ADD FOREIGN KEY(FK_membershipID) REFERENCES customer(MEMBERSHIP_ID);
ALTER TABLE cust_cart ADD constraint custCartConst FOREIGN KEY(FK_membershipID) REFERENCES customer(MEMBERSHIP_ID) on update cascade on delete cascade;
ALTER TABLE customer ADD isAdmin boolean default 0;

#TRIGGERS

-- CART CREATION TRIGGER
CREATE TRIGGER Cart_Creation
AFTER INSERT ON customer
FOR EACH ROW
INSERT INTO cust_cart (FK_MEMBERSHIPID) SELECT MAX(membership_ID) FROM customer;


-- RESTOCK PRODUCT TRIGGER 
CREATE TRIGGER restock_inventory
BEFORE INSERT on order_information
FOR EACH ROW
UPDATE product SET quantity_inStock = FLOOR(RAND()*(50-10+1)+10) WHERE quantity_inStock < 10;

-- DISCOUNT PRODUCT TRIGGER 
DELIMITER //
CREATE TRIGGER discount
BEFORE INSERT ON payment_information FOR EACH ROW
BEGIN
	IF (SELECT store_credit from customer WHERE membership_ID = NEW.FK_customer_payment) > 1000 
    THEN SET NEW.amount = NEW.amount / 2;
    UPDATE customer set store_credit = store_credit - 1000 where membership_ID = NEW.FK_customer_payment;
	END IF;
END //
DELIMITER ;






-- TEST QUERIES
UPDATE customer set store_credit = 1050 where username = 'discount';
select * from cart;
select * from order_information;  -- where FK_member_transaction = 7;
select * from customer;
select * from product;
select * from product where product_ID = 27108; -- 52
select * from product where product_ID = 19537; -- 8
delete from payment_information where FK_customer_payment = 7;
delete from order_information where FK_member_transaction = 7;
select * from payment_information where FK_customer_payment = 7;
select * from product where product_ID = 33311;

select FK_product_cart from cart where FK_cart_ID = 6;
update product set quantity_inStock = quantity_inStock - (select quantity from cart where FK_product_cart = 27108) where product_id = 27108;
update product set quantity_inStock = 25 where product_ID = 27108;

SELECT count(*) from customer where username = 'kepa123';
select * from customer where username = 'admin';
update customer set isAdmin = 1 where username = 'admin';

select * from cust_cart;
select * from customer;
select * from customer where membership_ID = 99736;

select * from product where product_ID = 33311;
select * from cart;

select transaction_ID, FK_member_transaction, order_date, expected_Delivery, order_status, p.amount from order_information o, payment_information p where o.FK_payment_ID = p.checkNum;
