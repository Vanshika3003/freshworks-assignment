var client;
var data = [];
var CategoryData;
var inputText = "";
var businessCategories;
var autocompleteResponse;
var selectedValueLocation;
var categories;
var apiKey =
  "WXZwPIXGJf-OS-BO3J5GG3jbavcv-Up9wIfv-XEPCRG-QtzSreBmoRo60C0Ar7YpnBaRpdL01ulOckDQq2uzfXx0rhVRUJJRqrh6do8RFdzBUnELHa-wIui1hHsSY3Yx";

//Price Checkbox Array
let pricesByPersonArray = [
  { id: 101, name: "$", checked: false, value: "1" },
  { id: 102, name: "$$", checked: false, value: "2" },
  { id: 103, name: "$$$", checked: false, value: "3" },
];
//Additional Features Array
let additionalFeatures = [
  {
    id: 11,
    name: "Hot New",
    checked: false,
    value: "hot_and_new",
  },
  { id: 12, name: "Open to all", checked: false, value: "open_to_all" },
  { id: 13, name: "Request A Note", checked: false, value: "request_a_quote" },
];

//Embedding Checkbox List of Price By Person In Html
let checkboxhtmlPrices = "";
pricesByPersonArray.forEach((item) => {
  checkboxhtmlPrices += `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="${item.value}" id="${item.id}"onclick="checkboxPriceEvent(${item.id})">
    <label class="form-check-label" for="flexCheckDefault">
    ${item.name}
    </label>
    </div>`;
});
document.getElementById("selectedPriceCheckbox").innerHTML = checkboxhtmlPrices;

//Event to check the checkbox of price is clicked or not
function checkboxPriceEvent(id) {
  priceParams = [];
  priceChecked = "";
  let currentStatus = document.getElementById(id).checked;
  pricesByPersonArray.forEach((item) => {
    if (item.id == id) {
      item.checked = currentStatus;
    }
    if (item.checked) {
      priceParams.push(item.value);
    }
  });
  priceChecked = priceParams.toString();
}

//Embedding Checkbox List of Additional Features In Html
let checkboxhtmlFeatures = "";
additionalFeatures.forEach((item) => {
  checkboxhtmlFeatures += `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="${item.value}" id="${item.id}"onclick="checkboxFeaturesEvent(${item.id})">
    <label class="form-check-label" for="flexCheckDefault">
    ${item.name}
    </label>
    </div>`;
});

document.getElementById("selectedAdditionalFeatures").innerHTML =
  checkboxhtmlFeatures;

//Event to check the checkbox of Additional features is clicked or not
function checkboxFeaturesEvent(id) {
  featureParams = [];
  featureChecked = "";
  currentFeatureStatus = document.getElementById(id).checked;
  pricesByPersonArray.forEach((item) => {
    if (item.id == id) {
      item.checked = currentFeatureStatus;
    }
    if (item.checked) {
      featureParams.push(item.value);
    }
  });
  featureChecked = featureParams.toString();
}

//SuggestedCheckbox List
let allCheckBox = document.querySelectorAll("#flexCheckDefault");
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      suggestedChecked = event.target.value;
    }
  });
});

//Search Category from Input Element
function searchCategoryFunction() {
  inputText = document.getElementById("multiselect").value;
  if (inputText.length == 0) {
    allCategoriesForCheckbox({}, []);
  } else {
    searchCategoryApi(inputText);
  }
}
//AutoComplete Api
async function searchCategoryApi(inputText) {
  let options = {
    headers: {
      Authorization: `Bearer ${apiKey}`, // even a small space btwn token, = and <%= will break
      "Content-Type": "application/json",
    },
  };
  try {
    let autocompleteResponse = await client.request.get(
      "https://api.yelp.com/v3/autocomplete" + "?" + "text=" + `${inputText}`,
      options
    );
    let categoryArray = JSON.parse(autocompleteResponse.response).categories;
    categoryArray = categoryArray.map((item, index) => ({
      ...item,
      id: index + 100001,
      checked: false,
    }));
    data = categoryArray;
    allCategoriesForCheckbox({}, data);
  } catch (e) {
    console.log("Unable to call Search Category Api");
  }
}

//Getting Selected Value Of Location
function getSelectedLocation() {
  var select = document.getElementById("mySelect");
  selectedValueLocation = select.options[select.selectedIndex].value;
}

