-- MySQL Script generated by MySQL Workbench
-- Tue Mar 24 14:48:21 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema store_database
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema store_database
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `store_database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `store_database` ;

-- -----------------------------------------------------
-- Table `store_database`.`customer`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `store_database`.`customer` (
  `membership_ID` INT NOT NULL DEFAULT 0,
  `FK_customer_cart` INT NOT NULL DEFAULT 0,
  `username` VARCHAR(32) NULL DEFAULT NULL,
  `first_name` VARCHAR(50) NULL DEFAULT NULL,
  `last_name` VARCHAR(50) NULL DEFAULT NULL,
  `email` VARCHAR(50) NULL DEFAULT NULL,
  `phone_number` VARCHAR(50) NULL DEFAULT NULL,
  `adress1` VARCHAR(50) NULL DEFAULT NULL,
  `address2` VARCHAR(50) NULL DEFAULT NULL,
  `city` VARCHAR(32) NULL DEFAULT NULL,
  `state` VARCHAR(32) NULL DEFAULT NULL,
  `zip_code` VARCHAR(32) NULL DEFAULT NULL,
  `country` VARCHAR(32) NULL DEFAULT NULL,
  `store_credit` DECIMAL(19,2) NULL DEFAULT 0,
  PRIMARY KEY (`membership_ID`),
  INDEX `FK_customer_cart` (`FK_customer_cart` ASC) VISIBLE,
  CONSTRAINT `customer_ibfk_1`
    FOREIGN KEY (`FK_customer_cart`)
    REFERENCES `store_database`.`cart` (`cart_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `store_database`.`department`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_database`.`department` (
  `department_ID` INT NOT NULL DEFAULT 0,
  `department_name` VARCHAR(50) NULL DEFAULT NULL,
  `text_descridepartmentption` VARCHAR(255) NULL DEFAULT NULL,
  `html_tag` VARCHAR(255) NULL DEFAULT NULL,
  `image` VARCHAR(100) NULL DEFAULT NULL,
  `FK_MEMBERSHIP_ID` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`department_ID`),
  INDEX `FK_MEMBERSHIP_ID` (`FK_MEMBERSHIP_ID` ASC) VISIBLE,
  CONSTRAINT `department_ibfk_1`
    FOREIGN KEY (`FK_MEMBERSHIP_ID`)
    REFERENCES `store_database`.`customer` (`membership_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `store_database`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_database`.`product` (
  `product_ID` INT NOT NULL DEFAULT 0,
  `FK_product_dept_id`  INT NOT NULL DEFAULT 0,
  `product_name` VARCHAR(50) NULL DEFAULT NULL,
  `product_desc` VARCHAR(255) NULL DEFAULT NULL,
  `vendor` VARCHAR(50) NULL DEFAULT NULL,
  `buy_price` DECIMAL(19,2) NULL DEFAULT NULL,
  `MSRP` DECIMAL(19,2) NULL DEFAULT NULL,
  `quantity_inStock` INT NULL DEFAULT NULL,
  PRIMARY KEY (`product_ID`),
  INDEX `FK_product_dept_id` (`FK_product_dept_id` ASC) VISIBLE,
  CONSTRAINT `product_ibfk_1`
    FOREIGN KEY (`FK_product_dept_id`)
    REFERENCES `store_database`.`department` (`department_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `store_database`.`cart`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_database`.`cart` (
  `cart_ID` INT NOT NULL DEFAULT 0,
  `FK_product_cart` INT NOT NULL DEFAULT 0,
  `transaction_ID` INT NOT NULL DEFAULT 0,
  `cart_description` VARCHAR(255) NULL DEFAULT NULL,
  `total_price` DECIMAL(19,2) NULL DEFAULT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`cart_ID`),
  INDEX `FK_product_cart` (`FK_product_cart` ASC) VISIBLE,
  CONSTRAINT `cart_ibfk_1`
    FOREIGN KEY (`FK_product_cart`)
    REFERENCES `store_database`.`product` (`product_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `store_database`.`payment_information`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_database`.`payment_information` (
  `checkNum` VARCHAR(255) NOT NULL DEFAULT 0,
  `FK_customer_payment` INT NULL DEFAULT 0,
  `payment_date` DATE NULL DEFAULT NULL,
  `amount` DECIMAL(19,2) NULL DEFAULT NULL,
  PRIMARY KEY (`checkNum`),
  INDEX `FK_customer_payment` (`FK_customer_payment` ASC) VISIBLE,
  CONSTRAINT `payment_information_ibfk_1`
    FOREIGN KEY (`FK_customer_payment`)
    REFERENCES `store_database`.`customer` (`membership_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `store_database`.`order_information`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_database`.`order_information` (
  `transaction_ID` INT NOT NULL DEFAULT 0,
  `FK_member_transaction` INT NOT NULL DEFAULT 0,
  `FK_cart_transaction` INT NOT NULL DEFAULT 0,
  `FK_payment_ID` VARCHAR(255) NULL DEFAULT 0,
  `order_date` DATE NULL DEFAULT NULL,
  `expected_Delivery` DATE NULL DEFAULT NULL,
  `shipped_Date` DATE NULL DEFAULT NULL,
  `order_status` INT NOT NULL,
  PRIMARY KEY (`transaction_ID`),
  INDEX `FK_member_transaction` (`FK_member_transaction` ASC) VISIBLE,
  INDEX `FK_cart_transaction` (`FK_cart_transaction` ASC) VISIBLE,
  INDEX `FK_payment_ID` (`FK_payment_ID` ASC) VISIBLE,
  CONSTRAINT `order_information_ibfk_1`
    FOREIGN KEY (`FK_member_transaction`)
    REFERENCES `store_database`.`customer` (`membership_ID`),
  CONSTRAINT `order_information_ibfk_2`
    FOREIGN KEY (`FK_cart_transaction`)
    REFERENCES `store_database`.`cart` (`cart_ID`),
  CONSTRAINT `order_information_ibfk_3`
    FOREIGN KEY (`FK_payment_ID`)
    REFERENCES `store_database`.`payment_information` (`checkNum`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `store_database`.`employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_database`.`employee` (
  `employee_ID` INT NULL DEFAULT 0,
  `FK_member_employee` INT NULL DEFAULT 0,
  `FK_office_employee` INT NULL DEFAULT 0,
  `FK_transaction_employee` INT NULL DEFAULT 0,
  `FK_supervisor_ID` INT NULL DEFAULT 0,
  `username` VARCHAR(32) NULL DEFAULT NULL,
  `first_name` VARCHAR(50) NULL DEFAULT NULL,
  `last_name` VARCHAR(50) NULL DEFAULT NULL,
  `email` VARCHAR(50) NULL DEFAULT NULL,
  `phone_number` VARCHAR(50) NULL DEFAULT NULL,
  `office_address` VARCHAR(50) NULL DEFAULT NULL,
  `supervisor_ID` INT NULL DEFAULT NULL,
  `supervisor` TINYINT(1) NULL DEFAULT NULL,
  INDEX `FK_member_employee` (`FK_member_employee` ASC) VISIBLE,
  INDEX `FK_transaction_employee` (`FK_transaction_employee` ASC) VISIBLE,
  CONSTRAINT `employee_ibfk_1`
    FOREIGN KEY (`FK_member_employee`)
    REFERENCES `store_database`.`customer` (`membership_ID`),
  CONSTRAINT `employee_ibfk_2`
    FOREIGN KEY (`FK_transaction_employee`)
    REFERENCES `store_database`.`order_information` (`transaction_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
