const ADD_CATEGORY = document.querySelector(".addCategory");
const CATEGORY_CLOSE = document.querySelector(".category-container .fa-xmark");
const CATEGORY_BUTTON = document.querySelector(".category-button");
const CATEGORY_COLOR = document.querySelectorAll(".categoryColor");
const CATEGORY_VERTICAL = document.querySelector(".category-vertical");
const CATEGORYNAME_INPUT = document.querySelector(".categoryName-input");
const CATEGORYLIST = document.querySelector(".categoryList");

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
      let dot = document.createElement("div");

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
      dot.style.backgroundColor = element.color;
      div.appendChild(dot);
      div.appendChild(document.createTextNode(element.categoryName));
      CATEGORYLIST.appendChild(div);
    });
  })
  .then((jsonResponse) => {
    const CATEGORYLIST_ITEM = document.querySelectorAll(".categoryList-item");

    EDIT_CATEGORY_SELECT.addEventListener("change", function () {
      EDIT_VERTICAL.style.backgroundColor = this.value;
    });
    CREATEEVENT_CATEGORY_SELECT.addEventListener("change", function () {
      CREATE_EVENT_VERTICAL.style.backgroundColor = this.value;
    });
    console.log(CATEGORYLIST_ITEM);
    Array.from(CATEGORYLIST_ITEM).forEach((element) => {
      console.log(element);
      element.addEventListener("click", function () {
        console.log(this.innerHTML);
        // this.innerHTML.indexOf("<i class=‘fa-solid fa-check’></i>") !== -1
        if (this.innerHTML.includes("<i class=‘fa-solid fa-check’></i>")) {
          this.innerHTML.replace("<i class=‘fa-solid fa-check’></i>", "");
        } else {
          this.innerHTML = this.innerHTML + `<i class='fa-solid fa-check'></i>`;
        }
      });
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
