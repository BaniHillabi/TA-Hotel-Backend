const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());

const PORT = 700;

const customerRoute = require("./routes/customer.route");
app.use("/customer", customerRoute);

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
});
