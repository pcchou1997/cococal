const ADD_CATEGORY = document.querySelector(".addCategory");
const CATEGORY_CLOSE = document.querySelector(".category-container .fa-xmark");
const CREATE_CATEGORY_BUTTON = document.querySelector(
  ".create-category-button"
);
const CREATE_CATEGORY_WRONG_MESSAGE = document.querySelector(
  ".create-category-wrongMessage"
);
const CATEGORY_COLOR = document.querySelectorAll(".categoryColor");
const CATEGORY_VERTICAL = document.querySelector(".category-vertical");
const CATEGORYNAME_INPUT = document.querySelector(".categoryName-input");
const CATEGORYLIST = document.querySelector(".categoryList");
const CATEGORY_COLOR_PICKER = document.querySelector("#category-colorpicker");
const EDIT_CATEGORY_CONTAINER = document.querySelector(
  ".edit-category-container"
);
const EDIT_CATEGORY_CONTAINER_CLOSE = document.querySelector(
  ".edit-category-close"
);
const EDIT_CATEGORYNAME_INPUT = document.querySelector(
  ".edit-categoryName-input"
);
const EDIT_CATEGORY_VERTICAL = document.querySelector(
  ".edit-category-vertical"
);
const EDIT_CATEGORY_REVISE = document.querySelector(".edit-category-revise");
const EDIT_CATEGORY_DELETE = document.querySelector(".edit-category-delete");
const EDIT_CATEGORY_COLOR_PICKER = document.querySelector(
  "#edit-category-colorpicker"
);
const EDIT_CATEGORY_WRONG_MESSAGE = document.querySelector(
  ".edit-category-wrongMessage"
);

let oldColor;
let oldCategoryName;

// get DB categories

