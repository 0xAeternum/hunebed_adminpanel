// Check session for preloaded data
checkSession();

//Date for files title
function getDate() {
  var d = new Date(),
      second = '' + d.getSeconds(),
      minute = '' + d.getMinutes(),
      hour   = '' + d.getHours(),
      month  = '' + (d.getMonth() + 1),
      day    = '' + d.getDate(),
      year   = d.getFullYear();
  
  if (second.length < 2) second = '0' + second;
  if (minute.length < 2) minute = '0' + minute;
  if (hour.length < 2) hour = '0' + hour;
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return ([year, month, day].join('-') + '@' + [hour, minute, second].join(':'));
}

// Submit form
function submitForm() {
  // Get values
  var title       = getInputVal('title');
  var description = getInputVal('description');
  var longitude   = parseFloat(getInputVal('longitude'));
  var latitude    = parseFloat(getInputVal('latitude'));
  var file        = document.getElementById('inputFile').files[0];
  var date        = getDate();

  // Save attraction
  saveAttraction(title, description, longitude, latitude, date);
  uploadFile(file, title, date);
  // Show alert
  alert(title + " has been added!");
  // Clear form
  document.getElementById('addAttractionForm').reset();
}

// Update form
async function updateForm() {
  // Get values
  var id          = getInputVal('attraction_id');
  var title       = getInputVal('title');
  var description = getInputVal('description');
  var longitude   = parseFloat(getInputVal('longitude'));
  var latitude    = parseFloat(getInputVal('latitude'));
  var date        = null;
  if(document.getElementById('inputFile').files[0]) {
    var file      = document.getElementById('inputFile').files[0];
    var date      = getDate();
    await uploadFile(file, title, date);
  }

  // Update attraction
  await updateAttraction(id, title, description, longitude, latitude, date);
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
function updateAttraction(id, title, description, longitude, latitude, date) {
  if(date == null) {
    var fields= {
      title: title,
      description: description,
      geopoint: new firebase.firestore.GeoPoint(latitude, longitude)
    }
  } else {
    var fields= {
      title: title,
      description: description,
      image: date + '-' + title.split(' ').join('_'),
      geopoint: new firebase.firestore.GeoPoint(latitude, longitude)
    }
  }
  
  db.collection("attraction").doc(id).update(fields)
    .then(function() {
      //console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error saving changes: ", error);
    });
}

// Save attraction to firebase
function saveAttraction(title, description, longitude, latitude, date) {
  db.collection("attraction").add({
    active: true,
    title: title,
    description: description,
    image: date + '-' + title.split(' ').join('_'),
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
function uploadFile(file, title, date) {
  var ref = firebase.storage().ref();
  var name = date + '-' + title.split(' ').join('_');;
  var metadata = { contentType: file.type };
  var task = ref.child(`attraction/${name}`).put(file, metadata);
  task.on(firebase.storage.TaskEvent.STATE_CHANGED,
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    });
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