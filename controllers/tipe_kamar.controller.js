//import model
const typeModel = require("../models/index").tipe_kamar;

const Op = require(`sequelize`).Op;
const { uploadRoomType } = require(`./upload-foto.controller`);
const fs = require("fs");
const path = require("path");

exports.getAllType = async (req, res) => {
  try {
    let dataType = await typeModel.findAll();

    return res.status(200).json({
      success: true,
      data: dataType,
      message: "All room type have been loaded",
    });
  } catch (error) {
    console.error("Error in getAllType: ", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Room Type is empty",
    });
  }
};

exports.getTypeById = async (req, res) => {
  let idType = req.params.id;

  try {
    const dataType = await typeModel.findOne({where: {id:idType}});

    if(!dataType){
      return res.status(404).json({ message: 'Room Type Not Found' });
    }

    return res.status(200).json(dataType);
  } catch (error) {
    console.error(error)
    return res.status(500).json({message : "There is trouble in server"});
  }
};

exports.findType = async (req, res) => {
  let keyword = req.body.keyword;

  try {
    let dataType = await typeModel.findAll({
      where: {
        [Op.or]: [
          { nama_tipe_kamar: { [Op.substring]: keyword } },
          { harga: { [Op.substring]: keyword } },
          { deskripsi: { [Op.substring]: keyword } },
        ],
      },
    });

    return res.status(200).json(dataType);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Member Not Found",
    });
  }
};

exports.addType = async (req, res) => {
  uploadRoomType.single("foto")(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error });
    }

    if (!req.file) {
      return res.json({ message: "No uploaded file" });
    }

    let dataType = {
      nama_tipe_kamar: req.body.nama_tipe_kamar,
      harga: req.body.harga,
      deskripsi: req.body.deskripsi,
      foto: req.file.filename,
    };

    typeModel
      .create(dataType)
      .then((result) => {
        return res.json({
          success: true,
          data: result,
          message: "New room type has been inserted",
        });
      })
      .catch((error) => {
        return res.status(500).json({ message: "Failed to add room type" });
      });
  });
};

exports.updateType = async (req, res) => {
  uploadRoomType.single("foto")(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error });
    }

    let idType = req.params.id;
    let dataType = {
      nama_tipe_kamar: req.body.nama_tipe_kamar,
      harga: req.body.harga,
      deskripsi: req.body.deskripsi,
    };
    if (req.file) {
      const selectedType = await typeModel.findOne({
        where: { id: idType },
      });

      const oldFoto = selectedType.foto;

      const pathFoto = path.join(__dirname, `../images/roomtype`, oldFoto);

      if (fs.existsSync(pathFoto)) {
        fs.unlink(pathFoto, (error) => console.log(error));
      }
      dataType.foto = req.file.filename;
    }

    typeModel
      .update(dataType, { where: { id: idType } })
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

exports.deleteType = async (req, res) => {
  let idType = req.params.id;
  const Type = await typeModel.findOne({ where: { id: idType } });
  const oldFoto = Type.foto;
  const pathFoto = path.join(__dirname, "../images/roomtype", oldFoto);

  if (fs.existsSync(pathFoto)) {
    fs.unlink(pathFoto, (error) => console.log(error));
  }

  typeModel
    .destroy({ where: { id: idType } })
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
