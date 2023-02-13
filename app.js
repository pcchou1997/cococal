const http = require("http");
const {
  insertEvent,
  readEvent,
  readSpecificEvent,
  updateEvent,
  deleteEvent,
  insertCategory,
  readCategory,
} = require("./public/database");
const express = require("express");
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
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
  const description = data.description;
  const result = await insertEvent(
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    allDay,
    color,
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

app.post("/updateEvent", async (req, res) => {
  let data = req.body;
  const title = data.title;
  const startDate = data.startDate;
  const startTime = data.startTime;
  const endDate = data.endDate;
  const endTime = data.endTime;
  const allDay = data.allDay;
  const color = data.color;
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
    description,
    oldTitle,
    oldStartDate,
    oldStartTime
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

app.listen(3000, function () {
  console.log("伺服器已經啟動在port=3000，網址：http://127.0.0.1:3000/"); // 成功啟動後顯示在終端機的文字
});
