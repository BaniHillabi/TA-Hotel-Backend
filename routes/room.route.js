const express = require("express");
const app = express();

const roomController = require("../controllers/customer.controller");
app.get("/", roomController.getAllCustomer);
app.post("/", roomController.addCust);
app.post("/find", roomController.findCust);
app.post("/find/:id", roomController.getCustById);
app.put("/:id", roomController.updateCust);
app.delete("/:id", roomController.deleteCust);

module.exports = app;
