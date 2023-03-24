const memberModel = require("../model/member-model");
const { generateUploadURL } = require("../s3.js");

exports.postReadSpecificPhoto = async (req, res) => {
  let data = req.body;
  const email = data.email;
  const result = await memberModel.readSpecificPhoto(email);
  res.send(result);
};

exports.getImgStorage = async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
};

exports.postCreatePhoto = async (req, res) => {
  let data = req.body;
  const email = data.email;
  const image = data.image;
  const result = await memberModel.createPhoto(email, image);
  res.send(result);
};

exports.postDeletePhoto = async (req, res) => {
  let data = req.body;
  const email = data.email;
  const result = await memberModel.deletePhoto(email);
  res.send(result);
};
