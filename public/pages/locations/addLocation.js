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
  // Listen for form submit
  //document.getElementById('addLocationForm').addEventListener('submit', submitForm);
  
  // Submit form
  function submitForm(e){
    //e.preventDefault();
    //document.getElementById('addLocationForm').submit();
    // Get values
    var name = getInputVal('name');

    
    var longitude = parseFloat(getInputVal('longitude'));
    var latitude =parseFloat(getInputVal('latitude'));
    var direction = parseFloat(getInputVal('direction'));
    var description = getInputVal('description');
    //document.getElementById('addLocationForm').submit();

    // Save attraction
    saveAttraction(name,longitude, latitude, direction,description);
  
    // Show alert
   // document.querySelector('.alert').style.display = 'block';
  
    // Hide alert after 3 seconds
    setTimeout(function(){
      document.querySelector('.alert').style.display = 'none';
    },3000);
    alert(name + " has been added!");
    // Clear form
    document.getElementById('addLocationForm').reset();
  }
  
  // Function to get get form values
  function getInputVal(id){
    return document.getElementById(id).value;
  }
  
  // Save attractions to firebase
  function saveAttraction(name, longitude, latitude, direction,description){
   /* var newAttractionRef = attractionRef.push();
    newAttractionRef.set({
      name:name,
      longitude:longitude,
      latitude:latitude,
      direction:direction
    });*/
    
    db.collection("attraction").doc(name).set({
      created: firebase.firestore.FieldValue.serverTimestamp(),
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      
     //latitude: latitude,
     //longitude: longitude, 
      position: new firebase.firestore.GeoPoint(latitude,longitude),
      direction: direction,
      description: description
    }).then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }