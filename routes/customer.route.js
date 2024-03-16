const express = require("express");
const app = express();

const customerController = require("../controllers/customer.controller");
app.get("/", customerController.getAllCustomer);
app.post("/", customerController.addCust);
app.post("/find", customerController.findCust);
app.post("/find/:id", customerController.getCustById);
app.put("/:id", customerController.updateCust);
app.delete("/:id", customerController.deleteCust);

module.exports = app;
