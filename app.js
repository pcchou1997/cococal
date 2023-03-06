const {
  insertEvent,
  readEvent,
  readSpecificEvent,
  readEventsOfSpecificCategory,
  updateEvent,
  updateEventCategory,
  deleteEvent,
  insertCategory,
  readCategory,
  readSpecificCategory,
  updateCategory,
  deleteCategory,
  searchEvent,
  insertMember,
  readMember,
  updateMember,
  readSpecificPhoto,
  createPhoto,
  deletePhoto,
} = require("./public/database");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const io = require("socket.io")(server);
// const { Server } = require("socket.io");
// const io = new Server(server);
const { generateUploadURL } = require("./s3.js");

// socket.io 連線
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // socket: server 傳送給所有 client
  socket.on("insert-event", (msg) => {
    io.emit("insert-event", msg);
  });

  socket.on("edit-event", (msg) => {
    io.emit("edit-event", msg);
  });

  socket.on("delete-event", (msg) => {
    io.emit("delete-event", msg);
  });

  socket.on("insert-category", (msg) => {
    io.emit("insert-category", msg);
  });

  socket.on("edit-category", (msg) => {
    io.emit("edit-category", msg);
  });

  socket.on("delete-category", (msg) => {
    io.emit("delete-category", msg);
  });
});

app.use(express.static("public"));
app.use(cookieParser());

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/member", function (req, res) {
  res.render("member");
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let result = await readMember(email, password);
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
});

app.get("/user", async (req, res) => {
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
});

app.post("/insertEvent", async function (req, res) {
  let data = req.body;
  const title = data.title;
  const startDate = data.startDate;
  const startTime = data.startTime;
  const endDate = data.endDate;
  const endTime = data.endTime;
  const allDay = data.allDay;
  const color = data.color;
  const className = data.className;
  const description = data.description;
  const result = await insertEvent(
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    allDay,
    color,
    className,
    description
  );
  res.send(result);
});

app.get("/readEvent", async (req, res) => {
  const result = await readEvent();
  res.json(result);
});

app.post("/readSpecificEvent", async (req, res) => {
  let data = req.body;
  const title = data.title;
  const startDate = data.startDate;
  const startTime = data.startTime;
  const result = await readSpecificEvent(title, startDate, startTime);
  res.send(result);
});

app.post("/readEventsOfSpecificCategory", async (req, res) => {
  let data = req.body;
  const oldColor = data.oldColor;
  const result = await readEventsOfSpecificCategory(oldColor);
  res.send(result);
});

app.post("/updateEvent", async (req, res) => {
  let data = req.body;
  const title = data.title;
  const startDate = data.startDate;
  const startTime = data.startTime;
  const endDate = data.endDate;
  const endTime = data.endTime;
  const allDay = data.allDay;
  const color = data.color;
  const className = data.className;
  const description = data.description;
  const oldTitle = data.oldTitle;
  const oldStartDate = data.oldStartDate;
  const oldStartTime = data.oldStartTime;
  const result = await updateEvent(
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    allDay,
    color,
    className,
    description,
    oldTitle,
    oldStartDate,
    oldStartTime
  );
  res.send(result);
});

app.post("/updateEventCategory", async (req, res) => {
  let data = req.body;
  const oldColor = data.oldColor;
  const color = data.color;
  const className = data.className;
  const oldClassName = data.oldClassName;
  const result = await updateEventCategory(
    color,
    className,
    oldColor,
    oldClassName
  );
  res.send(result);
});

app.post("/deleteEvent", async (req, res) => {
  let data = req.body;
  const oldTitle = data.oldTitle;
  const oldStartDate = data.oldStartDate;
  const oldStartTime = data.oldStartTime;
  const result = await deleteEvent(oldTitle, oldStartDate, oldStartTime);
  res.send(result);
});

app.post("/insertCategory", async (req, res) => {
  let data = req.body;
  const categoryName = data.categoryName;
  const color = data.color;
  const result = await insertCategory(categoryName, color);
  res.send(result);
});

app.get("/readCategory", async (req, res) => {
  const result = await readCategory();
  res.json(result);
});

app.post("/readSpecificCategory", async (req, res) => {
  let data = req.body;
  const color = data.color;
  const result = await readSpecificCategory(color);
  res.send(result);
});

app.post("/updateCategory", async (req, res) => {
  let data = req.body;
  const categoryName = data.categoryName;
  const color = data.color;
  const oldCategoryName = data.oldCategoryName;
  const oldColor = data.oldColor;
  const result = await updateCategory(
    categoryName,
    color,
    oldCategoryName,
    oldColor
  );
  res.send(result);
});

app.post("/deleteCategory", async (req, res) => {
  let data = req.body;
  const categoryName = data.categoryName;
  const color = data.color;
  const result = await deleteCategory(categoryName, color);
  res.send(result);
});

app.post("/searchEvent", async (req, res) => {
  let data = req.body;
  const keyword = data.keyword;
  const result = await searchEvent(keyword);
  res.send(result);
});

app.post("/insertMember", async (req, res) => {
  let data = req.body;
  const name = data.name;
  const email = data.email;
  const password = data.password;
  const result = await insertMember(name, email, password);
  res.send(result);
});

app.post("/readMember", async (req, res) => {
  let data = req.body;
  const email = data.email;
  const password = data.password;
  const result = await readMember(email, password);
  res.send(result);
});

app.post("/updateMember", async (req, res) => {
  let data = req.body;
  const name = data.name;
  const userName = data.userName;
  const email = data.email;
  const result = await updateMember(name, userName, email);
  res.send(result);
});

app.get("/logout", async (req, res) => {
  res.clearCookie("JWT");
  res.status(200).json({ ok: true });
});

app.post("/readSpecificPhoto", async (req, res) => {
  let data = req.body;
  const email = data.email;
  const result = await readSpecificPhoto(email);
  res.send(result);
});

app.get("/imgStorage", async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

app.post("/createPhoto", async (req, res) => {
  let data = req.body;
  const email = data.email;
  const image = data.image;
  const result = await createPhoto(email, image);
  res.send(result);
});

app.post("/deletePhoto", async (req, res) => {
  let data = req.body;
  const email = data.email;
  const result = await deletePhoto(email);
  res.send(result);
});

server.listen(3000, () => {
  console.log("伺服器已經啟動在port=3000，網址：http://127.0.0.1:3000/");
});
