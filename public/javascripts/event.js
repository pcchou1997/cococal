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
const CREATE_EVENT_WRONG_MESSAGE = document.querySelector(
  ".createEvent-wrongMessage"
);
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
const EDIT_WRONG_MESSAGE = document.querySelector(".edit-wrongMessage");
const EDIT_CATEGORY_SELECT = document.querySelector(".edit-category-select");
const EDIT_DESCRIPTION_INPUT = document.querySelector(
  ".edit-description-input"
);
const CATEGORY_CONTAINER = document.querySelector(".category-container");
const CREATE_EVENT_CATEGORY_SELECT = document.querySelector(
  ".createEvent-category-select"
);
const CREATE_EVENT_DESCRIPTION_INPUT = document.querySelector(
  ".createEvent-description-input"
);
const OVERLAY = document.querySelector(".overlay");
const ACCOUNT_NAME = document.querySelector(".account-name");
const ACCOUNT_EMAIL = document.querySelector(".account-email");
const ACCOUNT_PHOTO = document.querySelector(".account-photo");
const ACCOUNT_NO_PHOTO = document.querySelector(".account-no-photo");
const USER_PHOTO_CONTAINER = document.querySelector(".user-photo-container");
const USER_PHOTO = document.querySelector(".user-photo");
const USER_NO_PHOTO = document.querySelector(".user-no-photo");

let userName;
let userEmail;

