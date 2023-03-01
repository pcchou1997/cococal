const ADD_EVENT = document.querySelector(".addEvent");
const CREATE_EVENT_CONTAINER = document.querySelector(".createEvent-container");
const CREATE_EVENT_EVENTNAME_INPUT = document.querySelector(
  ".createEvent-eventName-input"
);
const CREATE_EVENT_START_DATE = document.querySelector(
  ".createEvent-startDate"
);
const CREATE_EVENT_START_TIME = document.querySelector(
  ".createEvent-startTime"
);
const CREATE_EVENT_END_DATE = document.querySelector(".createEvent-endDate");
const CREATE_EVENT_END_TIME = document.querySelector(".createEvent-endTime");
const CREATE_EVENT_VERTICAL = document.querySelector(".createEvent-vertical");
const CREATE_EVENT_BUTTON = document.querySelector(".createEvent-button");
const CREATE_EVENT_CLOSE = document.querySelector(
  ".createEvent-container .fa-xmark"
);
const EDIT_CONTAINER = document.querySelector(".edit-container");
const EDIT_EVENTNAME_INPUT = document.querySelector(".edit-eventName-input");
const EDIT_CLOSE = document.querySelector(".edit-container .fa-xmark");
const EDIT_STARTDATE = document.querySelector(".edit-startDate");
const EDIT_STARTTIME = document.querySelector(".edit-startTime");
const EDIT_ENDDATE = document.querySelector(".edit-endDate");
const EDIT_ENDTIME = document.querySelector(".edit-endTime");
const EDIT_VERTICAL = document.querySelector(".edit-vertical");
const EDIT_REVISE = document.querySelector(".edit-revise");
const EDIT_DELETE = document.querySelector(".edit-delete");
const EDIT_CATEGORY_SELECT = document.querySelector(".edit-category-select");
const EDIT_DESCRIPTION_INPUT = document.querySelector(
  ".edit-description-input"
);
const CATEGORY_CONTAINER = document.querySelector(".category-container");
const CREATEEVENT_CATEGORY_SELECT = document.querySelector(
  ".createEvent-category-select"
);
const CREATEEVENT_DESCRIPTION_INPUT = document.querySelector(
  ".createEvent-description-input"
);
let oldTitle;
let oldStartDate;
let oldStartTime;
let events = [];
let calendar;

let socket = io();

function createCalendar(events) {
  let calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    initialDate: new Date(),
    // editable: true,
    selectable: true,
    navLinks: true,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    events: {
      events,
    },
    eventColor: "rgb(246, 225, 225)",
  });
  calendar.render();
  calendar.getEvents();
}

