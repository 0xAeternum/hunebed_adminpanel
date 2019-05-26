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
  
  // Reference attraction collection
 // var attractionRef = firebase.database().ref('attraction');
  var db = firebase.firestore();

  function getAttraction(){
   
  }
  function getAll(){
    
    db.collection("attraction").get().then(function(querySnapshot) {
      
      var table =  $('#monumentsTable').DataTable();
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          //var table = document.getElementById("monumentsTable");
          console.log(doc.data());
          table.row.add([
            String(doc.data().name),
            String(doc.data().description),
            String(doc.data().position),
            String(doc.data().direction)
          ]).draw(); 
          /*
          var row = table.insertRow(1);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          cell1.innerHTML = doc.data().name;
          cell2.innerHTML = doc.data().description;
          cell3.innerHTML = doc.data().position;
          cell4.innerHTML = doc.data().direction;
         */
      });
     //var table =  $('#monumentsTable').DataTable();
      
  });
  }
  
