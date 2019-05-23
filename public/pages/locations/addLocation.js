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
    var longitude = getInputVal('longitude');
    var latitude = getInputVal('latitude');
    var direction = getInputVal('direction');
    document.getElementById('addLocationForm').submit();

    // Save attraction
    saveAttraction(name, longitude, latitude, direction);
  
    // Show alert
    document.querySelector('.alert').style.display = 'block';
  
    // Hide alert after 3 seconds
    setTimeout(function(){
      document.querySelector('.alert').style.display = 'none';
    },3000);
  
    // Clear form
    document.getElementById('addLocationForm').reset();
  }
  
  // Function to get get form values
  function getInputVal(id){
    return document.getElementById(id).value;
  }
  
  // Save attractions to firebase
  function saveAttraction(name, longitude, latitude, direction){
   /* var newAttractionRef = attractionRef.push();
    newAttractionRef.set({
      name:name,
      longitude:longitude,
      latitude:latitude,
      direction:direction
    });*/

    db.collection("attraction").add({
      name:name,
      longitude:longitude,
      latitude:latitude,//position: new firebase.firestore.GeoPoint(latitude, longitude),
      direction:direction
    }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
  }