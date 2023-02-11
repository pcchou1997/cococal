const http = require("http");
const {
  insertEvent,
  readEvent,
  readSpecificEvent,
  updateEvent,
} = require("./public/database");
const express = require("express");
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hostname = "127.0.0.1";
const port = 3000;

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
  const result = await insertEvent(
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    allDay,
    color
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
  console.log(title, startDate, startTime);
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
  const oldTitle = data.oldTitle;
  const oldStartDate = data.oldStartDate;
  const oldStartTime = data.oldStartTime;
  console.log(
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    allDay,
    color,
    oldTitle,
    oldStartDate,
    oldStartTime
  );
  const result = await updateEvent(
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    allDay,
    color,
    oldTitle,
    oldStartDate,
    oldStartTime
  );
  res.send(result);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
