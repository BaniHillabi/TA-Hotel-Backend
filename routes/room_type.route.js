const express = require("express");
const app = express();

const typeController = require("../controllers/tipe_kamar.controller");
app.get("/", typeController.getAllType);
app.post("/", typeController.addType);
app.post("/findType", typeController.findType);
app.get("/:id", typeController.getTypeById);
app.put("/:id",typeController.updateType);
app.delete("/:id",typeController.deleteType)



module.exports = app;