fetch("/readCategory")
  .then((res) => {
    return res.json();
  })
  .then((jsonResponse) => {
    if (jsonResponse.length == 0) {
      let div = document.createElement("div");
      div.setAttribute("class", "no-category");
      div.innerHTML = "Doesn't have any category? Try to create one now!";
      CATEGORYLIST.appendChild(div);
    } else {
      Array.from(jsonResponse).forEach((element) => {
        let option = document.createElement("option");
        let div = document.createElement("div");
        let categoryList_category_container = document.createElement("div");
        let categoryList_category = document.createElement("div");
        let dot = document.createElement("div");
        let addContent = `<div class="categoryList-button-container"><i class="fa-regular fa-square-check fa-square-check-regular"></i></i><i class="fa-solid fa-square-check fa-square-check-solid"></i><i class="fa-regular fa-pen-to-square"></i></div>`;

        // Edit Event Block
        option.value = element.color;
        option.innerHTML = element.categoryName;
        EDIT_CATEGORY_SELECT.appendChild(option);

        // Create Event Block
        option = document.createElement("option");
        option.value = element.color;
        option.innerHTML = element.categoryName;
        CREATE_EVENT_CATEGORY_SELECT.appendChild(option);

        // Category List
        div.setAttribute("class", "categoryList-item");
        dot.setAttribute("class", "categoryList-item-dot");
        categoryList_category_container.setAttribute(
          "class",
          "categoryList-category-container"
        );
        dot.style.backgroundColor = element.color;
        categoryList_category.innerHTML = element.categoryName;
        categoryList_category_container.appendChild(dot);
        categoryList_category_container.appendChild(categoryList_category);
        div.appendChild(categoryList_category_container);
        div.innerHTML += addContent;
        CATEGORYLIST.appendChild(div);
      });
    }

    return jsonResponse;
  })
  .then((jsonResponse) => {
    console.log(jsonResponse);
    const PRESSED_BUTTON = document.querySelectorAll(".fa-square-check-solid");
    const UNPRESSED_BUTTON = document.querySelectorAll(
      ".fa-square-check-regular"
    );
    const EDIT_CATEGORY_BUTTON = document.querySelectorAll(".fa-pen-to-square");

    EDIT_CATEGORY_SELECT.addEventListener("change", function () {
      EDIT_VERTICAL.style.backgroundColor = this.value;
    });

    CREATE_EVENT_CATEGORY_SELECT.addEventListener("change", function () {
      CREATE_EVENT_VERTICAL.style.backgroundColor = this.value;
    });

    // PRESSED_BUTTON
    Array.from(PRESSED_BUTTON).forEach((element) => {
      element.addEventListener("click", async function () {
        this.style.display = "none";
        this.previousSibling.style.display = "block";
        let color = getComputedStyle(
          this.parentNode.parentNode.children[0].children[0]
        ).backgroundColor;
        let className =
          this.parentNode.parentNode.children[0].children[1].innerHTML;
        let idList = [];

        await fetch("/readEventsOfSpecificCategory", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ oldColor: color }),
        })
          .then((res) => {
            return res.json();
          })
          .then((EventsOfSpecificCategory) => {
            EventsOfSpecificCategory.forEach((event) => {
              idList.push(event.id);
            });
          });

        idList.forEach((id) => {
          let calendarEventId = calendar.getEventById(id);
          calendarEventId.setProp("display", "none");
        });
        editCalendarEvents();
      });
    });

    // UNPRESSED_BUTTON
    Array.from(UNPRESSED_BUTTON).forEach((element) => {
      element.addEventListener("click", async function () {
        this.style.display = "none";
        this.nextSibling.style.display = "block";

        let color = getComputedStyle(
          this.parentNode.parentNode.children[0].children[0]
        ).backgroundColor;
        let className =
          this.parentNode.parentNode.children[0].children[1].innerHTML;
        let idList = [];

        await fetch("/readEventsOfSpecificCategory", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ oldColor: color }),
        })
          .then((res) => {
            return res.json();
          })
          .then((EventsOfSpecificCategory) => {
            EventsOfSpecificCategory.forEach((event) => {
              idList.push(event.id);
            });
          });
        console.log(idList);

        idList.forEach((id) => {
          let calendarEventId = calendar.getEventById(id);
          calendarEventId.setProp("display", "auto");
        });
        editCalendarEvents();
      });
    });

    // EDIT_CATEGORY_BUTTON
    Array.from(EDIT_CATEGORY_BUTTON).forEach((element) => {
      element.addEventListener("click", function () {
        EDIT_CATEGORY_CONTAINER.style.display = "block";
        OVERLAY.style.display = "block";
        oldCategoryName = this.parentNode.previousSibling.children[1].innerHTML;
        EDIT_CATEGORYNAME_INPUT.value =
          this.parentNode.previousSibling.children[1].innerHTML;
        oldColor =
          this.parentNode.previousSibling.firstChild.style.backgroundColor;
        EDIT_CATEGORY_VERTICAL.style.backgroundColor =
          this.parentNode.previousSibling.firstChild.style.backgroundColor;
        let rgbToHexColor =
          this.parentNode.previousSibling.firstChild.style.backgroundColor.split(
            ","
          );

        // change color from RGB to HEX

        rgbToHexColor[0] = rgbToHexColor[0].replace("rgb(", "");
        rgbToHexColor[1] = rgbToHexColor[1].replace(" ", "");
        rgbToHexColor[2] = rgbToHexColor[2].replace(")", "");
        rgbToHexColor[2] = rgbToHexColor[2].replace(" ", "");

        EDIT_CATEGORY_COLOR_PICKER.value = rgbToHex(
          Number(rgbToHexColor[0]),
          Number(rgbToHexColor[1]),
          Number(rgbToHexColor[2])
        );
      });
    });
  });

// the function of changing color from RGB to HEX

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// NEW_CATEGORY

ADD_CATEGORY.addEventListener("click", function () {
  EDIT_CONTAINER.style.display = "none";
  CATEGORY_CONTAINER.style.display = "block";
  OVERLAY.style.display = "block";
  CATEGORYNAME_INPUT.value = "";
  CATEGORY_VERTICAL.style.backgroundColor = "rgb(200, 200, 200)";
  CATEGORY_COLOR_PICKER.value = "#c8c8c8";
});

CATEGORY_CLOSE.addEventListener("click", function () {
  CATEGORY_CONTAINER.style.display = "none";
  CREATE_CATEGORY_WRONG_MESSAGE.style.display = "none";
  OVERLAY.style.display = "none";
});

CATEGORY_COLOR_PICKER.addEventListener("input", function () {
  CATEGORY_VERTICAL.style.backgroundColor = this.value;
});

// add category

