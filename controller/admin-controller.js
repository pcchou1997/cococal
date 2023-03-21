const memberModel = require("../model/member-model");
const jwt = require("jsonwebtoken");

exports.getIndexPage = function (req, res) {
  res.render("login");
};

exports.postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let result = await memberModel.readMember(email, password);
    if (result !== []) {
      // JWT + cookie
      const name = result[0].name;
      const token = jwt.sign({ name, email }, "Hello", { expiresIn: "600s" });
      res.cookie("JWT", token, { maxAge: 600000, httpOnly: true });
      res.status(200).json({ ok: true, name: result.name });
    } else {
      res
        .status(400)
        .json({ error: true, message: "帳號或密碼錯誤，請重新輸入。" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "伺服器內部錯誤" });
  }
};

exports.getUser = async (req, res) => {
  const cookie = req.cookies;
  if (cookie.JWT != undefined) {
    try {
      const value = cookie.JWT;
      const token = jwt.verify(value, "Hello");
      res.status(200).json({ ok: true, name: token.name, email: token.email });
    } catch (error) {
      res.status(500).json({ error: true, message: "伺服器內部錯誤" });
    }
  } else {
    res.status(200).json({ ok: false });
  }
};

exports.getSharedCalendarPage = function (req, res) {
  res.render("shared-calendar");
};

exports.getLogout = async (req, res) => {
  res.clearCookie("JWT");
  res.status(200).json({ ok: true });
};
