const photoModel = require("../model/photo-model");
const { generateUploadURL } = require("../s3.js");

exports.readPhoto = async (req, res) => {
  const { email } = req.params;
  const result = await photoModel.readPhoto(email);
  res.send(result);
};

exports.insertPhoto = async (req, res) => {
  let data = req.body;
  const email = data.email;
  const image = data.image;
  const result = await photoModel.insertPhoto(email, image);
  res.send(result);
};

exports.deletePhoto = async (req, res) => {
  let data = req.body;
  const email = data.email;
  const result = await photoModel.deletePhoto(email);
  res.send(result);
};

exports.getSecurePhotoURL = async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
};
