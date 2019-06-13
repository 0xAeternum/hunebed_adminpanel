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
 // var table =  null;
 
  function getAll(){
    //table =  $('#monumentsTable').DataTable();
    db.collection("attraction").where('active','==',true).onSnapshot(function(querySnapshot) {
      

      var table =  $('#monumentsTable').DataTable();
      table.rows().remove();
     
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        //var table = document.getElementById("monumentsTable");
        //console.log(doc.id);
        

        
        table.row.add([
          String(doc.id),
          String(doc.data().description),
          String(doc.data().position.latitude),
          String(doc.data().position.longitude),
          String(doc.data().direction),
          null
        ]).draw(); 


      });
     //var table =  $('#monumentsTable').DataTable();
     
  });
  
  }

  
