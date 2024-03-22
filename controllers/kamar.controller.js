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

exports.findType = async (req, res) => {
  let keyword = req.body.keyword;

  try {
    let roomData = await typeModel.findAll({
      where: {
        [Op.or]: [
          { nama_kamar: { [Op.substring]: keyword } },
          { harga: { [Op.substring]: keyword } },
          { deskripsi: { [Op.substring]: keyword } },
        ],
      },
    });

    return res.status(200).json(roomData);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Member Not Found",
    });
  }
};

exports.addRoom = async (req, res) => {
  try {
    const { nomor_kamar, id_tipe_kamar } = req.body;

    const idType = await roomModel.findOne({
      include : id_tipe_kamar
        })
  } catch (error) {}
};

exports.updateType = async (req, res) => {
  uploadRoomType.single("foto")(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error });
    }

    let idType = req.params.id;
    let roomData = {
      nama_kamar: req.body.nama_kamar,
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
      roomData.foto = req.file.filename;
    }

    typeModel
      .update(roomData, { where: { id: idType } })
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