function editCalendarEvents() {
  const EVENT = document.querySelectorAll(".fc-event");
  Array.from(EVENT).forEach((el) => {
    el.addEventListener("click", async function () {
      let startTime;
      let title;
      let startDate;
      let endTime;
      let endDate;
      let color;

      // two types of events

      try {
        startTime = this.firstChild.firstChild.firstChild.innerHTML;
        title = this.firstChild.firstChild.lastChild.firstChild.innerHTML;
      } catch (e) {
        startTime = this.childNodes[1].innerHTML;
        title = this.childNodes[2].innerHTML;
      }
      startDate =
        this.parentNode.parentNode.parentNode.parentNode.getAttribute(
          "data-date"
        );

      // time (a)
      if (startTime.substr(-1) == "a") {
        let time = startTime.substring(0, startTime.length - 1);
        console.log(time);
        // only hour
        if (time == 12) {
          startTime = "00:00";
        } else if (time.length == 1) {
          time = "0" + time;
          startTime = time + ":00";
        } else if (time.length == 2) {
          startTime = time + ":00";
        }
        // hour:minute
        else {
          console.log(time.split(":")[0]);
          if (time.split(":")[0].length == 1) {
            startTime = "0" + time;
          } else {
            if (time.split(":")[0] == "12") {
              startTime = "00:" + time.split(":")[1];
            } else {
              startTime = time;
            }
          }
        }
      }
      // time (p)
      else {
        let time = startTime.substring(0, startTime.length - 1);
        // only hour
        if (time == 12) {
          startTime = "12:00";
        } else if (time.length == 1 || time.length == 2) {
          startTime = String(Number(time) + 12) + ":00";
        }
        // hour:minute
        else {
          let startTimeSplit = startTime
            .substring(0, startTime.length - 1)
            .split(":");
          console.log(startTimeSplit);
          if (startTimeSplit[0] == "12") {
            startTime = "12:" + String(startTimeSplit[1]);
          } else {
            startTime =
              String(Number(startTimeSplit[0]) + 12) +
              ":" +
              String(startTimeSplit[1]);
          }
        }
      }

      CATEGORY_CONTAINER.style.display = "none";
      EDIT_CONTAINER.style.display = "block";
      EDIT_EVENTNAME_INPUT.value = title;
      oldTitle = title;
      oldStartDate = startDate;
      oldStartTime = startTime;

      await fetch("/readSpecificEvent", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          startDate: startDate,
          startTime: startTime,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((jsonResponse) => {
          console.log(jsonResponse);
          endTime = jsonResponse[0].endTime;
          endDate = jsonResponse[0].endDate;
          color = jsonResponse[0].color;
          description = jsonResponse[0].description;
        });
      EDIT_STARTDATE.value = startDate;
      EDIT_STARTTIME.value = startTime;
      EDIT_ENDDATE.value = endDate;
      EDIT_ENDTIME.value = endTime;
      EDIT_VERTICAL.style.backgroundColor = color;
      EDIT_CATEGORY_SELECT.value = color;
      EDIT_DESCRIPTION_INPUT.value = description;
    });
  }, true);
}

function reloadEvents() {
  fetch("/readEvent")
    .then((res) => {
      return res.json();
    })
    .then(function (jsonResponse) {
      events = [];
      for (let i = 0; i < jsonResponse.length; i++) {
        let eventDict = {};
        let title = jsonResponse[i].title;
        let startDate = jsonResponse[i].startDate;
        let startTime = jsonResponse[i].startTime;
        let endDate = jsonResponse[i].endDate;
        let endTime = jsonResponse[i].endTime;
        let allDay = jsonResponse[i].allDay;
        let color = jsonResponse[i].color;
        let description = jsonResponse[i].description;

        eventDict["title"] = title;
        eventDict["start"] = startDate + "T" + startTime + ":00";
        eventDict["end"] = endDate + "T" + endTime + ":00";
        eventDict["allDay"] = allDay;
        eventDict["color"] = color;
        eventDict["description"] = description;
        events.push(eventDict);
      }
    })
    .then(function () {
      CREATE_EVENT_CONTAINER.removeChild(CREATE_EVENT_CONTAINER.firstChild);
      createCalendar(events);
    });
}

// get DB events

fetch("/readEvent")
  .then((res) => {
    return res.json();
  })
  .then((jsonResponse) => {
    console.log(jsonResponse);
    for (let i = 0; i < jsonResponse.length; i++) {
      let eventDict = {};
      let id = jsonResponse[i].id;
      let title = jsonResponse[i].title;
      let startDate = jsonResponse[i].startDate;
      let startTime = jsonResponse[i].startTime;
      let endDate = jsonResponse[i].endDate;
      let endTime = jsonResponse[i].endTime;
      let allDay = jsonResponse[i].allDay;
      let color = jsonResponse[i].color;
      let description = jsonResponse[i].description;

      eventDict["id"] = id;
      eventDict["title"] = title;
      eventDict["start"] = startDate + "T" + startTime + ":00";
      eventDict["end"] = endDate + "T" + endTime + ":00";
      eventDict["allDay"] = allDay;
      eventDict["color"] = color;
      eventDict["description"] = description;
      events.push(eventDict);
    }
    console.log(events);

    // create calendar

    createCalendar(events);
    editCalendarEvents();

    const PREV_BUTTON = document.querySelector(".fc-prev-button");
    const NEXT_BUTTON = document.querySelector(".fc-next-button");
    const TODAY_BUTTON = document.querySelector(".fc-today-button");
    const dayGridMonth_BUTTON = document.querySelector(
      ".fc-dayGridMonth-button"
    );
    const timeGridWeek_BUTTON = document.querySelector(
      ".fc-timeGridWeek-button"
    );
    const timeGridDay_BUTTON = document.querySelector(".fc-timeGridDay-button");
    const listMonth_BUTTON = document.querySelector(".fc-listMonth-button");
    let buttonList = [
      PREV_BUTTON,
      NEXT_BUTTON,
      TODAY_BUTTON,
      dayGridMonth_BUTTON,
      timeGridWeek_BUTTON,
      timeGridDay_BUTTON,
      listMonth_BUTTON,
    ];
    buttonList.forEach((el) => {
      el.addEventListener("click", function () {
        editCalendarEvents();
      });
    });
  })
  .catch((err) => {
    // handle error
    console.error(err);
  });

// add event

CREATE_EVENT_BUTTON.addEventListener("click", async function () {
  const title = CREATE_EVENT_EVENTNAME_INPUT.value;
  const startDate = CREATE_EVENT_START_DATE.value;
  const startTime = CREATE_EVENT_START_TIME.value;
  const endDate = CREATE_EVENT_END_DATE.value;
  const endTime = CREATE_EVENT_END_TIME.value;
  const color = CREATEEVENT_CATEGORY_SELECT.value;
  const description = CREATEEVENT_DESCRIPTION_INPUT.value;
  let id;

  if (
    title == "" ||
    startDate == "" ||
    startTime == "" ||
    endDate == "" ||
    endTime == "" ||
    color == ""
  ) {
    alert("任一欄位不可空白");
  } else {
    CREATE_EVENT_CONTAINER.style.display = "none";
    await fetch("/insertEvent", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        allDay: false,
        color: color,
        description: description,
      }),
    });

    await fetch("/readSpecificEvent", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        startDate: startDate,
        startTime: startTime,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
        id = jsonResponse[0].id;
      });

    // socket.io
    let message = {
      id: id,
      title: title,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      allDay: false,
      color: color,
      description: description,
    };

    // socket: client 傳送到 server
    socket.emit("insert-event", message);
  }
});

