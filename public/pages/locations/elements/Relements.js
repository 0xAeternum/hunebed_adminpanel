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

// Get all devices
getAll();
  
var table = $('#storiesTable').DataTable({
  "columnDefs": [ {
    "targets": -1,
    "data": null,
    "defaultContent": "<button class='btn-warning'>Edit</button>",
  }, {
    "targets": [4, 5],
    "visible": false
  }]});

$('#storiesTable tbody').on('click', 'button', function () {
  var data = table.row( $(this).parents('tr') ).data();
  alert('You will edit the story for: ' + data[0]);
  sessionStorage.setItem('text',          data[1]);
  sessionStorage.setItem('latitude',      data[2]);
  sessionStorage.setItem('longitude',     data[3]);
  sessionStorage.setItem('story_id',      data[4]);
  sessionStorage.setItem('attraction_id', data[5]);
  window.location.assign('element-add.html');
});

function getAll(){
  db.collection("attraction").where('active', '==', true).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(attraction) {
        db.collection("attraction/" + attraction.id + "/element").where('active', '==', true).get()
          .then(function(querySnapshot1) {
            querySnapshot1.forEach(function(story) {
              var storiesTable =  $('#storiesTable').DataTable();
              var text = "Story contains only an image.";
              if(story.data().text) text = story.data().text;
              storiesTable.row.add([
                String(attraction.data().title),
                String(text),
                String(story.data().geopoint.latitude),
                String(story.data().geopoint.longitude),
                String(story.id),
                String(attraction.id),
                null
              ]).draw(); 
            })
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });
      })
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
}