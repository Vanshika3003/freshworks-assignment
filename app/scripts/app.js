var client;
var buttonChecked;
let allCheckBox = document.querySelectorAll('#flexCheckDefault')
let checkboxhtmlPrices = ''
let checkboxhtmlCategories = ''
let checkboxhtmlFeatures = ''
let currentStatus
let currentStatusCategories
var data=[]
var CategoryData;
var inputText=''
var m='vanshika'
var businessCategories
var titleResponse
var autocompleteResponse
var location;
let apiKey = 'WXZwPIXGJf-OS-BO3J5GG3jbavcv-Up9wIfv-XEPCRG-QtzSreBmoRo60C0Ar7YpnBaRpdL01ulOckDQq2uzfXx0rhVRUJJRqrh6do8RFdzBUnELHa-wIui1hHsSY3Yx'
// let categories = [
//   { id: 201, name: 'American', checked: false },
//   { id: 202, name: 'Afghan', checked: false },
//   { id: 203, name: 'African', checked: false },
//   { id: 204, name: 'Arabic', checked: false },
//   { id: 205, name: 'Bulgarian', checked: false },
//   { id: 206, name: 'Canadian', checked: false },
//   { id: 207, name: 'Chinese', checked: false },
//   { id: 208, name: 'Dumplings', checked: false },
//   { id: 209, name: 'French', checked: false },
// ]
var categories;
//Price Checkbox List
let prices = [{ id: 101, name: '$', checked: false, value: '1' }, { id: 102, name: '$$', checked: false, value: '2' },
{ id: 103, name: '$$$', checked: false, value: '3' },]
let addFeatures = [{
  id: 11, name: 'Hot New', checked: false, value: 'hot_and_new'
}, { id: 12, name: 'Open to all', checked: false, value: 'open_to_all' },
{ id: 13, name: 'Request A Note', checked: false, value: 'request_a_quote' }]
prices.forEach(item => {
  checkboxhtmlPrices += `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="${item.value}" id="${item.id}"onclick="checkboxPriceEvent(${item.id})">
    <label class="form-check-label" for="flexCheckDefault">
    ${item.name}
    </label>
    </div>`
})

document.getElementById('selectedPriceCheckbox').innerHTML = checkboxhtmlPrices;

function checkboxPriceEvent(id) {
  priceParams = []
  priceChecked = ''
  currentStatus = document.getElementById(id).checked;
  prices.forEach(item => {
    if (item.id == id) {
      item.checked = currentStatus;
    }
    if (item.checked) {
      priceParams.push(item.value)
    }
  })
  priceChecked = priceParams.toString();
}

addFeatures.forEach(item => {
  checkboxhtmlFeatures += `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="${item.value}" id="${item.id}"onclick="checkboxFeaturesEvent(${item.id})">
    <label class="form-check-label" for="flexCheckDefault">
    ${item.name}
    </label>
    </div>`
})

document.getElementById('selectedAdditionalFeatures').innerHTML = checkboxhtmlFeatures;

function checkboxFeaturesEvent(id) {
  featureParams = []
  featureChecked = ''
  currentFeatureStatus = document.getElementById(id).checked;
  prices.forEach(item => {
    if (item.id == id) {
      item.checked = currentFeatureStatus;
    }
    if (item.checked) {
      featureParams.push(item.value)
    }
  })
  featureChecked = featureParams.toString();
}

console.log("glovalll",m)
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      suggestedChecked = event.target.value;
      console.log(suggestedChecked)
    }
  })
})
//Categories Checkbox List
// categories.forEach(item => {
//   checkboxhtmlCategories += `<div class="form-check">
//   <input class="form-check-input" type="checkbox" value="" id="${item.id}"onclick="checkboxCategoriesEvent(${item.id})">
//   <label class="form-check-label" for="flexCheckDefault">
//     ${item.name}
//   </label>
// </div>`
// })
// document.getElementById('categoriesCheckbox').innerHTML = checkboxhtmlCategories

function searchCategory()
{
  console.log("hiii")
  inputText=document.getElementById('multiselect').value ;
  console.log("inputText",inputText)
  if(inputText.length==0)
  {
   allCategories({},[]);
  }
  else{
    searchCategoryApi(inputText)

  }
}

async function searchCategoryApi(inputText) {

  let options = {
    headers: {
      Authorization: "Bearer WXZwPIXGJf-OS-BO3J5GG3jbavcv-Up9wIfv-XEPCRG-QtzSreBmoRo60C0Ar7YpnBaRpdL01ulOckDQq2uzfXx0rhVRUJJRqrh6do8RFdzBUnELHa-wIui1hHsSY3Yx", // even a small space btwn token, = and <%= will break
      'Content-Type': 'application/json'
    },
  };
  
let autocompleteResponse= await client.request.get('https://api.yelp.com/v3/autocomplete'+'?'+'text='+`${inputText}`, options);
let categoryArray=JSON.parse(autocompleteResponse.response).categories;
let map1 = categoryArray.map((item, index) => ({ ...item, id: index + 100001, checked: false }));
  data=map1;
  allCategories({},data);
 console.log("dat12",data);

}
console.log("window.text",data)

//Getting All Params on submitting filters
function submit() {
  let payload = {
    categories: categoriesparamsapi.toString(),
    open_now: suggestedChecked,
    price: priceChecked,
    attributes: featureChecked,
   // longitude: -122.407821655273,
    //latitude: 37.7983818054199,
    location: "Canada"

  }
  console.log("pah",payload)
  const new_params = new URLSearchParams([
    ...Object.entries(payload),
  ]).toString();
  console.log(new_params);
  filteredRestaurants(new_params);

}

