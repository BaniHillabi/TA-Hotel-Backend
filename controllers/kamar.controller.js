//import model
const kamarModel = require("../models/index").kamar;

const Op = require(`sequelize`).Op;
const bcrypt = require(`bcrypt`);
const upload = require("./upload-foto-customer.controller").single("foto");
const fs = require("fs");
const path = require("path");

exports.getAllKamar = async (req, res) => {
  try {
    let dataCust = await kamarModel.findAll();

    return res.status(200).json({
      success: true,
      data: dataCust,
      message: "All Customer have been loaded",
    });
  } catch (error) {
    console.error("Error in getAllCustomer: ", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Data Customer is empty",
    });
  }
};

exports.getCustById = async (req, res) => {
  let idCust = req.params.id;

  try {
    let dataCust = await kamarModel.findOne({ where: { id: idCust } });

    return res.status(200).json(dataCust);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Member Not Found",
    });
  }
};

exports.findCust = async (req, res) => {
  let keyword = req.body.keyword;

  try {
    let dataCust = await kamarModel.findAll({
      where: {
        [Op.or]: [
          { nama_customer: { [Op.substring]: keyword } },
          { username: { [Op.substring]: keyword } },
        ],
      },
    });

    return res.status(200).json(dataCust);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Member Not Found",
    });
  }
};

exports.addCust = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error });
    }

    const existingCust = await kamarModel.findOne({
      where: { username: req.body.username },
    });

    if (existingCust) {
      return res.status(400).json({ message: "Username already in use" });
    }
    if (!req.file) {
      return res.json({ message: "No uploaded file" });
    }

    let newCust = {
      nama_customer: req.body.nama_customer,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      foto: req.file.filename,
    };

    kamarModel
      .create(newCust)
      .then((result) => {
        return res.json({
          success: true,
          data: result,
          message: "New Customer has been inserted",
        });
      })
      .catch((error) => {
        return res.status(500).json({ message: "Failed to add customer" });
      });
  });
};

exports.updateCust = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    const existingCust = await kamarModel.findOne({
      where: { username: req.body.username },
    });

    if (existingCust) {
      return res.status(400).json({ message: "Username already in use" });
    }
    
    let idCust = req.params.id;
    let dataCust = {
      nama_customer: req.body.nama_customer,
      username: req.body.username,
      password: req.body.password,
    };
    if (req.file) {
      const selectedCust = await kamarModel.findOne({
        where: { id: idCust },
      });

      const oldFoto = selectedCust.foto;

      const pathFoto = path.join(__dirname, `../images/customer`, oldFoto);

      if (fs.existsSync(pathFoto)) {
        fs.unlink(pathFoto, (error) => console.log(error));
      }
      dataCust.foto = req.file.filename;
    }

    kamarModel
      .update(dataCust, { where: { id: idCust } })
      .then((result) => {
        res.json({
          result: result,
          message: "data has been updated",
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  });
};

exports.deleteCust = async (req, res) => {
  let idCust = req.params.id;
  const customer = await kamarModel.findOne({ where: { id: idCust } });
  const oldFoto = customer.foto;
  const pathFoto = path.join(__dirname, "../images/customer", oldFoto);

  if (fs.existsSync(pathFoto)) {
    fs.unlink(pathFoto, (error) => console.log(error));
  }

  kamarModel
    .destroy({ where: { id: idCust } })
    .then((result) => {
      return res.json({
        success: true,
        data: result,
        message: "Data Customer has been removed",
      });
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: error.message,
      });
    });
};
