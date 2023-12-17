const express = require("express");
const userRouter = require("../Routers/userRouter");
const orderRouter = require("../Routers/orderRouter");

const app = express();

app.use(express.json());

const PORT = 3000;

app.use("/user", userRouter);
app.use("/order", orderRouter);

app.listen(PORT, () => {
  console.log("Server is running on port : ", PORT);
});
