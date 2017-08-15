$(function init() {
  initializeMap();
  setupOptions();
  let itinerary = new Itinerary;
  renderPage(itinerary);
});

function renderPage(itinerary) {
    // TODO
    // Clear the DOM. Use jQuery .empty()
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


    // attachEventHandlers();
}

function reset() {
  $(".itinerary-panel").empty();
}

function getItineraryHotel(itinerary) {
  let currentHotel = itinerary.days[itinerary.current_day].hotel;
  if (!currentHotel) return '';
  let baseHtml = `
  <div class="itinerary-item">
    <span class="title">${hotel.name}</span>
    <button class="btn btn-xs btn-danger remove btn-circle">x</button>
  </div>`;
  return baseHtml;
}
function getItineraryRestaurants(itinerary) { }
function getItineraryActivities(itinerary) { }

function getBasePanel() {
  return  `
    <h3>
      <span id="day-title">
        <span>Day 1</span>
        <button class="btn btn-xs btn-danger remove btn-circle">x</button>
      </span>
    </h3>
    <div class="panel panel-default">
      <div class="panel-heading day-button-panel">
        <div class="day-buttons">
          <button class="btn btn-circle day-btn" id="day-add">+</button>
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
          <ul class="list-group">
          </ul>
        </div>
        <div>
          <h4>My Activities</h4>
          <ul class="list-group">
          </ul>
        </div>
      </div>
    </div>
  `;


}

function attachEventHandlers() {
  /*
    - 3 buttons on options to select hotel, restaurant, activity
    - plus button to add a day
    - red X to remove current day
    - arbitrarily many red X to remove {hotel, restaurant, activities}
    - click on day to switch current day
  */
  $("select").change( function() {
    console.log(this.value);
  })
}



class Itinerary {

  constructor() {
    this.current_day = 0;
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
  // TODO: Add wrappers around the current day, so that itinerary can
  // call its methods
  // setHotel(hotel) {
  //   // TODO
  //   this.days[current_day].setHotel()
  // }
  // removeHotel() { this.hotel = null; }
  // addActivity(activity) { this.activities[activity.id] = activity; }
  // removeActivity(activityId) { delete this.activities[activityId]; }
  // addRestaurant(restaurant) { this.restaurants[restaurant.id] = restaurant; }
  // removeRestaurant(restaurantId) { delete this.restaurants[restaurantId]; }

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
  hotels.forEach( hotel => {
    $('#hotel-choices').append(`<option id="hotel-${hotel.id}">${hotel.name}</option>`);
  })
  restaurants.forEach( restaurant => {
    $('#restaurant-choices').append(`<option id="restaurant-${restaurant.id}">${restaurant.name}</option>`);
  })
  activities.forEach( activity => {
    $('#activity-choices').append(`<option id="activity-${activity.id}">${activity.name}</option>`);
  })
}

// initializeMap came with the boilerplate:
function initializeMap (){

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

    function drawMarker (type, coords) {
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
