// Populate attractions and check session for preloaded data
populateAttractions();

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
  var attraction_id = getInputVal('attraction');
  var text          = getInputVal('text');
  var longitude     = parseFloat(getInputVal('longitude'));
  var latitude      = parseFloat(getInputVal('latitude'));
  var file          = document.getElementById('inputFile').files[0];
  var date          = getDate();

  // Save story
  saveStory(text, longitude, latitude, attraction_id, date);
  uploadFile(file, text, date);
  // Show alert
  alert("Story has been added!");
}

// Update form
async function updateForm() {
  // Get values
  var story_id      = getInputVal('story_id');
  var attraction_id = getInputVal('attraction');
  var text          = getInputVal('text');
  var longitude     = parseFloat(getInputVal('longitude'));
  var latitude      = parseFloat(getInputVal('latitude'));
  var date          = null;
  if(document.getElementById('inputFile').files[0]) {
    var file        = document.getElementById('inputFile').files[0];
    var date        = getDate();
    await uploadFile(file, text, date);
  }

  // Update story
  updateStory(story_id, text, longitude, latitude, attraction_id, date);
  // Show alert
  alert("Story has been updated!");
}

// Delete input
function deleteInput() {
  if (confirm("Are you sure you want to delete the story?")) {
    var attraction_id = getInputVal('attraction');
    var story_id      = getInputVal('story_id');
    db.collection('attraction').doc(attraction_id).collection('element').doc(story_id).update({
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
function updateStory(story_id, text, longitude, latitude, attraction_id, date) {
  if(date == null) {
    var fields= {
      text: text,
      geopoint: new firebase.firestore.GeoPoint(latitude, longitude)
    }
  } else {
    var fields= {
      text: text,
      src: date + '-' + text.split(' ').join('_'),
      geopoint: new firebase.firestore.GeoPoint(latitude, longitude)
    }
  }
  db.collection('attraction').doc(attraction_id).collection('element').doc(story_id).update(fields)
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
async function saveStory(text, longitude, latitude, attraction_id, date) {
  await db.collection('attraction').doc(attraction_id).collection('element').add({
    active: true,
    text: text,
    image: date + '-' + text.split(' ').join('_'),
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
function uploadFile(file, title, date) {
  var ref = firebase.storage().ref();
  var name = date + '-' + title.split(' ').join('_');;
  var metadata = { contentType: file.type };
  var task = ref.child(`story/${name}`).put(file, metadata);
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