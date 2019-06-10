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

function getAll(){
  db.collection("administrators").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var table =  $('#adminTable').DataTable();
      
      if(doc.data().active == true) {
        table.row.add([
          String(doc.data().name),
          String(doc.data().title),
          String(doc.data().email),
          String(doc.data().password),
          String(doc.data().super_admin),
          null
        ]).draw();
      }
    });
  });
}