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
} = require("./public/database");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
// const { Server } = require("socket.io");
// const io = new Server(server);

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

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/member", function (req, res) {
  res.render("member");
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

// app.listen(3000, function () {
//   console.log("伺服器已經啟動在port=3000，網址：http://127.0.0.1:3000/"); // 成功啟動後顯示在終端機的文字
// });

server.listen(3000, () => {
  console.log("伺服器已經啟動在port=3000，網址：http://127.0.0.1:3000/");
});
