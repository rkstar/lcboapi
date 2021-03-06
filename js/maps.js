const Maps = {
  ready: false,
  apiKey: 'AIzaSyDQim_BuQXu5WX-WazQhxq444Duma07CbE',
  map: null,

  initMap: function(){
    const options = {
      center: {
        lat: parseFloat(RED.latitude),
        lng: parseFloat(RED.longitude),
      },
      zoom: 14
    };
    this.map = new google.maps.Map(document.getElementById('map'), options);
    this.ready = true;
  },

  getCoords: function(address, callback){
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ "address": address }, callback);
  },
};
