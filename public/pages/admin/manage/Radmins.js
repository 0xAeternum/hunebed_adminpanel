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

// Get all admins
getAll();

var table = $('#adminTable').DataTable({
  "columnDefs": [ {
  "targets": -1,
  "data": null,
  "defaultContent": "<button class='btn-warning'>Edit</button>",
}]});

$('#adminTable tbody').on('click', 'button', function () {
  var data = table.row( $(this).parents('tr') ).data();
  alert('You will edit: ' + data[0]);
  sessionStorage.setItem('name',        data[0]);
  sessionStorage.setItem('title',       data[1]);
  sessionStorage.setItem('email',       data[2]);
  sessionStorage.setItem('password',    data[3]);
  sessionStorage.setItem('super_admin', data[5]);
  window.location.assign('admin-add.html');
});

function getAll() {
  db.collection("administrators").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(admin) {
      if(admin.data().active == true) {
        var deviceName = 'No device';
        if(admin.data().device) {
          deviceName = admin.data().device.id;
        }
        var adminTable = $('#adminTable').DataTable();
        adminTable.row.add([
          String(admin.data().name),
          String(admin.data().title),
          String(admin.data().email),
          String(admin.data().password),
          String(deviceName),
          String(admin.data().super_admin),
          null
        ]).draw();
      }
    });
  });
}