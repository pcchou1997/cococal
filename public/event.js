const ADD_EVENT = document.querySelector(".addEvent");
const NEW_EVENT = document.querySelector(".newEvent");
const NEW_EVENT_TITLE = document.querySelector(".newEvent-title");
const NEW_EVENT_START_DATE = document.querySelector(".newEvent-startDate");
const NEW_EVENT_START_TIME = document.querySelector(".newEvent-startTime");
const NEW_EVENT_END_DATE = document.querySelector(".newEvent-endDate");
const NEW_EVENT_END_TIME = document.querySelector(".newEvent-endTime");
const NEW_EVENT_BUTTON = document.querySelector(".newEvent-button");
const EDIT_CONTAINER = document.querySelector(".edit-container");
const EDIT_EVENTNAME_INPUT = document.querySelector(".edit-eventName-input");
const EDIT_CLOSE = document.querySelector(".fa-xmark");
const EDIT_STARTDATE = document.querySelector(".edit-startDate");
const EDIT_STARTTIME = document.querySelector(".edit-startTime");
const EDIT_ENDDATE = document.querySelector(".edit-endDate");
const EDIT_ENDTIME = document.querySelector(".edit-endTime");
const EDIT_VERTICAL = document.querySelector(".edit-vertical");
const EDIT_REVISE = document.querySelector(".edit-revise");
const EDIT_DELETE = document.querySelector(".edit-delete");
const CATEGORY_CONTAINER = document.querySelector(".category-container");
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
        let hour = startTime.substring(0, startTime.length - 1);
        if (hour.length == 1) {
          hour = "0" + hour;
        }
        startTime = hour + ":00";
      } else {
        let startTimeSplit = startTime
          .substring(0, startTime.length - 1)
          .split(":");
        startTime =
          String(Number(startTimeSplit[0]) + 12) +
          ":" +
          String(startTimeSplit[1]);
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
          endTime = jsonResponse[0].endTime;
          endDate = jsonResponse[0].endDate;
          color = jsonResponse[0].color;
        });
      EDIT_STARTDATE.value = startDate;
      EDIT_STARTTIME.value = startTime;
      EDIT_ENDDATE.value = endDate;
      EDIT_ENDTIME.value = endTime;
      EDIT_VERTICAL.style.backgroundColor = color;
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

      eventDict["title"] = title;
      eventDict["start"] = startDate + "T" + startTime + ":00";
      eventDict["end"] = endDate + "T" + endTime + ":00";
      eventDict["allDay"] = allDay;
      eventDict["color"] = color;
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

// ADD_EVENT button

ADD_EVENT.addEventListener("click", function () {
  NEW_EVENT.style.display =
    NEW_EVENT.style.display == "none" ? "block" : "none";
  // ADD_EVENT.style.backgroundColor =
  //   NEW_EVENT.style.display === "none" ? "#c38282" : "#ac3f3f";
  ADD_EVENT.classList.toggle("newEvent-active");
});

// NEW_EVENT button

NEW_EVENT_BUTTON.addEventListener("click", async function () {
  const title = NEW_EVENT_TITLE.value;
  const startDate = NEW_EVENT_START_DATE.value;
  const startTime = NEW_EVENT_START_TIME.value;
  const endDate = NEW_EVENT_END_DATE.value;
  const endTime = NEW_EVENT_END_TIME.value;

  if (
    title == "" ||
    startDate == "" ||
    startTime == "" ||
    endDate == "" ||
    endTime == ""
  ) {
    alert("任一欄位不可空白");
  } else {
    NEW_EVENT.style.display = "none";
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
        color: "rgb(246, 225, 225)",
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
    NEW_EVENT.style.display = "none";
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
