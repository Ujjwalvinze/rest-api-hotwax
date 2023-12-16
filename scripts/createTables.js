const mysql = require("mysql");
const db = require("./connectDb");

// console.log(db);

const createTablesQuery = `
CREATE TABLE order_header (
    ORDER_ID VARCHAR(40) NOT NULL,
    ORDER_NAME VARCHAR(255) DEFAULT NULL,
    PLACED_DATE DATETIME DEFAULT NULL,
    APPROVED_DATE DATETIME DEFAULT NULL,
    STATUS_ID VARCHAR(40) DEFAULT NULL,
    CURRENCY_UOM_ID VARCHAR(40) DEFAULT NULL,
    PRODUCT_STORE_ID VARCHAR(40) DEFAULT NULL,
    SALES_CHANNEL_ENUM_ID VARCHAR(40) DEFAULT NULL,
    GRAND_TOTAL DECIMAL(24,4) DEFAULT NULL,
    COMPLETED_DATE DATETIME DEFAULT NULL,
    PRIMARY KEY (ORDER_ID)
);
CREATE TABLE Party (
    PARTY_ID VARCHAR(40) NOT NULL,
    PARTY_TYPE_ENUM_ID VARCHAR(40) DEFAULT NULL,
    PRIMARY KEY (PARTY_ID)
);
CREATE TABLE Order_Part (
    ORDER_ID VARCHAR(40) NOT NULL,
    ORDER_PART_SEQ_ID VARCHAR(40) NOT NULL,
    PART_NAME VARCHAR(255) DEFAULT NULL,
    STATUS_ID VARCHAR(40) DEFAULT NULL,
    VENDOR_PARTY_ID VARCHAR(40) DEFAULT NULL,
    CUSTOMER_PARTY_ID VARCHAR(40) DEFAULT NULL,
    PART_TOTAL DECIMAL(24,4) DEFAULT NULL,
    FACILITY_ID VARCHAR(40) DEFAULT NULL,
    SHIPMENT_METHOD_ENUM_ID VARCHAR(40) DEFAULT NULL,
    PRIMARY KEY (ORDER_ID, ORDER_PART_SEQ_ID),
    FOREIGN KEY (ORDER_ID) REFERENCES order_header(ORDER_ID),
    FOREIGN KEY (CUSTOMER_PARTY_ID) REFERENCES Party(PARTY_ID)
);
CREATE TABLE Person (
    PARTY_ID VARCHAR(40) NOT NULL,
    SALUTATION VARCHAR(255) DEFAULT NULL,
    FIRST_NAME VARCHAR(255) DEFAULT NULL,
    MIDDLE_NAME VARCHAR(255) DEFAULT NULL,
    LAST_NAME VARCHAR(255) DEFAULT NULL,
    GENDER CHAR(1) DEFAULT NULL,
    BIRTH_DATE DATE DEFAULT NULL,
    MARITAL_STATUS_ENUM_ID VARCHAR(40) DEFAULT NULL,
    EMPLOYMENT_STATUS_ENUM_ID VARCHAR(40) DEFAULT NULL,
    OCCUPATION VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (PARTY_ID),
    FOREIGN KEY (PARTY_ID) REFERENCES Party(PARTY_ID)
);
CREATE TABLE Product (
    PRODUCT_ID VARCHAR(40) NOT NULL,
    OWNER_PARTY_ID VARCHAR(40) DEFAULT NULL,
    PRODUCT_NAME VARCHAR(255) DEFAULT NULL,
    DESCRIPTION VARCHAR(4095) DEFAULT NULL,
    CHARGE_SHIPPING CHAR(1) DEFAULT NULL,
    RETURNABLE CHAR(1) DEFAULT NULL,
    PRIMARY KEY (PRODUCT_ID),
    FOREIGN KEY (OWNER_PARTY_ID) REFERENCES Party(PARTY_ID)
);
CREATE TABLE order_item (
    ORDER_ID VARCHAR(40) NOT NULL,
    ORDER_ITEM_SEQ_ID VARCHAR(40) NOT NULL,
    ORDER_PART_SEQ_ID VARCHAR(40) DEFAULT NULL,
    PRODUCT_ID VARCHAR(40) DEFAULT NULL,
    ITEM_DESCRIPTION VARCHAR(255) DEFAULT NULL,
    QUANTITY DECIMAL(26,6) DEFAULT NULL,
    UNIT_AMOUNT DECIMAL(25,5) DEFAULT NULL,
    ITEM_TYPE_ENUM_ID VARCHAR(40) DEFAULT NULL,
    PARENT_ITEM_SEQ_ID VARCHAR(40) DEFAULT NULL,
    PRIMARY KEY (ORDER_ID, ORDER_ITEM_SEQ_ID),
    FOREIGN KEY (ORDER_ID) REFERENCES order_header(ORDER_ID),
    FOREIGN KEY (ORDER_ID, ORDER_PART_SEQ_ID) REFERENCES order_part(ORDER_ID, ORDER_PART_SEQ_ID),
    FOREIGN KEY (PRODUCT_ID) REFERENCES product(PRODUCT_ID)
);    
  `;

// Execute the multiple SQL statements
db.query(createTablesQuery, (err) => {
  if (err) {
    console.error("Error creating tables:", err);
    return;
  }
  console.log("Tables created successfully");
});