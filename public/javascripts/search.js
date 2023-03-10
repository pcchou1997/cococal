const SERACH_BAR = document.querySelector(".searchBar");
const SERACH_INPUT = document.querySelector(".search-input");
const SERACH_BUTTON = document.querySelector(".search-icon");
const SERACH_RESULT_CLOSE = document.querySelector(".search-result-close");
const SERACH_RESULT_CONTAINER = document.querySelector(
  ".search-result-container"
);

let keyword;

SERACH_RESULT_CLOSE.addEventListener("click", function () {
  SERACH_RESULT_CONTAINER.style.display = "none";
  OVERLAY.style.display = "none";
});

SERACH_BUTTON.addEventListener("click", function () {
  keyword = SERACH_INPUT.value;

  // check if keyword is entered
  if (keyword == "") {
    SERACH_BAR.style.borderColor = "red";
    SERACH_INPUT.focus();
    alert("Please enter the keyword");
  } else {
    // clear results
    if (document.querySelector(".search-result-results") != null) {
      document.querySelector(".search-result-results").remove();
    } else {
    }

    SERACH_RESULT_CONTAINER.style.display = "block";
    OVERLAY.style.display = "block";

    fetch("/searchEvent", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        keyword: keyword,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((searchEvents) => {
        console.log(searchEvents);
        let resultDiv = document.createElement("div");
        resultDiv.setAttribute("class", "search-result-results");
        let eventNums = document.createElement("div");
        eventNums.setAttribute("class", "search-result-event-nums");
        eventNums.innerHTML = "Find " + searchEvents.length + " events";
        resultDiv.appendChild(eventNums);
        Array.from(searchEvents).forEach((event) => {
          let eventDiv = document.createElement("div");
          eventDiv.setAttribute("class", "search-result-event");
          let eventTitle = document.createElement("div");
          eventTitle.setAttribute("class", "search-result-event-title");
          let vertical = document.createElement("div");
          vertical.setAttribute("class", "search-result-event-vertical");
          let eventTime = document.createElement("div");
          eventTime.setAttribute("class", "search-result-event-time");
          let eventInfo = document.createElement("div");
          eventInfo.setAttribute("class", "search-result-event-info");

          // event time display method
          let startTime = event.startTime;
          let endTime = event.endTime;

          // label morning(a) or evening(p) time
          if (Number(startTime.split(":")[0]) > 11) {
            startTime += "p";
          } else {
            startTime += "a";
          }
          if (Number(endTime.split(":")[0]) > 11) {
            endTime += "p";
          } else {
            endTime += "a";
          }

          // confirm if event duration > 1 day or not
          // event duration > 1 day
          if (event.startDate == event.endDate) {
            eventTime.innerHTML =
              "<b>" +
              event.startDate +
              "</b>&nbsp;&nbsp;&nbsp;" +
              startTime +
              " - " +
              endTime;
          }
          // event duration <= 1 day
          else {
            eventTime.innerHTML =
              "<b>" +
              event.startDate +
              "</b>&nbsp;&nbsp;" +
              startTime +
              "  -  " +
              "<b>" +
              event.endDate +
              "</b>&nbsp;&nbsp;" +
              endTime;
          }

          eventTitle.innerHTML = event.title;
          vertical.style.backgroundColor = event.color;
          eventDiv.appendChild(vertical);
          eventInfo.appendChild(eventTitle);
          eventInfo.appendChild(eventTime);
          eventDiv.appendChild(eventInfo);
          resultDiv.appendChild(eventDiv);
        });
        SERACH_RESULT_CONTAINER.appendChild(resultDiv);
        return searchEvents;
      })
      .then((searchEvents) => {
        const SERACH_RESULT_EVENT = document.querySelectorAll(
          ".search-result-event"
        );
        Array.from(SERACH_RESULT_EVENT).forEach((element) => {
          element.addEventListener("click", async function () {
            EDIT_CONTAINER.style.display = "block";
            let title;
            let startDate;
            let startTime;

            // whether event duration > 1 day or <= 1 day
            title = this.childNodes[1].childNodes[0].innerHTML;
            //   console.log(title);
            startDate =
              this.childNodes[1].childNodes[1].childNodes[0].innerHTML;
            //   console.log(startDate);
            startTime = this.childNodes[1].childNodes[1].innerHTML.replace(
              "<b>" + startDate + "</b>",
              ""
            );
            startTime = startTime
              .replaceAll("&nbsp;", "")
              .replaceAll(" ", "")
              .split("-")[0];
            startTime = startTime.substring(0, startTime.length - 1);
            //   console.log(startTime);

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
              .then((specificEvent) => {
                console.log(specificEvent);
                endTime = specificEvent[0].endTime;
                endDate = specificEvent[0].endDate;
                color = specificEvent[0].color;
                description = specificEvent[0].description;
              });
            EDIT_EVENTNAME_INPUT.value = title;
            EDIT_STARTDATE.value = startDate;
            EDIT_STARTTIME.value = startTime;
            EDIT_ENDDATE.value = endDate;
            EDIT_ENDTIME.value = endTime;
            EDIT_VERTICAL.style.backgroundColor = color;
            EDIT_CATEGORY_SELECT.value = color;
            EDIT_DESCRIPTION_INPUT.value = description;
          });
        });
      });
  }
});

SERACH_INPUT.addEventListener("change", function () {
  SERACH_BAR.style.borderColor = "gray";
});
