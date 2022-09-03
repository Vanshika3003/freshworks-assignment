var client;
var buttonChecked;
init();

async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderText);
}

async function renderText() {
  const textElement = document.getElementById('apptext');
  const contactData = await client.data.get('contact');
  const {
    contact: { name }
  } = contactData;
}
let allCheckBox = document.querySelectorAll('#flexCheckDefault')

let categories=[{id:201,name:'American',checked:false},
            {id:202,name:'Afghan',checked:false},
            {id:203,name:'African',checked:false},
            {id:204,name:'Arabic',checked:false},
            {id:205,name:'Bulgarian',checked:false},
            {id:206,name:'Canadian',checked:false},
            {id:207,name:'Chinese',checked:false},
            {id:208,name:'Dumplings',checked:false},
            {id:209,name:'French',checked:false},
            
            ]
let filters=[{id:101,name:'$',checked:false,value:'1'},{id:102,name:'$$',checked:false,value:'2'},
            {id:103,name:'$$$',checked:false,value:'3'}, ]

let checkboxhtml=''
filters.forEach(item=>{
  checkboxhtml+=`
  <div class="form-check">
  <input class="form-check-input" type="checkbox" value="${item.value}" id="${item.id}"onclick="checkboxPriceEvent(${item.id})">
  <label class="form-check-label" for="flexCheckDefault">
    ${item.name}
  </label>
</div>`
})

document.getElementById('filterCheckbox').innerHTML=checkboxhtml
function checkboxPriceEvent(id){
 filterparams=[]
 buttonChecked=''
 currentStatus=document.getElementById(id).checked;
 filters.forEach(item=>{
   if(item.id==id)
     {
       item.checked=currentStatus;
     }
   if(item.checked)
     {
       filterparams.push(item.value)
     }
 })
  
  console.log("yesss")
  buttonChecked=filterparams.toString()
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      suggestedChecked = event.target.value;
      console.log(suggestedChecked)
    }
  })
})
let checkboxhtmlCategories=''
categories.forEach(item=>{
  checkboxhtmlCategories+=`
  <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="${item.id}"onclick="checkboxEvent(${item.id})">
  <label class="form-check-label" for="flexCheckDefault">
    ${item.name}
  </label>
</div>`
})
document.getElementById('categoriesCheckbox').innerHTML=checkboxhtmlCategories


function checkboxEvent(id,display=true){
 categoriesparams=[]
 categoriesparamsapi=[]
 if(display){
 currentStatus=document.getElementById(id).checked;
 }
  else{
    document.getElementById(id).checked=display
  }
  categories.forEach(item=>{
   if(item.id==id)
     {
       item.checked=display?currentStatus:display;
     }
   if(item.checked)
     {
       categoriesparams.push({name:item.name,id:item.id})
       categoriesparamsapi.push(item.name)

     }
     console.log("categoriesparams",categoriesparams)
 })
  
  let selectedItem=''
  categoriesparams.forEach(item=>{
    console.log("items",item.name);
    selectedItem+=`<button type="button" class="btn btn-primary col-sm-3 col-md-2 m-1" onclick="checkboxEvent(${item.id},false)" >${item.name}<span class="badge bg-secondary">X</span></button>`
  })
  
document.getElementById('selectedItem').innerHTML=selectedItem
  
}


function searchCategory()
{
  
}


function submit() {
  let payload = {
    categories: categoriesparamsapi.toString(),
    open_now: suggestedChecked,
    price: buttonChecked,
    longitude: -122.42820739746094,
    latitude: 37.767413217936834,
    location: 'Ohio'

  }
  console.log("payload", payload)
  const new_params = new URLSearchParams([
    ...Object.entries(payload), // [["c","a"],["d","2"],["e","false"]]
  ]).toString();
  console.log(new_params);
  // a=hello&b=world&c=a&d=2&e=false
  filteredData(new_params);

}

async function filteredData(new_params) {
  let options = {
    headers: {
      Authorization: "Bearer WXZwPIXGJf-OS-BO3J5GG3jbavcv-Up9wIfv-XEPCRG-QtzSreBmoRo60C0Ar7YpnBaRpdL01ulOckDQq2uzfXx0rhVRUJJRqrh6do8RFdzBUnELHa-wIui1hHsSY3Yx", // even a small space btwn token, = and <%= will break
      'Content-Type': 'application/json'
    },
    // parameters:{
    // ...payload
    // }
  };

  // let headers={"Authorization":"Bearer WXZwPIXGJf-OS-BO3J5GG3jbavcv-Up9wIfv-XEPCRG-QtzSreBmoRo60C0Ar7YpnBaRpdL01ulOckDQq2uzfXx0rhVRUJJRqrh6do8RFdzBUnELHa-wIui1hHsSY3Yx"}
  //let options = { client: true };
  // let comicPayload = await client.request.get('https://api.yelp.com/v3/businesses/search?longitude= -122.42820739746094&latitude=37.767413217936834&location=375 Valencia St&price=1&categories=seafood&open_now=true', options);
  let comicPayload = await client.request.get('https://api.yelp.com/v3/businesses/search' + '?' + new_params, options);

  console.log("second", JSON.parse(comicPayload.response))
  //const res=JSON.parse(comicPayload.response.businesses)
  const restaurantName = document.getElementById('restaurantName');
  let searchedRestaurant = ''
  const res = JSON.parse(comicPayload.response);
  console.log("tesss", res.businesses.length);
  for (let i = 0; i < res.businesses.length; i++) {
    console.log("iiii", res.businesses[i].name)
    searchedRestaurant += ` <div class="border column">
   <div class=" p-3" >
     <img src="${res.businesses[i].image_url}" style="max-width: 155px;height: 170px; "  class="rounded mx-auto d-block" alt="">
   </div>
  <div class="text-center">
     <b>${res.businesses[i].name} | ${res.businesses[i].price}</b>
      </div>
     <div class="text-center">
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
     <span class="fa fa-star checked"></span>
     <span class="fa fa-star"></span>
     <span class="fa fa-star"></span>&nbsp;
      <span>${res.businesses[i].review_count}</span>
   </div>
   <div class="text-center">
   <span>${res.businesses[i].distance}km away</span>
  </div>
  <div class="text-center">
   <span>${res.businesses[i].location.display_address}</span>
  </div>
  <div class="text-center">
  <div class="text">
   <span class="border p-1 text-center text-muted bg-light"><small>Diners</small> </span>&nbsp;
   <span class="border p-1 text-center text-muted bg-light"><small>Diners</small> </span> &nbsp;
    <span class="border p-1 text-center text-muted bg-light"><small>Diners</small> </span>
  </div>
  <div class="text"><span class="icon">&#9989;</span><small>&nbsp;Delivery</small>
   <span class="icon">&#9989;</span><small>&nbsp;Delivery</small>
 </div>

  </div>
</div>`
    restaurantName.innerHTML = searchedRestaurant;

  }


}

