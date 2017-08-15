let itin = new Itinerary;
testItinDays();

function testItinDays() {
  for (let i=1; i<6; i++) {
    itin.addDay();
    itin.days[i-1].id = i-1;
  }
}

console.log('itin: ', itin);