// CREATE_EVENT_CONTAINER - init
let today = new Date();
let today_year = today.getFullYear();
let today_month = today.getMonth() + 1;
let today_day = today.getDate();
let today_hour = today.getHours();
let today_minute = today.getMinutes();

if (String(today_month).length < 2) {
  CREATE_EVENT_START_DATE.value =
    today_year + "-0" + today_month + "-" + today_day;
  CREATE_EVENT_END_DATE.value =
    today_year + "-0" + today_month + "-" + today_day;
} else {
  CREATE_EVENT_START_DATE.value =
    today_year + "-" + today_month + "-" + today_day;
  CREATE_EVENT_END_DATE.value =
    today_year + "-" + today_month + "-" + today_day;
}

if (String(today_hour).length < 2) {
  CREATE_EVENT_START_TIME.value = "0" + String(today_hour) + ":00";
  CREATE_EVENT_END_TIME.value = "0" + String(today_hour) + ":00";
} else {
  CREATE_EVENT_START_TIME.value = String(today_hour) + ":00";
  CREATE_EVENT_END_TIME.value = String(today_hour) + ":00";
}

// ADD_EVENT button

ADD_EVENT.addEventListener("click", function () {
  CREATE_EVENT_CONTAINER.style.display = "block";
  // CREATE_EVENT_CONTAINER.style.display == "none" ? "block" : "none";
});

// CREATE_EVENT_CLOSE - close container

CREATE_EVENT_CLOSE.addEventListener("click", function () {
  CREATE_EVENT_CONTAINER.style.display = "none";
});

// EDIT_CONTAINER - close container
EDIT_CLOSE.addEventListener("click", function () {
  EDIT_CONTAINER.style.display = "none";
});

// edit event

