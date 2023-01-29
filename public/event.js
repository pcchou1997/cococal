const ADD_EVENT = document.querySelector(".addEvent");
const NEW_EVENT = document.querySelector(".newEvent");
const NEW_EVENT_TITLE = document.querySelector(".newEvent-title");
const NEW_EVENT_START_DATE = document.querySelector(".newEvent-startDate");
const NEW_EVENT_START_TIME = document.querySelector(".newEvent-startTime");
const NEW_EVENT_END_DATE = document.querySelector(".newEvent-endDate");
const NEW_EVENT_END_TIME = document.querySelector(".newEvent-endTime");
const NEW_EVENT_BUTTON = document.querySelector(".newEvent-button");

// get DB data

fetch("/readEvent")
  .then((res) => {
    return res.json();
  })
  .then((jsonResponse) => {
    console.log(jsonResponse);

    let events = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      let eventDict = {};
      let title = jsonResponse[i].title;
      let startDate = jsonResponse[i].startDate;
      let startTime = jsonResponse[i].startTime;
      let endDate = jsonResponse[i].endDate;
      let endTime = jsonResponse[i].endTime;

      eventDict["title"] = title;
      eventDict["start"] = startDate + "T" + startTime + ":00";
      eventDict["end"] = endDate + "T" + endTime + ":00";
      events.push(eventDict);
    }
    console.log("events:", events);
    // events = [
    //   {
    //     title: "做專案啦啦啦啦",
    //     start: "2023-01-20T14:00:00",
    //     end: "2023-01-20T16:00:00",
    //   },
    //   {
    //     title: "專案報告",
    //     start: "2023-01-30",
    //     alllDay: false,
    //   },
    // ];

    // create calendar

    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      locale: "zh-tw",
      editable: true,
      selectable: true,
      navLinks: true,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      },
      events: events,
    });
    calendar.render();
  })
  .catch((err) => {
    // handle error
    console.error(err);
  });

// ADD_EVENT BUTTON

ADD_EVENT.addEventListener("click", function () {
  NEW_EVENT.style.display =
    NEW_EVENT.style.display == "none" ? "block" : "none";
  // ADD_EVENT.style.backgroundColor =
  //   NEW_EVENT.style.display === "none" ? "#c38282" : "#ac3f3f";
  ADD_EVENT.classList.toggle("newEvent-active");
});

// NEW_EVENT_BUTTON

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
      }),
    });

    window.location.reload();
  }
});
