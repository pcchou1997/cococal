const eventModel = require("../model/event-model");

exports.postInsertEvent = async function (req, res) {
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

exports.getReadEvent = async (req, res) => {
  const result = await eventModel.readEvent();
  res.json(result);
};

exports.postReadSpecificEvent = async (req, res) => {
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

exports.postReadEventsOfSpecificCategory = async (req, res) => {
  let data = req.body;
  const oldColor = data.oldColor;
  const result = await eventModel.readEventsOfSpecificCategory(oldColor);
  res.send(result);
};

exports.postUpdateEvent = async (req, res) => {
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

exports.postUpdateEventCategory = async (req, res) => {
  let data = req.body;
  const oldColor = data.oldColor;
  const color = data.color;
  const className = data.className;
  const oldClassName = data.oldClassName;
  const result = await eventModel.updateEventCategory(
    color,
    className,
    oldColor,
    oldClassName
  );
  res.send(result);
};

exports.postDeleteEvent = async (req, res) => {
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

exports.postSearchEvent = async (req, res) => {
  let data = req.body;
  const keyword = data.keyword;
  const result = await eventModel.searchEvent(keyword);
  res.send(result);
};