CREATE_CATEGORY_BUTTON.addEventListener("click", async function () {
  CREATE_CATEGORY_WRONG_MESSAGE.style.display = "none";
  let color = getComputedStyle(CATEGORY_VERTICAL).backgroundColor;
  let categoryName = CATEGORYNAME_INPUT.value;

  if (categoryName == "") {
    CREATE_CATEGORY_WRONG_MESSAGE.style.display = "block";
    CREATE_CATEGORY_WRONG_MESSAGE.innerHTML = "Please fill the blank";
  } else {
    if (document.querySelector(".no-category") != null) {
      document.querySelector(".no-category").remove();
    } else {
    }

    CATEGORY_CONTAINER.style.display = "none";
    OVERLAY.style.display = "none";
    await fetch("/insertCategory", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        color: color,
        categoryName: categoryName,
      }),
    });

    // socket.io
    let message = {
      color: color,
      categoryName: categoryName,
    };

    // socket: client ????????? server
    socket.emit("insert-category", message);
  }
});

// revise category

EDIT_CATEGORY_CONTAINER_CLOSE.addEventListener("click", function () {
  EDIT_CATEGORY_CONTAINER.style.display = "none";
  EDIT_CATEGORY_WRONG_MESSAGE.style.display = "none";
  OVERLAY.style.display = "none";
});

EDIT_CATEGORY_COLOR_PICKER.addEventListener("input", function () {
  EDIT_CATEGORY_VERTICAL.style.backgroundColor = this.value;
});

EDIT_CATEGORY_REVISE.addEventListener("click", async function () {
  EDIT_CATEGORY_WRONG_MESSAGE.style.display = "none";
  let color = getComputedStyle(EDIT_CATEGORY_VERTICAL).backgroundColor;
  let categoryName = EDIT_CATEGORYNAME_INPUT.value;
  let EventsOfSpecificCategoryIds = [];

  if (
    color == "" ||
    categoryName == "" ||
    oldColor == "" ||
    oldCategoryName == ""
  ) {
    EDIT_CATEGORY_WRONG_MESSAGE.style.display = "block";
    EDIT_CATEGORY_WRONG_MESSAGE.innerHTML = "Please fill the blank";
  } else if (color == oldColor && categoryName == oldCategoryName) {
    EDIT_CATEGORY_WRONG_MESSAGE.style.display = "block";
    EDIT_CATEGORY_WRONG_MESSAGE.innerHTML = "Nothing is changed";
  } else {
    EDIT_CATEGORY_CONTAINER.style.display = "none";
    OVERLAY.style.display = "none";

    await fetch("/readEventsOfSpecificCategory", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ oldColor: oldColor }),
    })
      .then((res) => {
        return res.json();
      })
      .then((EventsOfSpecificCategory) => {
        EventsOfSpecificCategory.forEach((event) => {
          EventsOfSpecificCategoryIds.push(event.id);
        });
      })
      .then(
        fetch("/updateCategory", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            color: color,
            categoryName: categoryName,
            oldColor: oldColor,
            oldCategoryName: oldCategoryName,
          }),
        })
      )
      .then(
        fetch("/updateEventCategory", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            color: color,
            oldColor: oldColor,
            className: categoryName,
            oldClassName: oldCategoryName,
          }),
        })
      );

    // socket.io
    let message = {
      color: color,
      oldColor: oldColor,
      categoryName: categoryName,
      oldCategoryName: oldCategoryName,
      EventsOfSpecificCategoryIds: EventsOfSpecificCategoryIds,
    };

    // socket: client ????????? server
    socket.emit("edit-category", message);
  }
});

// delete category

EDIT_CATEGORY_DELETE.addEventListener("click", async function () {
  let confirmResponse = window.confirm("Are you sure you want to delete it?");
  if (confirmResponse == true) {
    let color = getComputedStyle(EDIT_CATEGORY_VERTICAL).backgroundColor;
    let categoryName = EDIT_CATEGORYNAME_INPUT.value;
    let EventsOfSpecificCategoryList = [];
    let categoryList = [];

    await fetch("/readSpecificCategory", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ color: color }),
    })
      .then((res) => {
        return res.json();
      })
      .then((category) => {
        categoryList = category;
      });

    if (categoryName == "") {
      alert("Please fill the blank");
    } else if (categoryList[0].categoryName != categoryName) {
      alert("Please enter correct information");
    }
    // ?????????????????????????????????
    else {
      await fetch("/readEventsOfSpecificCategory", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ oldColor: color }),
      })
        .then((res) => {
          return res.json();
        })
        .then((EventsOfSpecificCategory) => {
          EventsOfSpecificCategoryList = EventsOfSpecificCategory;
        });
      if (EventsOfSpecificCategoryList.length != 0) {
        alert("There are events in this category so it can't be deleted");
      } else {
        await fetch("/deleteCategory", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            categoryName: categoryName,
            color: color,
          }),
        })
          .then((res) => {
            EDIT_CATEGORY_CONTAINER.style.display = "none";
            OVERLAY.style.display = "none";

            // socket.io
            let message = {
              categoryName: categoryName,
              color: color,
            };

            // socket: client ????????? server
            socket.emit("delete-category", message);
          })
          .catch((error) => {
            alert("Sorry, there is something wrong");
          });
      }
    }
  } else {
  }
});

