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
//var storage = firebase.storage();
//var ref = storage.ref();

// Populate attractions and check session for preloaded data
populateAttractions();


// Submit form
function submitForm(e) {
  // Get values
  var attraction_id = getInputVal('attraction');
  var text          = getInputVal('text');
  var longitude     = parseFloat(getInputVal('longitude'));
  var latitude      = parseFloat(getInputVal('latitude'));

  // Save story
  saveStory(text, longitude, latitude, attraction_id);
  //uploadFile();
  // Show alert
  alert("Story has been added!");
}

// Update form
async function updateForm(e) {
  // Get values
  var story_id      = getInputVal('story_id');
  var attraction_id = getInputVal('attraction');
  var text          = getInputVal('text');
  var longitude     = parseFloat(getInputVal('longitude'));
  var latitude      = parseFloat(getInputVal('latitude'));

  // Update story
  updateStory(story_id, text, longitude, latitude, attraction_id);
  //uploadFile();
  // Show alert
  alert("Story has been updated!");
}

// Delete input
function deleteInput() {
  if (confirm("Are you sure you want to delete the story?")) {
    var attraction_id = getInputVal('attraction');
    var story_id      = getInputVal('story_id');
    console.log(attraction_id + " " + story_id);
    db.doc('attraction/' + attraction_id + '/element/' + story_id).update({
      active: false
    })
    .then(function() {
      alert("Story has been deleted!");
      // Clear form
      clearForm();
    })
    .catch(function(error) {
        console.error("Error deleting attraction: ", error);
    });
  } else {
    //alert("Cancelled.");
  }
}

// Update story in firebase
async function updateStory(story_id, text, longitude, latitude, attraction_id) {
  await db.collection('attraction').doc(attraction_id).collection('element').doc(story_id).update({
    text: text,
    geopoint: new firebase.firestore.GeoPoint(latitude, longitude)
  })
  .then(function() {
    // Clear form
    clearForm();
    //console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error saving changes: ", error);
  });
}

// Save story to firebase
async function saveStory(text, longitude, latitude, attraction_id) {
  await db.collection('attraction/' + attraction_id + '/element').add({
    text: text,
    geopoint: new firebase.firestore.GeoPoint(latitude, longitude)
  })
  .then(function() {
    // Clear form
    clearForm();
    //console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });
  
}

// Function to get values form inputs
function getInputVal(field_id) {
  return document.getElementById(field_id).value;
}

// File uploading
function uploadFile() {
  const file = $('#InputFile').get(0).files[0];
  const fileName = (+new Date()) + '-' + file.name + '-' + name;
  //const task = ref.child(fileName).put(file, metadata);
}

// Clear form after update / delete
function clearForm() {
  document.getElementById('addStoryForm').reset();
  document.getElementById("attraction").readOnly          = false;
  document.getElementById("submit").style.visibility      = 'visible';
  document.getElementById("delete").style.visibility      = 'hidden';
  document.getElementById("update").style.visibility      = 'hidden';
  document.getElementById("form-title-textbox").innerHTML = "Add Story";
}

// Populate attraction select box with options
async function populateAttractions() {
  await db.collection("attraction").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(attraction) {
      var select = document.getElementById("attraction");
      var option = document.createElement("option");
      option.text = attraction.data().title;
      option.value = attraction.id;
      select.add(option);
    })
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });
  // Check session for preloaded data
  checkSession();
}

// Check for items in session
function checkSession() {
  document.getElementById("delete").style.visibility = 'hidden';
  document.getElementById("update").style.visibility = 'hidden';
  
  if(sessionStorage.getItem('story_id') != null) {
    $("#attraction").val(sessionStorage.getItem('attraction_id'));
    document.getElementById('story_id').value      = sessionStorage.getItem('story_id');
    document.getElementById('text').value          = sessionStorage.getItem('text');
    document.getElementById('longitude').value     = sessionStorage.getItem('longitude');
    document.getElementById('latitude').value      = sessionStorage.getItem('latitude');
    sessionStorage.clear();
    document.getElementById("form-title-textbox").innerHTML = "Update Story";
    document.getElementById("attraction").readOnly          = true;
    document.getElementById("submit").style.visibility      = 'hidden';
    document.getElementById("delete").style.visibility      = 'visible';
    document.getElementById("update").style.visibility      = 'visible';
  }
}