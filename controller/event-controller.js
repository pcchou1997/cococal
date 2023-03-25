const eventModel = require("../model/event-model");

exports.insertEvent = async function (req, res) {
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
  const result = await eventModel.insertEvent(
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
};

exports.readEvent = async (req, res) => {
  const result = await eventModel.readEvent();
  res.json(result);
};

exports.updateEvent = async (req, res) => {
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
  const result = await eventModel.updateEvent(
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
};

exports.deleteEvent = async (req, res) => {
  let data = req.body;
  const oldTitle = data.oldTitle;
  const oldStartDate = data.oldStartDate;
  const oldStartTime = data.oldStartTime;
  const result = await eventModel.deleteEvent(
    oldTitle,
    oldStartDate,
    oldStartTime
  );
  res.send(result);
};

exports.readEventsOfSpecificCategory = async (req, res) => {
  const oldColor = req.params.categoryColor;
  console.log(oldColor);
  const result = await eventModel.readEventsOfSpecificCategory(oldColor);
  console.log(result);
  res.send(result);
};

exports.updateEventsCategory = async (req, res) => {
  const oldColor = req.params.categoryColor;
  let data = req.body;
  const color = data.color;
  const categoryName = data.categoryName;
  const oldCategoryName = data.oldCategoryName;
  const result = await eventModel.updateEventsCategory(
    color,
    categoryName,
    oldColor,
    oldCategoryName
  );
  res.send(result);
};

exports.readSpecificEvent = async (req, res) => {
  let data = req.body;
  const title = data.title;
  const startDate = data.startDate;
  const startTime = data.startTime;
  const result = await eventModel.readSpecificEvent(
    title,
    startDate,
    startTime
  );
  res.send(result);
};

exports.searchEvent = async (req, res) => {
  const keyword = req.body.keyword;
  const result = await eventModel.searchEvent(keyword);
  res.send(result);
};