// socket.io

// socket: client ?????? server ???????????????????????????????????????
// add category
socket.on("insert-category", async function (msg) {
  let color = msg.color;
  let categoryName = msg.categoryName;

  let option = document.createElement("option");
  let div = document.createElement("div");
  let categoryList_category_container = document.createElement("div");
  let categoryList_category = document.createElement("div");
  let dot = document.createElement("div");
  let addContent = `<div class="categoryList-button-container"><i class="fa-regular fa-square-check fa-square-check-regular"></i></i><i class="fa-solid fa-square-check fa-square-check-solid"></i><i class="fa-regular fa-pen-to-square"></i></div>`;

  // Edit Event Block
  option.value = color;
  option.innerHTML = categoryName;
  EDIT_CATEGORY_SELECT.appendChild(option);

  // Create Event Block
  option = document.createElement("option");
  option.value = color;
  option.innerHTML = categoryName;
  CREATE_EVENT_CATEGORY_SELECT.appendChild(option);

  // Category List
  div.setAttribute("class", "categoryList-item");
  dot.setAttribute("class", "categoryList-item-dot");
  categoryList_category_container.setAttribute(
    "class",
    "categoryList-category-container"
  );
  dot.style.backgroundColor = color;
  categoryList_category.innerHTML = categoryName;
  categoryList_category_container.appendChild(dot);
  categoryList_category_container.appendChild(categoryList_category);
  div.appendChild(categoryList_category_container);
  div.innerHTML += addContent;
  CATEGORYLIST.appendChild(div);

  // add event listener

  // PRESSED_BUTTON
  const PRESSED_BUTTON = document.querySelectorAll(".fa-square-check-solid");
  let lastCategoryPressedButton = PRESSED_BUTTON[PRESSED_BUTTON.length - 1];

  lastCategoryPressedButton.addEventListener("click", async function () {
    this.style.display = "none";
    this.previousSibling.style.display = "block";
    let color = getComputedStyle(
      this.parentNode.parentNode.children[0].children[0]
    ).backgroundColor;
    let className =
      this.parentNode.parentNode.children[0].children[1].innerHTML;
    let idList = [];

    await fetch("/readEventsOfSpecificCategory", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ oldColor: color }),
    })
      .then((res) => {
        return res.json();
      })
      .then((EventsOfSpecificCategory) => {
        EventsOfSpecificCategory.forEach((event) => {
          idList.push(event.id);
        });
      });

    idList.forEach((id) => {
      let calendarEventId = calendar.getEventById(id);
      calendarEventId.setProp("display", "none");
    });
    editCalendarEvents();
  });

  // UNPRESSED_BUTTON
  const UNPRESSED_BUTTON = document.querySelectorAll(
    ".fa-square-check-regular"
  );
  let lastCategoryUnpressedButton =
    UNPRESSED_BUTTON[UNPRESSED_BUTTON.length - 1];

  lastCategoryUnpressedButton.addEventListener("click", async function () {
    this.style.display = "none";
    this.nextSibling.style.display = "block";
    let color = getComputedStyle(
      this.parentNode.parentNode.children[0].children[0]
    ).backgroundColor;
    let className =
      this.parentNode.parentNode.children[0].children[1].innerHTML;
    let idList = [];

    await fetch("/readEventsOfSpecificCategory", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ oldColor: color }),
    })
      .then((res) => {
        return res.json();
      })
      .then((EventsOfSpecificCategory) => {
        EventsOfSpecificCategory.forEach((event) => {
          idList.push(event.id);
        });
      });

    idList.forEach((id) => {
      let calendarEventId = calendar.getEventById(id);
      calendarEventId.setProp("display", "auto");
    });
    editCalendarEvents();
  });

  // EDIT_CATEGORY_BUTTON
  const EDIT_CATEGORY_BUTTON = document.querySelectorAll(".fa-pen-to-square");
  Array.from(EDIT_CATEGORY_BUTTON).forEach((element) => {
    element.addEventListener("click", function () {
      EDIT_CATEGORY_CONTAINER.style.display = "block";
      OVERLAY.style.display = "block";
      oldCategoryName = this.parentNode.previousSibling.children[1].innerHTML;
      EDIT_CATEGORYNAME_INPUT.value =
        this.parentNode.previousSibling.children[1].innerHTML;
      oldColor =
        this.parentNode.previousSibling.firstChild.style.backgroundColor;
      EDIT_CATEGORY_VERTICAL.style.backgroundColor =
        this.parentNode.previousSibling.firstChild.style.backgroundColor;
      let rgbToHexColor =
        this.parentNode.previousSibling.firstChild.style.backgroundColor.split(
          ","
        );

      // change color from RGB to HEX

      rgbToHexColor[0] = rgbToHexColor[0].replace("rgb(", "");
      rgbToHexColor[1] = rgbToHexColor[1].replace(" ", "");
      rgbToHexColor[2] = rgbToHexColor[2].replace(")", "");
      rgbToHexColor[2] = rgbToHexColor[2].replace(" ", "");

      EDIT_CATEGORY_COLOR_PICKER.value = rgbToHex(
        Number(rgbToHexColor[0]),
        Number(rgbToHexColor[1]),
        Number(rgbToHexColor[2])
      );
    });
  });
});