EDIT_REVISE.addEventListener("click", async function () {
  EDIT_CONTAINER.style.display = "none";
  let id;
  const title = EDIT_EVENTNAME_INPUT.value;
  const startDate = EDIT_STARTDATE.value;
  const startTime = EDIT_STARTTIME.value;
  const endDate = EDIT_ENDDATE.value;
  const endTime = EDIT_ENDTIME.value;
  const allDay = false;
  const color = EDIT_VERTICAL.style.backgroundColor;
  const description = EDIT_DESCRIPTION_INPUT.value;
  // console.log(EDIT_VERTICAL.style.backgroundColor);
  if (
    title == "" ||
    startDate == "" ||
    startTime == "" ||
    endDate == "" ||
    endTime == "" ||
    oldTitle == "" ||
    oldStartDate == "" ||
    oldStartTime == ""
  ) {
    alert("任一欄位不可空白");
  } else {
    // socket.io

    // 進入資料庫得到事件id

    await fetch("/readSpecificEvent", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: oldTitle,
        startDate: oldStartDate,
        startTime: oldStartTime,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
        id = jsonResponse[0].id;
      });

    // client 傳送到 server
    let message = {
      id: id,
      title: title,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      allDay: false,
      color: color,
      description: description,
    };

    // socket: client 傳送到 server
    socket.emit("edit-event", message);

    CREATE_EVENT_CONTAINER.style.display = "none";
    await fetch("/updateEvent", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        allDay: allDay,
        color: color,
        description: description,
        oldTitle: oldTitle,
        oldStartDate: oldStartDate,
        oldStartTime: oldStartTime,
      }),
    });
  }
});

// delete event
EDIT_DELETE.addEventListener("click", async function () {
  EDIT_CONTAINER.style.display = "none";
  let id;
  let title;
  let startDate;
  let startTime;
  let endDate;
  let endTime;
  let allDay;
  let color;
  let description;

  // socket.io
  // 進入資料庫得到欲刪除事件
  await fetch("/readSpecificEvent", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title: oldTitle,
      startDate: oldStartDate,
      startTime: oldStartTime,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((jsonResponse) => {
      id = jsonResponse[0].id;
      title = jsonResponse[0].title;
      startDate = jsonResponse[0].startDate;
      startTime = jsonResponse[0].startTime;
      endDate = jsonResponse[0].endDate;
      endTime = jsonResponse[0].endTime;
      allDay = jsonResponse[0].allDay;
      color = jsonResponse[0].color;
      description = jsonResponse[0].description;
    });

  // client 傳送到 server
  let message = {
    id: id,
    title: title,
    start: startDate + "T" + startTime + ":00",
    end: endDate + "T" + endTime + ":00",
    allDay: allDay,
    color: color,
    description: description,
  };

  // socket: client 傳送到 server
  socket.emit("delete-event", message);

  // 從資料庫刪除該事件
  await fetch("/deleteEvent", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      oldTitle: oldTitle,
      oldStartDate: oldStartDate,
      oldStartTime: oldStartTime,
    }),
  });
});

// socket.io

// socket: client 捕捉 server 傳來的資料，並進行後續處理
// add event
socket.on("insert-event", async function (msg) {
  let id = msg.id;
  let eventDict = {};
  let title = msg.title;
  let startDate = msg.startDate;
  let startTime = msg.startTime;
  let endDate = msg.endDate;
  let endTime = msg.endTime;
  let allDay = msg.allDay;
  let color = msg.color;
  let description = msg.description;
  eventDict["id"] = id;
  eventDict["title"] = title;
  eventDict["start"] = startDate + "T" + startTime + ":00";
  eventDict["end"] = endDate + "T" + endTime + ":00";
  eventDict["allDay"] = allDay;
  eventDict["color"] = color;
  eventDict["description"] = description;
  events.push(eventDict);
  console.log(events);

  let addthisevent = {
    id: id,
    title: title,
    start: startDate + "T" + startTime + ":00",
    end: endDate + "T" + endTime + ":00",
    color: color,
    description: description,
  };
  console.log(addthisevent);
  calendar.addEvent(addthisevent);
  editCalendarEvents();
});

// edit event
socket.on("edit-event", async function (msg) {
  let calendarEventId = calendar.getEventById(msg.id);
  console.log(calendarEventId);
  calendarEventId.setStart(msg.startDate + "T" + msg.startTime + ":00");
  calendarEventId.setEnd(msg.endDate + "T" + msg.endTime + ":00");
  calendarEventId.setProp("color", msg.color);
  calendarEventId.setProp("title", msg.title);
  calendarEventId.setExtendedProp("description", msg.description);
  editCalendarEvents();
});

// delete event
socket.on("delete-event", async function (msg) {
  console.log(msg);
  console.log(msg.id);
  let index = events.indexOf(msg);
  if (index !== -1) {
    events.splice(index, 1);
  }
  let calendarEventId = calendar.getEventById(msg.id);
  console.log(calendarEventId);
  calendarEventId.remove();
});
