$(function init() {
    initializeMap();
    setupOptions();
    let itinerary = new Itinerary;
    // renderPage(itinerary);
});

function renderPage(itinerary) {
    reset();

    // Redraw the DOM
    const removeDayBtn = `<button class="btn btn-xs btn-danger remove btn-circle">x</button>`;
    const itineraryItem = `
    <div class="itinerary-item">
      <span class="title">Wyndham Grand Chicago Riverfront</span>
      <button class="btn btn-xs btn-danger remove btn-circle">x</button>
    </div>`;
    $('.itinerary-panel').html(getBasePanel());
    $('.current-hotel').html(getItineraryHotel(itinerary));
    $('.day-buttons').html(getItineraryDays(itinerary));
    $('#day-title').html(getDayTitle(itinerary));
    $('.restaurant-list').html(getItineraryRestaurants(itinerary));
    $('.activities-list').html(getItineraryActivities(itinerary));

    attachEventHandlers(itinerary);
}



function reset() {
    $(".itinerary-panel").empty();
}

function getDayTitle(itinerary) {
    return `<span>Day ${itinerary.current_day+1}</span>
   <button class="btn btn-xs btn-danger remove btn-circle">x</button>`;
}

function getItineraryDays(itinerary) {
    let days = '';
    for (let i = 0; i < itinerary.days.length; i++) {
        let current_day = '';
        if (i === itinerary.current_day) {
            current_day = 'current-day';
        }
        days += `<button class="btn btn-circle day-btn ${current_day}">${i+1}</button>`;
    }
    return days + '<button class="btn btn-circle day-btn" id="day-add">+</button>';
}

function getItineraryHotel(itinerary) {
    let currentHotel = itinerary.days[itinerary.current_day].hotel;
    if (!currentHotel) return '';
    let html = `
  <div class="itinerary-item">
    <span class="title">${currentHotel.name}</span>
    <button class="btn btn-xs btn-danger remove btn-circle btn-remove-hotel" data-hotelId=${currentHotel.id}>x</button>
  </div>`;
    return html;
}

function getItineraryRestaurants(itinerary) {
    let html = '';
    let restaurants = itinerary.currentRestaurants();
    for (let key in restaurants) {
        html += `
    <div class="itinerary-item">
      <span class="title">${restaurants[key].name}</span>
      <button class="btn btn-xs btn-danger remove btn-circle btn-remove-restaurant" data-restaurantId=${restaurants[key].id}>x</button>
    </div>`;
    }
    return html;
}

function getItineraryActivities(itinerary) {
    let html = '';
    let activities = itinerary.currentActivities();
    for (let key in activities) {
        html += `
    <div class="itinerary-item">
      <span class="title">${activities[key].name}</span>
      <button class="btn btn-xs btn-danger remove btn-circle btn-remove-activity" data-activityId=${activities[key].id}>x</button>
    </div>`;
    }
    return html;
}

function getBasePanel() {
    return `
    <h3>
      <span id="day-title">
      </span>
    </h3>
    <div class="panel panel-default">
      <div class="panel-heading day-button-panel">
        <div class="day-buttons">
        </div>
      </div>
      <div class="panel-body" id="itinerary">
        <div>
          <h4>My Hotel</h4>
          <ul class="list-group current-hotel">
          </ul>
        </div>
        <div>
          <h4>My Restaurants</h4>
          <ul class="list-group restaurant-list">
          </ul>
        </div>
        <div>
          <h4>My Activities</h4>
          <ul class="list-group activities-list">
          </ul>
        </div>
      </div>
    </div>
  `;


}

