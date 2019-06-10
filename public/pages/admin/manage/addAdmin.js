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

// Reference Admin collection
var db = firebase.firestore();
//var storage = firebase.storage();
//var ref = storage.ref();

// Submit form
function submitForm(e){
  // Get values
  var name        = getInputVal('name');
  var email       = getInputVal('email');
  var password    = getInputVal('password');
  var title       = getInputVal('title');
  var super_admin = $('#super_admin').get()[0].checked;

  // Save Admin
  saveAdmin(name, email, password, title, super_admin);
  //uploadFile();
  // Show alert
  alert(name + " has been added!");
  // Clear form
  document.getElementById('addAdminForm').reset();
  document.getElementById("name").readOnly = false;
  document.getElementById("submit").style.visibility = 'visible';
  document.getElementById("delete").style.visibility = 'hidden';
  document.getElementById("update").style.visibility = 'hidden';
}

// Update form
function updateForm(e){
  // Get values
  var name        = getInputVal('name');
  var email       = getInputVal('email');
  var password    = getInputVal('password');
  var title       = getInputVal('title');
  var super_admin = $('#super_admin').get()[0].checked;

  // Update Admin
  updateAdmin(name, email, password, title, super_admin);
  //uploadFile();
  // Show alert
  alert(name + " has been updated!");
  // Clear form
  document.getElementById('addAdminForm').reset();
  document.getElementById("name").readOnly = false;
  document.getElementById("submit").style.visibility = 'visible';
  document.getElementById("delete").style.visibility = 'hidden';
  document.getElementById("update").style.visibility = 'hidden';
}

function deleteInput(){
  if (confirm("Are you sure you want to delete the administrator?")) {
    var name = getInputVal('name');
    db.collection("administrators").doc(name)
      .update({active: false, updated_at: Date.now()}).then(function() {
      alert(name + " has been deleted!");
    }).catch(function(error) {
        console.error("Error deleting administrator: ", error);
    });
    // Clear form
    document.getElementById('addAdminForm').reset();
    document.getElementById("name").readOnly = false;
    document.getElementById("submit").style.visibility = 'visible';
    document.getElementById("delete").style.visibility = 'hidden';
    document.getElementById("update").style.visibility = 'hidden';
  } else {
    //alert("Cancelled.");
  }
}

// Update Admin in firebase
function updateAdmin(name, email, password, title, super_admin){
  db.collection("administrators").doc(name).update({
    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    email: email,
    password: password,
    title: title,
    super_admin: super_admin
  }).then(function() {
    //console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });
}

// Save Admin to firebase
function saveAdmin(name, email, password, title, super_admin){
  db.collection("administrators").doc(name).set({
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    active: true,
    name: name,
    email: email,
    password: password,
    title: title,
    super_admin: super_admin
  }).then(function() {
    //console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });
}

// Function to get get form values
function getInputVal(field_id){
  return document.getElementById(field_id).value;
}

function uploadFile(){
  const file = $('#InputFile').get(0).files[0];
  const fileName = (+new Date()) + '-' + file.name + '-' + name;
  //const task = ref.child(fileName).put(file, metadata);
}