// edit category
socket.on("edit-category", async function (msg) {
  let color = msg.color;
  let oldColor = msg.oldColor;
  let categoryName = msg.categoryName;
  let oldCategoryName = msg.oldCategoryName;
  let EventsOfSpecificCategoryIds = msg.EventsOfSpecificCategoryIds;

  const CATEGORYLIST_ITEM = document.querySelectorAll(".categoryList-item");
  Array.from(CATEGORYLIST_ITEM).forEach((node) => {
    if (
      node.childNodes[0].childNodes[1].innerHTML == oldCategoryName &&
      getComputedStyle(node.childNodes[0].childNodes[0]).backgroundColor ==
        oldColor
    ) {
      // ????????????????????????
      node.childNodes[0].childNodes[1].innerHTML = categoryName;
      node.childNodes[0].childNodes[0].style.backgroundColor = color;

      // ??????events: ??????id??????
      EventsOfSpecificCategoryIds.forEach((id) => {
        let calendarEventId = calendar.getEventById(id);
        calendarEventId.setProp("color", color);
        calendarEventId.setProp("classNames", [categoryName]);
        editCalendarEvents();
      });

      // ??????????????????????????????select??????options

      // Create Event Block
      Array.from(CREATE_EVENT_CATEGORY_SELECT).forEach((node) => {
        if (node.innerHTML == oldCategoryName && node.value == oldColor) {
          node.innerHTML = categoryName;
          node.value = color;
        } else {
        }
      });

      // Edit Event Block
      Array.from(EDIT_CATEGORY_SELECT).forEach((node) => {
        if (node.innerHTML == oldCategoryName && node.value == oldColor) {
          node.innerHTML = categoryName;
          node.value = color;
        } else {
        }
      });
    } else {
    }
  });
});

// delete category
socket.on("delete-category", async function (msg) {
  let categoryName = msg.categoryName;
  let color = msg.color;

  const CATEGORYLIST_ITEM = document.querySelectorAll(".categoryList-item");
  Array.from(CATEGORYLIST_ITEM).forEach((node) => {
    if (
      node.childNodes[0].childNodes[1].innerHTML == categoryName &&
      getComputedStyle(node.childNodes[0].childNodes[0]).backgroundColor ==
        color
    ) {
      node.remove();
    } else {
    }
  });

  // check if category list is empty
  if (document.querySelector(".categoryList-item") == null) {
    let div = document.createElement("div");
    div.setAttribute("class", "no-category");
    div.innerHTML = "Doesn't have any category? Try to create one now!";
    CATEGORYLIST.appendChild(div);
  } else {
  }

  // remove in create event block
  const CREATEEVENT_CATEGORY_SELECT = document.querySelector(
    ".createEvent-category-select"
  );
  Array.from(CREATEEVENT_CATEGORY_SELECT).forEach((option) => {
    if (option.innerHTML == categoryName && option.value == color) {
      option.remove();
    } else {
    }
  });

  // remove in edit event block
  const EDIT_CATEGORY_SELECT = document.querySelector(".edit-category-select");
  Array.from(EDIT_CATEGORY_SELECT).forEach((option) => {
    if (option.innerHTML == categoryName && option.value == color) {
      option.remove();
    } else {
    }
  });
});
