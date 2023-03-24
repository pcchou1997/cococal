const adminModel = require("../model/admin-model");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    let result = await adminModel.readUser(email, password);
    if (result !== []) {
      // JWT + cookie
      const name = result[0].name;
      const token = jwt.sign({ name, email }, "Hello", { expiresIn: "600s" });
      res.cookie("JWT", token, { maxAge: 600000, httpOnly: true });
      res.status(200).json({ ok: true, data: result });
    } else {
      res
        .status(400)
        .json({ error: true, message: "Fail to read user information" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (cookie.JWT != undefined) {
      const value = cookie.JWT;
      const token = jwt.verify(value, "Hello");
      const result = { name: token.name, email: token.email };
      res.status(200).json({ ok: true, data: result });
    } else {
      res
        .status(400)
        .json({ error: true, message: "Fail to get user information" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("JWT");
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

exports.insertUser = async (req, res) => {
  let data = req.body;
  const name = data.name;
  const email = data.email;
  const password = data.password;
  const result = await adminModel.insertUser(name, email, password);
  res.send(result);
};

exports.readUser = async (req, res) => {
  let data = req.body;
  const email = data.email;
  const password = data.password;
  const result = await adminModel.readUser(email, password);
  res.send(result);
};

exports.updateUser = async (req, res) => {
  let data = req.body;
  const name = data.name;
  const userName = data.userName;
  const email = data.email;
  const result = await adminModel.updateUser(name, userName, email);
  res.send(result);
};
