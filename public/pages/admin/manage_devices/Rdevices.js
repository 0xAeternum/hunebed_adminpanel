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
  
var table = $('#deviceTable').DataTable({
  "columnDefs": [ {
  "targets": -1,
  "data": null,
  "defaultContent": "<button class='btn-warning'>Edit</button>",
}]});

$('#deviceTable tbody').on('click', 'button', function () {
  var data = table.row( $(this).parents('tr') ).data();
  alert('You will edit: ' + data[0]);
  sessionStorage.setItem('name',        data[0]);
  sessionStorage.setItem('user',        data[1]);
  sessionStorage.setItem('mac_address', data[2]);
  window.location.assign('device-add.html');
});

function getAll(){
  db.collection("administrators").get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(admin) {
        if(admin.data().device) {
          db.collection("device").doc(admin.data().device.id).get()
            .then(function(device) {
              if(device.data().active == true) { 
                var deviceTable = $('#deviceTable').DataTable();
                deviceTable.row.add([
                  String(device.data().name),
                  String(admin.data().name),
                  String(device.data().mac_address),
                  null
                ]).draw();
              }
            })
            .catch(function(error) {
              console.log("Error getting documents: ", error);
            });
          }
        });
      })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
}