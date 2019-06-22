
//var storage = firebase.storage();
//var ref = storage.ref();

// Check session for preloaded data
checkSession();

// Submit form
function submitForm(e) {
  // Get values
  var title       = getInputVal('title');
  var description = getInputVal('description');
  var longitude   = parseFloat(getInputVal('longitude'));
  var latitude    = parseFloat(getInputVal('latitude'));

  // Save attraction
  saveAttraction(title, description, longitude, latitude);
  //uploadFile();
  // Show alert
  alert(title + " has been added!");
  // Clear form
  document.getElementById('addAttractionForm').reset();
}

// Update form
function updateForm(e) {
  // Get values
  var id          = getInputVal('attraction_id');
  var title       = getInputVal('title');
  var description = getInputVal('description');
  var longitude   = parseFloat(getInputVal('longitude'));
  var latitude    = parseFloat(getInputVal('latitude'));
  // Update attraction
  updateAttraction(id, title, description, longitude, latitude);
  //uploadFile();
  // Show alert
  alert(title + " has been updated!");
  // Clear form
  document.getElementById('addAttractionForm').reset();
  document.getElementById("submit").style.visibility      = 'visible';
  document.getElementById("delete").style.visibility      = 'hidden';
  document.getElementById("update").style.visibility      = 'hidden';
  document.getElementById("form-title-textbox").innerHTML = "Add Attraction";
}

// Delete input
function deleteInput() {
  if (confirm("Are you sure you want to delete the attraction?")) {
    var id    = getInputVal('attraction_id');
    var title = getInputVal('title');
    db.collection("attraction").doc(id).update({
      active: false
    })
    .then(function() {
      alert(title + " has been deleted!");
    })
    .catch(function(error) {
        console.error("Error deleting attraction: ", error);
    });
    // Clear form
    document.getElementById('addAttractionForm').reset();
    document.getElementById("submit").style.visibility      = 'visible';
    document.getElementById("delete").style.visibility      = 'hidden';
    document.getElementById("update").style.visibility      = 'hidden';
    document.getElementById("form-title-textbox").innerHTML = "Add Attraction";
  } else {
    //alert("Cancelled.");
  }
}

// Update attraction in firebase
function updateAttraction(id, title, description, longitude, latitude) {
  db.collection("attraction").doc(id).update({
    title: title,
    description: description,
    geopoint: new firebase.firestore.GeoPoint(latitude, longitude)
  })
  .then(function() {
    //console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error saving changes: ", error);
  });
}

// Save attraction to firebase
function saveAttraction(title, description, longitude, latitude) {
  db.collection("attraction").add({
    title: title,
    description: description,
    geopoint: new firebase.firestore.GeoPoint(latitude, longitude)
  })
  .then(function() {
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

// Check for items in session
function checkSession() {
  document.getElementById("delete").style.visibility = 'hidden';
  document.getElementById("update").style.visibility = 'hidden';
  
  if(sessionStorage.getItem('attraction_id') != null) {
    document.getElementById('attraction_id').value = sessionStorage.getItem('attraction_id');
    document.getElementById('title').value         = sessionStorage.getItem('title');
    document.getElementById('description').value   = sessionStorage.getItem('description');
    document.getElementById('longitude').value     = sessionStorage.getItem('longitude');
    document.getElementById('latitude').value      = sessionStorage.getItem('latitude');
    sessionStorage.clear();
    document.getElementById("form-title-textbox").innerHTML = "Update Attraction";
    document.getElementById("submit").style.visibility      = 'hidden';
    document.getElementById("delete").style.visibility      = 'visible';
    document.getElementById("update").style.visibility      = 'visible';
  }
}