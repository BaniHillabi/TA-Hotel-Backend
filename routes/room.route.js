const express = require("express");
const app = express();

const roomController = require("../controllers/kamar.controller");
app.get("/", roomController.getAllRoom);
app.post("/", roomController.addRoom);
app.post("/find", roomController.findRoom);
app.get("/find/:id", roomController.getRoomById);
app.put("/:id", roomController.updateRoom);
app.delete("/:id", roomController.deleteRoom);

module.exports = app;
