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

// Check session for preloaded data
checkSession();

// Submit form
function submitForm(e) {
  // Get values
  var name  = getInputVal('name');
  var email = getInputVal('email');
  // Save Admin
  saveAdmin(name, email);
  //uploadFile();
  // Show alert
  alert(name + " has been added!");
  // Clear form
  document.getElementById('addAdminForm').reset();
}

// Update form
function updateForm(e) {
  // Get values
  var id    = getInputVal('admin_id');
  var name  = getInputVal('name');
  var email = getInputVal('email');
  // Update admin
  updateAdmin(id, name, email);
  //uploadFile();
  // Show alert
  alert(name + " has been updated!");
  // Clear form
  document.getElementById('addAdminForm').reset();
  document.getElementById("submit").style.visibility = 'visible';
  document.getElementById("delete").style.visibility = 'hidden';
  document.getElementById("update").style.visibility = 'hidden';
  document.getElementById("form-title-textbox").innerHTML = "Add Admin";
}

// Delete input
function deleteInput() {
  if (confirm("Are you sure you want to delete the administrator?")) {
    var id   = getInputVal('admin_id');
    var name = getInputVal('name');
    db.collection("administrator").doc(id).update({
      active: false
    })
    .then(function() {
      alert(name + " has been deleted!");
    })
    .catch(function(error) {
        console.error("Error deleting administrator: ", error);
    });
    // Clear form
    document.getElementById('addAdminForm').reset();
    document.getElementById("submit").style.visibility = 'visible';
    document.getElementById("delete").style.visibility = 'hidden';
    document.getElementById("update").style.visibility = 'hidden';
    document.getElementById("form-title-textbox").innerHTML = "Add Admin";
  } else {
    //alert("Cancelled.");
  }
}

// Update admin in firebase
function updateAdmin(id, name, email) {
  db.collection("administrators").doc(id).update({
    username: name,
    email: email
  })
  .then(function() {
    //console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error saving changes: ", error);
  });
}

// Save admin to firebase
function saveAdmin(name, email){
  db.collection("administrators").add({
    username: name,
    email: email
  })
  .then(function() {
    //console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error saving changes: ", error);
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
  
  if(sessionStorage.getItem('admin_id') != null){
    document.getElementById('admin_id').value = sessionStorage.getItem('admin_id');
    document.getElementById('name').value     = sessionStorage.getItem('name');
    document.getElementById('email').value    = sessionStorage.getItem('email');
    sessionStorage.clear();
    document.getElementById("form-title-textbox").innerHTML = "Update Admin";
    document.getElementById("submit").style.visibility      = 'hidden';
    document.getElementById("delete").style.visibility      = 'visible';
    document.getElementById("update").style.visibility      = 'visible';
  }
}