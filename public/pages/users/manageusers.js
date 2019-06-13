 
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
 // Reference users collection
 // var usersRef = firebase.database().ref('users');
  var db = firebase.firestore();
 // var table =  null;
  function getAll(status){
    //table =  $('#monumentsTable').DataTable();
    db.collection("users").where("status", "==", status).onSnapshot(function(querySnapshot) {
      
     
      

      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        //var table = document.getElementById("monumentsTable");
        //console.log(doc.id);
        var table =  $('#usersTable').DataTable();

        
        table.row.add([
         
          String(doc.data().username),
          null,
          null,
          null,
          null
        ]).draw(); 

       

      });
    
      
  });
 
  }
  function blockUser(name,blocked){
    /* var newusersRef = usersRef.push();
     newusersRef.set({
       name:name,
       longitude:longitude,
       latitude:latitude,
       direction:direction
     });*/
     db.collection("users").where("username", "==", name)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        db.collection("users").doc(doc.id).set({
        created: firebase.firestore.FieldValue.serverTimestamp(),
        updated: firebase.firestore.FieldValue.serverTimestamp(),

        username: name,
        status: blocked
        }).then(function() {
          //console.log("Document successfully written!");
          location.reload();

        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
      });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

   }

  