async function filteredRestaurants(new_params) {
  let searchedRestaurant = ''
  let options = {
    headers: {
      Authorization: "Bearer WXZwPIXGJf-OS-BO3J5GG3jbavcv-Up9wIfv-XEPCRG-QtzSreBmoRo60C0Ar7YpnBaRpdL01ulOckDQq2uzfXx0rhVRUJJRqrh6do8RFdzBUnELHa-wIui1hHsSY3Yx", // even a small space btwn token, = and <%= will break
      'Content-Type': 'application/json'
    },
  };
  let allRestaurants = await client.request.get('https://api.yelp.com/v3/businesses/search' + '?' + new_params, options);
  const restaurantData = document.getElementById('restaurantData');
  const parsedResponse = JSON.parse(allRestaurants.response);
  for (let i = 0; i < parsedResponse.businesses.length; i++) {
   businessCategories= (parsedResponse.businesses[i].categories)
   console.log("businessCategories",businessCategories)
   titleResponse=JSON.stringify(businessCategories);
    searchedRestaurant += ` <div class="border column">
   <div class=" p-3" >
     <img src="${parsedResponse.businesses[i].image_url}" style="max-width: 155px;height: 170px; "  class="rounded mx-auto d-block" alt="">
   </div>
  <div class="text-center">
     <b>${parsedResponse.businesses[i].name} | ${parsedResponse.businesses[i].price}</b>
      </div>
     <div class="text-center">
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
     <span class="fa fa-star checked"></span>
     <span class="fa fa-star"></span>
     <span class="fa fa-star"></span>&nbsp;
      <span>${parsedResponse.businesses[i].review_count}</span>
   </div>
   <div class="text-center">
   <span>${Math.round(parsedResponse.businesses[i].distance)}miles away</span>
  </div>
  <div class="text-center">
   <span>${parsedResponse.businesses[i].location.display_address}</span>
  </div>
  <div class="text-center">
  <div class="text">
  ${JSON.stringify(businessCategories[0].title)}
  ${businessCategories.forEach((element) => `<span class="border p-1 text-center text-muted bg-light"><small>${element.title}</small> </span>&nbsp;`)}
  </div>
  <div class="text"><span class="icon">&#9989;</span><small>&nbsp;Delivery</small>
   <span class="icon">&#9989;</span><small>&nbsp;Delivery</small>
 </div>

  </div>
</div>`
    restaurantData.innerHTML = searchedRestaurant;
  }

}
async function allCategories(event,argsCategoryValue=[]) {
  CategoryData=argsCategoryValue
  console.log(">>>>>>>>>>>>>>> Check 1",CategoryData);
  let options = {
    headers: {
      Authorization: "Bearer WXZwPIXGJf-OS-BO3J5GG3jbavcv-Up9wIfv-XEPCRG-QtzSreBmoRo60C0Ar7YpnBaRpdL01ulOckDQq2uzfXx0rhVRUJJRqrh6do8RFdzBUnELHa-wIui1hHsSY3Yx", // even a small space btwn token, = and <%= will break
      'Content-Type': 'application/json'
    },
  };
  let allCategoriesRes = await client.request.get('https://api.yelp.com/v3/categories', options);
  let allRestaurantCategories = JSON.parse(allCategoriesRes.response)
  if(CategoryData.length==0){
    const result = allRestaurantCategories.categories.filter(item => item.parent_aliases[0] === 'restaurants');
    CategoryData = result.map((item, index) => ({ ...item, id: index + 100001, checked: false }))
  }
  tempCategoryData=CategoryData
  tempCategoryData=tempCategoryData.slice(0,5)
  console.log("datavk",CategoryData)
  checkboxhtmlCategories=''
  tempCategoryData.forEach(item => {
    checkboxhtmlCategories += `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="" id="${item.id}"onclick="checkboxCategoriesEvent(${item.id})">
    <label class="form-check-label" for="flexCheckDefault">
      ${item.title}
    </label>
  </div>`
  })
  document.getElementById('categoriesCheckbox').innerHTML = checkboxhtmlCategories
  console.log(data);
}

function checkboxCategoriesEvent(id, display = true) {
  console.log(">>>>>>>>>>>>> 2",id)
  categoriesparams = []
  categoriesparamsapi = []
  if (display) {
    currentStatusCategories = document.getElementById(id).checked;
    console.log("curr", document.getElementById(id).checked);
  }
  else {
    document.getElementById(id).checked = display;
    console.log("display", display);
  }
  CategoryData.forEach(item => {
    console.log(">>>>>>>>>> 4",item);
    if (item.id === id) {
      console.log("yes");
      item.checked = display ? currentStatusCategories : display;
    }
    if (item.checked) {
      console.log("no");
      categoriesparams.push({ name: item.title, id: item.id });
      categoriesparamsapi.push(item.title);
    }
console.log(">>>>>>>>>> 5",item)
  })
  console.log(">>>>>> 3",categoriesparamsapi)
console.log("categoriesparams",categoriesparams)
  let selectedCategories = ''
  categoriesparams.forEach(item => {
    selectedCategories += `<button type="button" class="btn btn-primary col-sm-3 col-md-2 m-1" onclick="checkboxCategoriesEvent(${item.id},false)" >${item.name}<span class="badge bg-secondary">X</span></button>`
  })

  //document.getElementById('selectedCategories').innerHTML = selectedCategories;
}

//allCategories()


async function init() {
  client = await app.initialized();
  $(document).ready(function () {
    $('.dropdown-menu button').on('click', function () {
      var txt= ($(this).text());
      location=txt;
    });
  });
  //client.events.on('app.activated', renderText);
  client.events.on('app.activated', allCategories);

}

async function renderText() {
  const textElement = document.getElementById('apptext');
  const contactData = await client.data.get('contact');
  const {
    contact: { name }
  } = contactData;
}



init();
