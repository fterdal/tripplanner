let itinerary = new Itinerary;
itinerary.addDay();
itinerary.current_day = 0;
itinerary.addDay();
itinerary.days[0].addActivity(activities[0]);
itinerary.days[0].addActivity(activities[1]);
itinerary.days[0].setHotel(hotels[0]);
itinerary.days[0].addRestaurant(restaurants[0]);
itinerary.days[0].addRestaurant(restaurants[1]);
renderPage(itinerary);
