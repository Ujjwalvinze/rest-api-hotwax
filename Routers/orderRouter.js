const express = require("express");
const app = express();
const db = require("../scripts/connectDb");
const orderRouter = express.Router();

// const getOrderHandler

const createOrderHandler = (req, res) => {
  const {
    orderName,
    currencyUomId,
    salesChannelEnumId,
    statusId,
    productStoreId,
    placedDate,
    approvedDate,
  } = req.body;

  if (currencyUomId == undefined) currencyUomId = "USD";
  if (statusId == undefined) statusId = "OrderPlaced";

  if (orderName == undefined || placedDate == undefined) {
    res.status(400);
    res.send("orderName and placedDate is required");
  }

  const query = `INSERT INTO order_header VALUES(${1001}, '${orderName}','${placedDate}', '${approvedDate}','${statusId}', '${currencyUomId}','${productStoreId}','${salesChannelEnumId}', '${2}','${placedDate}');`;

  db.query(query, (error) => {
    if (error) {
      res.json("Failed to create order");
      throw error;
    }

    res.json("Order created");
  });
};

const getOrderHandler = (req, res) => {
  const { orderId } = req.body;

  const query = `SELECT * from order_header join`;
};

orderRouter.post("/", createOrderHandler);
orderRouter.get("/", getOrderHandler);

module.exports = orderRouter;
