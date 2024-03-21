const express = require("express");
const app = express();

const typeController = require("../controllers/tipe_kamar.controller");
app.get("/", typeController.getAllType);
app.post("/", typeController.addType);

module.exports = app;
