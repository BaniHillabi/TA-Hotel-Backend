//import model
const roomModel = require("../models/index").kamar;

const Op = require(`sequelize`).Op;

exports.getAllRoom = async (req, res) => {
  try {
    const roomData = await roomModel.findAll();

    return res.status(200).json({
      success: true,
      data: roomData,
      message: "All data have been loaded",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
};

exports.getRoomById = async (req, res) => {
  let idRoom = req.params.id;

  try {
    const roomData = await roomModel.findOne({
      where: { id: idRoom },
    });

    if (!roomData) {
      return res.status(404).json({
        message: "Room Not Found",
      });
    }

    return res.status(200).json(roomData);
  } catch (error) {
    return res.status(500).json({
      message: "There is trouble in server",
      error: error,
    });
  }
};

exports.findRoom = async (req, res) => {
  let keyword = req.body.keyword;

  try {
    let roomData = await roomModel.findAll({
      where: {
        [Op.or]: [
          { nomor_kamar: { [Op.substring]: keyword } },
          { id_tipe_kamar: { [Op.substring]: keyword } },
        ],
      },
    });

    return res.status(200).json(roomData);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Room Not Found",
    });
  }
};

exports.addRoom = async (req, res) => {
  try {
    const roomData = {
      nomor_kamar: req.body.nomor_kamar,
      id_tipe_kamar: req.body.id_tipe_kamar,
    };

    roomModel.create(roomData).then((result) => {
      return res.status(200).json({
        success: true,
        data: result,
        message: "New room has been inserted",
      });
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error,
    });
  }
};

exports.updateRoom = async (req, res) => {
  let idRoom = req.params.id;
  let roomData = {
    nomor_kamar : req.body.nomor_kamar,
    id_tipe_kamar: req.body.id_tipe_kamar
  };

  roomModel
    .update(roomData, { where: { id: idRoom } })
    .then((result) => {
      res.status(200).json({
        result: result,
        message: "data has been updated",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message : "nothing updated",
        error: error,
      });
    });
};

exports.deleteRoom = async (req, res) => {
  let idRoom = req.params.id;
  
  roomModel
    .destroy({ where: { id: idRoom } })
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