window.addEventListener("DOMContentLoaded", async () => {
  // read user name & email
  await fetch("/api/user/auth", { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .then((userData) => {
      if (userData["ok"]) {
        userName = userData.data.name;
        userEmail = userData.data.email;
        ACCOUNT_NAME.innerHTML = userName;
        ACCOUNT_EMAIL.innerHTML = userEmail;
      } else {
        location.href = "/";
      }
    })
    .catch((error) => {
      location.href = "/";
    });

  // read user photo
  await fetch("/api/photo/" + userEmail)
    .then((res) => {
      return res.json();
    })
    .then((photoData) => {
      if (photoData.length != 0) {
        let photo =
          "http://d1v357yavrduf9.cloudfront.net/" + photoData[0].image;
        ACCOUNT_PHOTO.style.backgroundImage = `url(${photo})`;
        ACCOUNT_PHOTO.style.display = "block";
        ACCOUNT_NO_PHOTO.style.display = "none";
        USER_PHOTO.style.backgroundImage = `url(${photo})`;
        USER_PHOTO.style.display = "block";
        USER_NO_PHOTO.style.display = "none";
      } else {
        USER_PHOTO.style.display = "none";
        USER_NO_PHOTO.style.display = "block";
        ACCOUNT_PHOTO.style.display = "none";
        ACCOUNT_NO_PHOTO.style.display = "block";
      }
    })
    .catch((err) => {
      // handle error
      console.error(err);
    });
});

let oldTitle;
let oldStartDate;
let oldStartTime;
let events = [];
let calendar;

function createCalendar(events) {
  let calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    initialDate: new Date(),
    // editable: true,
    selectable: true,
    navLinks: true,
    headerToolbar: {
      left: "prev",
      // left: "prev,next, today",
      center: "title",
      right: "next",
      // right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
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
      OVERLAY.style.display = "block";
      EDIT_EVENTNAME_INPUT.value = title;
      oldTitle = title;
      oldStartDate = startDate;
      oldStartTime = startTime;

      await fetch("/api/readSpecificEvent", {
        method: "POST",
        headers: { "Content-type": "application/json" },
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

// get DB events

fetch("/api/event")
  .then((res) => {
    return res.json();
  })
  .then((jsonResponse) => {
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
      let className = jsonResponse[i].className;

      eventDict["id"] = id;
      eventDict["title"] = title;
      eventDict["start"] = startDate + "T" + startTime + ":00";
      eventDict["end"] = endDate + "T" + endTime + ":00";
      eventDict["allDay"] = allDay;
      eventDict["color"] = color;
      eventDict["description"] = description;
      eventDict["className"] = className;
      events.push(eventDict);
    }

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
      // TODAY_BUTTON,
      // dayGridMonth_BUTTON,
      // timeGridWeek_BUTTON,
      // timeGridDay_BUTTON,
      // listMonth_BUTTON,
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
  CREATE_EVENT_WRONG_MESSAGE.style.display = "none";
  const title = CREATE_EVENT_EVENTNAME_INPUT.value;
  const startDate = CREATE_EVENT_START_DATE.value;
  const startTime = CREATE_EVENT_START_TIME.value;
  const endDate = CREATE_EVENT_END_DATE.value;
  const endTime = CREATE_EVENT_END_TIME.value;
  const color = CREATE_EVENT_CATEGORY_SELECT.value;
  const description = CREATE_EVENT_DESCRIPTION_INPUT.value;
  let className =
    CREATE_EVENT_CATEGORY_SELECT.options[
      CREATE_EVENT_CATEGORY_SELECT.selectedIndex
    ].text;
  let id;
  const newStartDate = new Date(startDate + "T" + startTime + ":00");
  const newEndDate = new Date(endDate + "T" + endTime + ":00");

  if (
    title == "" ||
    startDate == "" ||
    startTime == "" ||
    endDate == "" ||
    endTime == "" ||
    color == ""
  ) {
    CREATE_EVENT_WRONG_MESSAGE.style.display = "block";
    CREATE_EVENT_WRONG_MESSAGE.innerHTML = "Please fill the blanks";
  } else if (newStartDate > newEndDate) {
    CREATE_EVENT_WRONG_MESSAGE.style.display = "block";
    CREATE_EVENT_WRONG_MESSAGE.innerHTML =
      '"Start date" must be before than "End date"';
  } else if (className == "-- options --") {
    CREATE_EVENT_WRONG_MESSAGE.style.display = "block";
    CREATE_EVENT_WRONG_MESSAGE.innerHTML = "Please select a category";
  } else {
    CREATE_EVENT_CONTAINER.style.display = "none";
    OVERLAY.style.display = "none";
    await fetch("/api/event", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        title: title,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        allDay: false,
        color: color,
        className: className,
        description: description,
      }),
    });

    await fetch("/api/readSpecificEvent", {
      method: "POST",
      headers: { "Content-type": "application/json" },
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
      className: className,
      description: description,
    };

    // socket: client 傳送到 server
    socket.emit("insert-event", message);
  }
});

// CREATE_EVENT_CONTAINER - init

function initCreateEventDateTime() {
  let today = new Date();
  let today_year = today.getFullYear();
  let today_month = today.getMonth() + 1;
  let today_day = today.getDate();
  let today_hour = today.getHours();
  let today_minute = today.getMinutes();

  if (String(today_month).length < 2) {
    if (String(today_day).length < 2) {
      CREATE_EVENT_START_DATE.value =
        today_year + "-0" + today_month + "-0" + today_day;
      CREATE_EVENT_END_DATE.value =
        today_year + "-0" + today_month + "-0" + today_day;
    } else {
      CREATE_EVENT_START_DATE.value =
        today_year + "-0" + today_month + "-" + today_day;
      CREATE_EVENT_END_DATE.value =
        today_year + "-0" + today_month + "-" + today_day;
    }
  } else {
    if (String(today_day).length < 2) {
      CREATE_EVENT_START_DATE.value =
        today_year + "-" + today_month + "-0" + today_day;
      CREATE_EVENT_END_DATE.value =
        today_year + "-" + today_month + "-0" + today_day;
    } else {
      CREATE_EVENT_START_DATE.value =
        today_year + "-" + today_month + "-" + today_day;
      CREATE_EVENT_END_DATE.value =
        today_year + "-" + today_month + "-" + today_day;
    }
  }

  // hour: 0~9
  if (String(today_hour).length < 2) {
    // next hour: 0~9
    if (String(today_hour + 1).length < 2) {
      CREATE_EVENT_START_TIME.value = "0" + String(today_hour) + ":00";
      CREATE_EVENT_END_TIME.value = "0" + String(today_hour + 1) + ":00";
    }
    // next hour: 10
    else {
      CREATE_EVENT_START_TIME.value = "0" + String(today_hour) + ":00";
      CREATE_EVENT_END_TIME.value = String(today_hour + 1) + ":00";
    }
  }

  // hour: 10~23
  else {
    // next hour: 0
    if (String(today_hour + 1).length < 2) {
      CREATE_EVENT_START_TIME.value = String(today_hour) + ":00";
      CREATE_EVENT_END_TIME.value = "0" + String(today_hour + 1) + ":00";
    }
    // next hour: 10~23
    else {
      CREATE_EVENT_START_TIME.value = String(today_hour) + ":00";
      CREATE_EVENT_END_TIME.value = String(today_hour + 1) + ":00";
    }
  }
}

// ADD_EVENT button

ADD_EVENT.addEventListener("click", function () {
  initCreateEventDateTime();
  CREATE_EVENT_EVENTNAME_INPUT.value = "";
  CREATE_EVENT_CATEGORY_SELECT.value = "";
  CREATE_EVENT_DESCRIPTION_INPUT.value = "";
  CREATE_EVENT_VERTICAL.style.backgroundColor = "rgb(200, 200, 200)";
  CREATE_EVENT_CONTAINER.style.display = "block";
  OVERLAY.style.display = "block";
  // CREATE_EVENT_CONTAINER.style.display == "none" ? "block" : "none";
});

// CREATE_EVENT_CLOSE - close container

CREATE_EVENT_CLOSE.addEventListener("click", function () {
  CREATE_EVENT_CONTAINER.style.display = "none";
  CREATE_EVENT_WRONG_MESSAGE.style.display = "none";
  OVERLAY.style.display = "none";
});

// EDIT_CONTAINER - close container
EDIT_CLOSE.addEventListener("click", function () {
  EDIT_CONTAINER.style.display = "none";
  EDIT_WRONG_MESSAGE.style.display = "none";
  OVERLAY.style.display = "none";
});

// edit event

EDIT_REVISE.addEventListener("click", async function () {
  EDIT_WRONG_MESSAGE.style.display = "none";
  let id;
  const title = EDIT_EVENTNAME_INPUT.value;
  const startDate = EDIT_STARTDATE.value;
  const startTime = EDIT_STARTTIME.value;
  const endDate = EDIT_ENDDATE.value;
  const endTime = EDIT_ENDTIME.value;
  const allDay = false;
  const color = EDIT_VERTICAL.style.backgroundColor;
  const description = EDIT_DESCRIPTION_INPUT.value;
  const className =
    EDIT_CATEGORY_SELECT.options[EDIT_CATEGORY_SELECT.selectedIndex].text;
  const newStartDate = new Date(startDate + "T" + startTime + ":00");
  const newEndDate = new Date(endDate + "T" + endTime + ":00");

  if (
    title == "" ||
    startDate == "" ||
    startTime == "" ||
    endDate == "" ||
    endTime == "" ||
    color == "" ||
    oldTitle == "" ||
    oldStartDate == "" ||
    oldStartTime == ""
  ) {
    EDIT_WRONG_MESSAGE.style.display = "block";
    EDIT_WRONG_MESSAGE.innerHTML = "Please fill the blanks";
  } else if (newStartDate > newEndDate) {
    EDIT_WRONG_MESSAGE.style.display = "block";
    EDIT_WRONG_MESSAGE.innerHTML =
      '"Start date" must be before than "End date"';
  } else if (className == "-- options --") {
    CREATE_EVENT_WRONG_MESSAGE.style.display = "block";
    CREATE_EVENT_WRONG_MESSAGE.innerHTML = "Please select a category";
  } else {
    EDIT_CONTAINER.style.display = "none";
    OVERLAY.style.display = "none";
    // socket.io

    // 進入資料庫得到事件id

    await fetch("/api/readSpecificEvent", {
      method: "POST",
      headers: { "Content-type": "application/json" },
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
      className: className,
      description: description,
    };

    // socket: client 傳送到 server
    socket.emit("edit-event", message);

    CREATE_EVENT_CONTAINER.style.display = "none";
    OVERLAY.style.display = "none";

    await fetch("/api/event", {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        title: title,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        allDay: allDay,
        color: color,
        className: className,
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
  let confirmResponse = window.confirm("Are you sure you want to delete it?");
  if (confirmResponse == true) {
    EDIT_CONTAINER.style.display = "none";
    OVERLAY.style.display = "none";
    let id;
    let title;
    let startDate;
    let startTime;
    let endDate;
    let endTime;
    let allDay;
    let color;
    let description;
    let className;

    // 進入資料庫得到欲刪除事件
    await fetch("/api/readSpecificEvent", {
      method: "POST",
      headers: { "Content-type": "application/json" },
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
        className = jsonResponse[0].className;
        description = jsonResponse[0].description;
      });

    // socket.io

    // client 傳送到 server
    let message = {
      id: id,
      title: title,
      start: startDate + "T" + startTime + ":00",
      end: endDate + "T" + endTime + ":00",
      allDay: allDay,
      color: color,
      className: className,
      description: description,
    };

    // socket: client 傳送到 server
    socket.emit("delete-event", message);

    // 從資料庫刪除該事件
    await fetch("/api/event", {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        oldTitle: oldTitle,
        oldStartDate: oldStartDate,
        oldStartTime: oldStartTime,
      }),
    });
  } else {
  }
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
  let className = msg.className;
  let description = msg.description;
  eventDict["id"] = id;
  eventDict["title"] = title;
  eventDict["start"] = startDate + "T" + startTime + ":00";
  eventDict["end"] = endDate + "T" + endTime + ":00";
  eventDict["allDay"] = allDay;
  eventDict["color"] = color;
  eventDict["className"] = className;
  eventDict["description"] = description;
  events.push(eventDict);

  let addthisevent = {
    id: id,
    title: title,
    start: startDate + "T" + startTime + ":00",
    end: endDate + "T" + endTime + ":00",
    color: color,
    className: className,
    description: description,
  };
  calendar.addEvent(addthisevent);
  editCalendarEvents();

  // check the toggle mode
  const CATEGORYLIST_ITEM = document.querySelectorAll(".categoryList-item");
  Array.from(CATEGORYLIST_ITEM).forEach((node) => {
    if (
      node.childNodes[0].childNodes[1].innerHTML == className &&
      node.childNodes[1].childNodes[0].style.display == "block"
    ) {
      let calendarEventId = calendar.getEventById(id);
      calendarEventId.setProp("display", "none");
      editCalendarEvents();
    } else {
    }
  });
});

// edit event
socket.on("edit-event", async function (msg) {
  let calendarEventId = calendar.getEventById(msg.id);
  calendarEventId.setStart(msg.startDate + "T" + msg.startTime + ":00");
  calendarEventId.setEnd(msg.endDate + "T" + msg.endTime + ":00");
  calendarEventId.setProp("color", msg.color);
  calendarEventId.setProp("title", msg.title);
  calendarEventId.setExtendedProp("className", msg.className);
  calendarEventId.setExtendedProp("description", msg.description);
  editCalendarEvents();

  // check the toggle mode
  const CATEGORYLIST_ITEM = document.querySelectorAll(".categoryList-item");
  Array.from(CATEGORYLIST_ITEM).forEach((node) => {
    if (
      node.childNodes[0].childNodes[1].innerHTML == msg.className &&
      node.childNodes[1].childNodes[0].style.display == "block"
    ) {
      let calendarEventId = calendar.getEventById(msg.id);
      calendarEventId.setProp("display", "none");
      editCalendarEvents();
    } else {
    }
  });
});

// delete event
socket.on("delete-event", async function (msg) {
  let index = events.indexOf(msg);
  if (index !== -1) {
    events.splice(index, 1);
  }
  let calendarEventId = calendar.getEventById(msg.id);
  calendarEventId.remove();
});
