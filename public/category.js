const ADD_CATEGORY = document.querySelector(".addCategory");
const CATEGORY_CLOSE = document.querySelector(".category-container .fa-xmark");
const CATEGORY_BUTTON = document.querySelector(".category-button");
const CATEGORY_COLOR = document.querySelectorAll(".categoryColor");
const CATEGORY_VERTICAL = document.querySelector(".category-vertical");
const CATEGORYNAME_INPUT = document.querySelector(".categoryName-input");

// get DB categories

fetch("/readCategory")
  .then((res) => {
    return res.json();
  })
  .then((jsonResponse) => {
    Array.from(jsonResponse).forEach((element) => {
      let option = document.createElement("option");
      option.value = element.color;
      option.innerHTML = element.categoryName;
      EDIT_CATEGORY_SELECT.appendChild(option);
      option = document.createElement("option");
      option.value = element.color;
      option.innerHTML = element.categoryName;
      CREATEEVENT_CATEGORY_SELECT.appendChild(option);
    });
  })
  .then((jsonResponse) => {
    EDIT_CATEGORY_SELECT.addEventListener("change", function () {
      EDIT_VERTICAL.style.backgroundColor = this.value;
    });
    CREATEEVENT_CATEGORY_SELECT.addEventListener("change", function () {
      CREATE_EVENT_VERTICAL.style.backgroundColor = this.value;
    });
  });

ADD_CATEGORY.addEventListener("click", function () {
  EDIT_CONTAINER.style.display = "none";
  CATEGORY_CONTAINER.style.display = "block";
});

CATEGORY_CLOSE.addEventListener("click", function () {
  CATEGORY_CONTAINER.style.display = "none";
});

Array.from(CATEGORY_COLOR).forEach((element) => {
  element.addEventListener("click", async function () {
    let color = getComputedStyle(this).backgroundColor;
    CATEGORY_VERTICAL.style.backgroundColor = color;
  });
});

CATEGORY_BUTTON.addEventListener("click", async function () {
  CATEGORY_CONTAINER.style.display = "none";
  let color = getComputedStyle(CATEGORY_VERTICAL).backgroundColor;
  let categoryName = CATEGORYNAME_INPUT.value;

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

  window.location.reload();
});