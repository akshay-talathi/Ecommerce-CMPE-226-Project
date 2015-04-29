

# nodeProj


## Developing
Node.js used for server side routing, ejs for client side programming, express.js as a middleware.
MySQL as a backend database.
MySQL table is created with following Queries.


------------------
Create Database and tables.
-------------------

CREATE database e_commerce;

CREATE TABLE `ecommerce1`.`User` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `userName` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `firstName` VARCHAR(45) NULL,
  `lastName` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL,
  `City` VARCHAR(45) NULL,
  `zip` VARCHAR(45) NULL,
  `state` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `phoneNumber` VARCHAR(45) NULL,
  PRIMARY KEY (`userId`));


CREATE TABLE `ecommerce1`.`Products` (
  `productID` INT NOT NULL,
  `productName` VARCHAR(45) NULL,
  `productQuantity` VARCHAR(45) NULL,
  `productPrice` VARCHAR(45) NULL,
  `image` VARCHAR(45) NULL,
  PRIMARY KEY (`productID`));

CREATE TABLE `ecommerce1`.`Admin` (
  `adminId` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `firstname` VARCHAR(45) NULL,
  `lastname` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  PRIMARY KEY (`adminId`));

CREATE TABLE `ecommerce1`.`Admin` (
  `adminId` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `firstname` VARCHAR(45) NULL,
  `lastname` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  PRIMARY KEY (`adminId`));




CREATE TABLE `ecommerce1`.`Cart` (
  `CartId` INT NOT NULL AUTO_INCREMENT,
  `price` VARCHAR(45) NULL,
  `data` VARCHAR(45) NULL,
  `userId` INT NULL,
  `quantity` INT NULL,
  PRIMARY KEY (`CartId`),
  INDEX `userID_idx` (`userId` ASC),
  CONSTRAINT `userIDs`
    FOREIGN KEY (`userId`)
    REFERENCES `ecommerce1`.`User` (`userId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)


CREATE TABLE `ecommerce1`.`cardDetails` (
  `nameOnCard` INT NOT NULL,
  `cardNumber` INT NULL,
  `cardType` VARCHAR(45) NULL,
  `cvvNumber` VARCHAR(45) NULL,
  `expiryDate` VARCHAR(45) NULL,
  `userId` INT NULL,
  INDEX `userIDC_idx` (`userId` ASC),
  CONSTRAINT `userIDC`
    FOREIGN KEY (`userId`)
    REFERENCES `ecommerce1`.`User` (`userId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


CREATE TABLE `ecommerce1`.`Orders` (
  `orderId` INT NOT NULL,
  `userId` INT NULL,
  `productId` INT NULL,
  `quantity` VARCHAR(45) NULL,
  `Orderscol` INT NULL,
  `total` VARCHAR(45) NULL,
  `isCancelled` TINYINT(1) NULL,
  `isDelivered` TINYINT(1) NULL,
  `orderImage` VARCHAR(45) NULL,
  PRIMARY KEY (`orderId`),
  INDEX `userIDa_idx` (`userId` ASC),
  INDEX `productIDs_idx` (`productId` ASC),
  CONSTRAINT `userI`
    FOREIGN KEY (`userId`)
    REFERENCES `ecommerce1`.`User` (`userId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `productI`
    FOREIGN KEY (`productId`)
    REFERENCES `ecommerce1`.`Products` (`productID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-----------
RUN node app.js in the terminal and project will be up and running in the localhost:4302
-----------------

Thank You.


### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
# ecommerce-node.js-express.js-mysql