//Getting All Params on submitting filters
function submit() {
  let payload = {
    categories: categoriesparamsapi.toString(),
    open_now: suggestedChecked,
    price: priceChecked,
    attributes: featureChecked,
    location: selectedValueLocation,
  };
  const new_params = new URLSearchParams([
    ...Object.entries(payload),
  ]).toString();
  filteredRestaurants(new_params);
}
//Filtering Restaurants on filters
async function filteredRestaurants(new_params) {
  let searchedRestaurant = "";
  let options = {
    headers: {
      Authorization: `Bearer ${apiKey}`, // even a small space btwn token, = and <%= will break
      "Content-Type": "application/json",
    },
  };
  try {
    let allRestaurants = await client.request.get(
      "https://api.yelp.com/v3/businesses/search" + "?" + new_params,
      options
    );
    const restaurantData = document.getElementById("restaurantData");
    const parsedResponse = JSON.parse(allRestaurants.response);
    for (let i = 0; i < parsedResponse.businesses.length; i++) {
      businessCategories = parsedResponse.businesses[i].categories;
      businessTransactions = parsedResponse.businesses[i].transactions;
      ratings = parsedResponse.businesses[i].rating;
      r = Math.round(ratings);
      let categoriesUI = "";
      let transactionUI = "";
      let ratingUI = "";
      businessCategories.forEach((element) => {
        categoriesUI += `
    <span class="border p-1 text-center text-muted bg-light"><small>${element.title}</small> </span>&nbsp;
    `;
      });
      businessTransactions.forEach((element) => {
        transactionUI += `<span class="icon">&#9989;</span><small>&nbsp;${element}</small>`;
      });
      for (let i = 0; i < r; i++) {
        ratingUI += `<span class="fa fa-star checked"></span>`;
      }
      searchedRestaurant += ` <div class="border column">
   <div class=" p-3" >
     <img src="${
       parsedResponse.businesses[i].image_url
     }" style="max-width: 155px;height: 170px; "  class="rounded mx-auto d-block" alt="">
   </div>
  <div class="text-center">
     <b>${parsedResponse.businesses[i].name} | ${
        parsedResponse.businesses[i].price
      }</b>
      </div>
     <div class="text-center">
     ${ratingUI}
     &nbsp;
      <span>${parsedResponse.businesses[i].review_count}</span>
   </div>
   <div class="text-center">
   <span>${Math.round(parsedResponse.businesses[i].distance)}miles away</span>
  </div>
  <div class="text-center">
   <div class="text"><span>${
     parsedResponse.businesses[i].location.display_address
   }</span></div>
  </div>
  <div class="text-center">
  <div class="text">${categoriesUI}</div>
  <div class="text">${transactionUI}
 </div>
  </div>
</div>`;
      restaurantData.innerHTML = searchedRestaurant;
    }
  } catch (e) {
    console.log("Unable to call Filtered Restaurants Api");
  }
}

//Getting All Categories in Checkbox
async function allCategoriesForCheckbox(event, argsCategoryValue = []) {
  let checkboxhtmlCategories = "";
  CategoryData = argsCategoryValue;
  let options = {
    headers: {
      Authorization: `Bearer ${apiKey}`, // even a small space btwn token, = and <%= will break
      "Content-Type": "application/json",
    },
  };
  let allCategoriesResponse = await client.request.get(
    "https://api.yelp.com/v3/categories",
    options
  );
  let allRestaurantCategories = JSON.parse(allCategoriesResponse.response);
  if (CategoryData.length == 0) {
    const result = allRestaurantCategories.categories.filter(
      (item) => item.parent_aliases[0] === "restaurants"
    );
    CategoryData = result.map((item, index) => ({
      ...item,
      id: index + 100001,
      checked: false,
    }));
  }
  tempCategoryData = CategoryData;
  tempCategoryData = tempCategoryData.slice(0, 50);
  checkboxhtmlCategories = "";
  tempCategoryData.forEach((item) => {
    checkboxhtmlCategories += `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="" id="${item.id}"onclick="checkboxCategoriesEvent(${item.id})">
    <label class="form-check-label" for="flexCheckDefault">
      ${item.title}
    </label>
  </div>`;
  });
  document.getElementById("categoriesCheckbox").innerHTML =
    checkboxhtmlCategories;
}

//Event to check the checkbox of categories is clicked or not
function checkboxCategoriesEvent(id, display = true) {
  categoriesparams = [];
  categoriesparamsapi = [];
  let currentStatusCategories;
  if (display) {
    currentStatusCategories = document.getElementById(id).checked;
  } else {
    document.getElementById(id).checked = display;
  }
  CategoryData.forEach((item) => {
    if (item.id === id) {
      item.checked = display ? currentStatusCategories : display;
    }
    if (item.checked) {
      categoriesparams.push({ name: item.title, id: item.id });
      categoriesparamsapi.push(item.title);
    }
  });
}

async function init() {
  try {
    client = await app.initialized();
    client.events.on("app.activated", allCategoriesForCheckbox);
  } catch (e) {
    console.log(e);
  }
}
async function renderText() {
  try {
    const textElement = document.getElementById("apptext");
    const contactData = await client.data.get("contact");
    const {
      contact: { name },
    } = contactData;
  } catch (e) {
    console.log(e);
  }
}

//Stepper For The App
const changeStepper = function (stepper, direction) {
  if (direction == "next") {
    for (i = 1; i <= 6; i++) {
      if (i == stepper + 1) {
        document.getElementById(i).style.display = "block";
      } else {
        document.getElementById(i).style.display = "none";
      }
    }
  } else {
    for (i = 1; i <= 6; i++) {
      if (i == stepper - 1) {
        document.getElementById(i).style.display = "block";
      } else {
        document.getElementById(i).style.display = "none";
      }
    }
  }
};
init();
