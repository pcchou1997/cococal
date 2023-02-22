const ADD_CATEGORY = document.querySelector(".addCategory");
const CATEGORY_CLOSE = document.querySelector(".category-container .fa-xmark");
const CATEGORY_BUTTON = document.querySelector(".category-button");
const CATEGORY_COLOR = document.querySelectorAll(".categoryColor");
const CATEGORY_VERTICAL = document.querySelector(".category-vertical");
const CATEGORYNAME_INPUT = document.querySelector(".categoryName-input");
const CATEGORYLIST = document.querySelector(".categoryList");
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
const EDIT_CATEGORY_COLOR = document.querySelectorAll(".edit-categoryColor");
const EDIT_CATEGORY_REVISE = document.querySelector(".edit-category-revise");
const EDIT_CATEGORY_DELETE = document.querySelector(".edit-category-delete");

let oldColor;
let oldCategoryName;

// get DB categories

fetch("/readCategory")
  .then((res) => {
    return res.json();
  })
  .then((jsonResponse) => {
    console.log(jsonResponse);
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
      CREATEEVENT_CATEGORY_SELECT.appendChild(option);

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
  })
  .then((jsonResponse) => {
    const PRESSED_BUTTON = document.querySelectorAll(".fa-square-check-solid");
    const UNPRESSED_BUTTON = document.querySelectorAll(
      ".fa-square-check-regular"
    );
    const EDIT_CATEGORY_BUTTON = document.querySelectorAll(".fa-pen-to-square");

    EDIT_CATEGORY_SELECT.addEventListener("change", function () {
      EDIT_VERTICAL.style.backgroundColor = this.value;
    });

    CREATEEVENT_CATEGORY_SELECT.addEventListener("change", function () {
      CREATE_EVENT_VERTICAL.style.backgroundColor = this.value;
    });

    // PRESSED_BUTTON
    Array.from(PRESSED_BUTTON).forEach((element) => {
      element.addEventListener("click", function () {
        console.log(this.previousSibling);
        this.style.display = "none";
        this.previousSibling.style.display = "block";
      });
    });

    // UNPRESSED_BUTTON
    Array.from(UNPRESSED_BUTTON).forEach((element) => {
      element.addEventListener("click", function () {
        this.style.display = "none";
        this.nextSibling.style.display = "block";
      });
    });

    // EDIT_CATEGORY_BUTTON
    Array.from(EDIT_CATEGORY_BUTTON).forEach((element) => {
      element.addEventListener("click", function () {
        EDIT_CATEGORY_CONTAINER.style.display = "block";
        oldCategoryName = this.parentNode.previousSibling.children[1].innerHTML;
        EDIT_CATEGORYNAME_INPUT.value =
          this.parentNode.previousSibling.children[1].innerHTML;
        oldColor =
          this.parentNode.previousSibling.firstChild.style.backgroundColor;
        EDIT_CATEGORY_VERTICAL.style.backgroundColor =
          this.parentNode.previousSibling.firstChild.style.backgroundColor;
      });
    });
  });

// NEW_CATEGORY

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

// EDIT_CATEGORY - revise category

EDIT_CATEGORY_CONTAINER_CLOSE.addEventListener("click", function () {
  EDIT_CATEGORY_CONTAINER.style.display = "none";
});

Array.from(EDIT_CATEGORY_COLOR).forEach((element) => {
  element.addEventListener("click", async function () {
    let color = getComputedStyle(this).backgroundColor;
    EDIT_CATEGORY_VERTICAL.style.backgroundColor = color;
  });
});

EDIT_CATEGORY_REVISE.addEventListener("click", async function () {
  EDIT_CATEGORY_CONTAINER.style.display = "none";
  let color = getComputedStyle(EDIT_CATEGORY_VERTICAL).backgroundColor;
  console.log(color);
  let categoryName = EDIT_CATEGORYNAME_INPUT.value;
  console.log(categoryName);

  if (
    color == "" ||
    categoryName == "" ||
    oldColor == "" ||
    oldCategoryName == ""
  ) {
    alert("Not allow any unfilled field");
  } else {
    await fetch("/updateCategory", {
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
    });

    window.location.reload();
  }
});

// EDIT_CATEGORY - delete category

EDIT_CATEGORY_DELETE.addEventListener("click", function () {
  if (oldCategoryName == "" || oldColor == "") {
    alert("Not allow any unfilled field");
  } else {
    EDIT_CATEGORY_CONTAINER.style.display = "none";
    fetch("/deleteCategory", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        oldCategoryName: oldCategoryName,
        oldColor: oldColor,
      }),
    });
    window.location.reload();
  }
});
