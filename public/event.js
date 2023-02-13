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

function getEvents() {
  // Edit events
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
      if (startTime.substr(-1) == "a") {
        let time = startTime.substring(0, startTime.length - 1);
        console.log(time);
        if (time.length == 1) {
          time = "0" + time;
          startTime = time + ":00";
        } else if (time.length == 2) {
        } else {
          // 字串>2
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
      } else {
        console.log(startTime);
        let time = startTime.substring(0, startTime.length - 1);
        if (time.length == 1 || time.length == 2) {
          startTime = String(Number(time) + 12) + ":00";
        } else {
          let startTimeSplit = startTime
            .substring(0, startTime.length - 1)
            .split(":");
          console.log(startTimeSplit);
          startTime =
            String(Number(startTimeSplit[0]) + 12) +
            ":" +
            String(startTimeSplit[1]);
        }
      }
      console.log(title, startDate, startTime);
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
  });
}

// get DB events

fetch("/readEvent")
  .then((res) => {
    return res.json();
  })
  .then((jsonResponse) => {
    let events = [];
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

    // create calendar

    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
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
        color: "yellow",
        textColor: "black",
      },
      eventColor: "rgb(246, 225, 225)",
    });
    calendar.render();

    getEvents();

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
        getEvents();
      });
    });
  })
  .catch((err) => {
    // handle error
    console.error(err);
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

// NEW_EVENT button

CREATE_EVENT_BUTTON.addEventListener("click", async function () {
  const title = CREATE_EVENT_EVENTNAME_INPUT.value;
  const startDate = CREATE_EVENT_START_DATE.value;
  const startTime = CREATE_EVENT_START_TIME.value;
  const endDate = CREATE_EVENT_END_DATE.value;
  const endTime = CREATE_EVENT_END_TIME.value;
  const color = CREATEEVENT_CATEGORY_SELECT.value;
  const description = CREATEEVENT_DESCRIPTION_INPUT.value;

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

    window.location.reload();
  }
});

// EDIT_CONTAINER - close container
EDIT_CLOSE.addEventListener("click", function () {
  EDIT_CONTAINER.style.display = "none";
});

// EDIT_CONTAINER - revise event
EDIT_REVISE.addEventListener("click", function () {
  EDIT_CONTAINER.style.display = "none";
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
    CREATE_EVENT_CONTAINER.style.display = "none";
    fetch("/updateEvent", {
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
    window.location.reload();
  }
});

// EDIT_CONTAINER - delete event
EDIT_DELETE.addEventListener("click", function () {
  EDIT_CONTAINER.style.display = "none";
  fetch("/deleteEvent", {
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
  window.location.reload();
});