function attachEventHandlers(itinerary) {
    /*
      - 3 buttons on options to select hotel, restaurant, activity
      - plus button to add a day
      - red X to remove current day
      - arbitrarily many red X to remove {hotel, restaurant, activities}
      - click on day to switch current day
    */
   // Add handlers to (+) buttons
   $(".btn-set-hotel").click( () => {
    let hotelName = $("#hotel-choices").val();
    itinerary.currentDay().setHotel(findByName(hotelName,hotels));
    renderPage(itinerary);
   })
   $(".btn-add-restaurant").click( () => {
    let restaurantName = $("#restaurant-choices").val();
    itinerary.currentDay().addRestaurant(findByName(restaurantName,restaurants));
    renderPage(itinerary);
   })
   $(".btn-add-activity").click( () => {
    let activityName = $("#activity-choices").val();
    itinerary.currentDay().addActivity(findByName(activityName,activities));
    renderPage(itinerary);
   })

   // Add handlers to itinerary (x) buttons
   $(".btn-remove-hotel").click( (event) => {
    itinerary.currentDay().removeHotel();
    renderPage(itinerary);
   })

   $(".btn-remove-restaurant").click( (event) => {
    let id = $(event.target).data().restaurantid;
    itinerary.currentDay().removeRestaurant(id);
    renderPage(itinerary);
   })

   $(".btn-remove-activity").click( (event) => {
    let id = $(event.target).data().activityid;
    itinerary.currentDay().removeActivity(id);
    renderPage(itinerary);
   })
}

function findByName(name,arr){
    for(let i=0; i<arr.length; i++){
        let curObj = arr[i];
        if( curObj.name === name)
            return curObj;
    }
}


class Itinerary {

    constructor() {
        this.current_day = 0; // Index of current day
        this.days = [];
        this.days.push(new Day);
    }

    addDay() { this.days.push(new Day); }
    removeDay(idx) {
        if (this.days.length <= 1) return;
        this.days.splice(idx, 1);
        if (this.current_day > 0) {
            this.current_day--;
        }
    }
    switchDays(newDayIdx) { this.current_day = newDayIdx; }
    currentDay() { return this.days[this.current_day]; }
    currentHotel() { return this.currentDay().hotel; }
    currentRestaurants() { return this.currentDay().restaurants; }
    currentActivities() { return this.currentDay().activities; }
}

class Day {

    constructor() {
        this.hotel = null;
        this.restaurants = {};
        this.activities = {};
    }

    setHotel(hotel) { this.hotel = hotel; }
    removeHotel() { this.hotel = null; }
    addActivity(activity) { this.activities[activity.id] = activity; }
    removeActivity(activityId) { delete this.activities[activityId]; }
    addRestaurant(restaurant) { this.restaurants[restaurant.id] = restaurant; }
    removeRestaurant(restaurantId) { delete this.restaurants[restaurantId]; }

}

function setupOptions() {
    hotels.forEach(hotel => {
        $('#hotel-choices').append(`<option id="hotel-${hotel.id}">${hotel.name}</option>`);
    })
    restaurants.forEach(restaurant => {
        $('#restaurant-choices').append(`<option id="restaurant-${restaurant.id}">${restaurant.name}</option>`);
    })
    activities.forEach(activity => {
        $('#activity-choices').append(`<option id="activity-${activity.id}">${activity.name}</option>`);
    })
}

// initializeMap came with the boilerplate:
function initializeMap() {

    var fullstackAcademy = new google.maps.LatLng(41.8884073, -87.6293817);

    var styleArr = [{
        featureType: 'landscape',
        stylers: [{ saturation: -100 }, { lightness: 60 }]
    }, {
        featureType: 'road.local',
        stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
    }, {
        featureType: 'transit',
        stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
    }, {
        featureType: 'administrative.province',
        stylers: [{ visibility: 'off' }]
    }, {
        featureType: 'water',
        stylers: [{ visibility: 'on' }, { lightness: 30 }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ visibility: 'off' }]
    }, {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
    }];

    var mapCanvas = document.getElementById('map-canvas');

    var currentMap = new google.maps.Map(mapCanvas, {
        center: fullstackAcademy,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: styleArr
    });

    var iconURLs = {
        hotel: '/images/lodging_0star.png',
        restaurant: '/images/restaurant.png',
        activity: '/images/star-3.png'
    };

    function drawMarker(type, coords) {
        var latLng = new google.maps.LatLng(coords[0], coords[1]);
        var iconURL = iconURLs[type];
        var marker = new google.maps.Marker({
            icon: iconURL,
            position: latLng
        });
        marker.setMap(currentMap);
    }

    drawMarker('hotel', [41.8884073, -87.6293817]);
    drawMarker('restaurant', [41.9134555, -87.6503527]);
    drawMarker('activity', [41.8675766, -87.6162267])
}
