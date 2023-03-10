const memberModel = require("../model/member-model");
const { generateUploadURL } = require("../s3.js");

exports.postInsertMember = async (req, res) => {
  let data = req.body;
  const name = data.name;
  const email = data.email;
  const password = data.password;
  const result = await memberModel.insertMember(name, email, password);
  res.send(result);
};

exports.postReadMember = async (req, res) => {
  let data = req.body;
  const email = data.email;
  const password = data.password;
  const result = await memberModel.readMember(email, password);
  res.send(result);
};

exports.postUpdateMember = async (req, res) => {
  let data = req.body;
  const name = data.name;
  const userName = data.userName;
  const email = data.email;
  const result = await memberModel.updateMember(name, userName, email);
  res.send(result);
};

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
