// Initialize Firebase
var config = {
  apiKey: "AIzaSyC37ynDc3SyuxzwDcQLWs3luTbfz-MLSfw",
  authDomain: "fir-test-c91f4.firebaseapp.com",
  databaseURL: "https://fir-test-c91f4.firebaseio.com",
  projectId: "fir-test-c91f4",
  storageBucket: "fir-test-c91f4.appspot.com",
  messagingSenderId: "231032087489",
  appId: "1:231032087489:web:37267e6ec937a3e6"
};

firebase.initializeApp(config);
var db = firebase.firestore();

// Get all attractions
getAll();

var table = $('#attractionTable').DataTable({
  "columnDefs": [{
    "targets": -1,
    "data": null,
    "defaultContent": "<button class='btn-warning'>Edit</button>",
  }, {
    "targets": [4],
    "visible": false
  }]});

$('#attractionTable tbody').on( 'click', 'button', function () {
  var data = table.row($(this).parents('tr')).data();
  alert('You will edit: ' +               data[0]);
  sessionStorage.setItem('title',         data[0]);
  sessionStorage.setItem('description',   data[1]);
  sessionStorage.setItem('latitude',      data[2]);
  sessionStorage.setItem('longitude',     data[3]);
  sessionStorage.setItem('attraction_id', data[4]);
  window.location.assign('attraction-add.html');
} );

function getAll() {
  db.collection("attraction").where('active', '==', true).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(attraction) {
        var attractionTable =  $('#attractionTable').DataTable();
        attractionTable.row.add([
          String(attraction.data().title),
          String(attraction.data().description),
          String(attraction.data().geopoint.latitude),
          String(attraction.data().geopoint.longitude),
          String(attraction.id),
          null
        ]).draw(); 
      })
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
}

  
