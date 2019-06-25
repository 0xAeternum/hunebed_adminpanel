
//var storage = firebase.storage();
//var ref = storage.ref();

// Check session for preloaded data
checkSession();

// Submit form
function submitForm(e) {
  // Get values
  //var name        = getInputVal('name');
  var email       = getInputVal('email');

  //var title       = getInputVal('title');
  //var super_admin = $('#super_admin').get()[0].checked;

  // Save Admin
  saveAdmin(email);
  //uploadFile();
  // Show alert
  alert(name + " was requested to join");
  // Clear form
  document.getElementById('addAdminForm').reset();
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


// Save Admin to firebase
function saveAdmin(email){
  var actionCodeSettings = {
    // The URL to redirect to for sign-in completion. This is also the deep
    // link for mobile redirects. The domain (www.example.com) for this URL
    // must be whitelisted in the Firebase Console.
    url: 'https://fir-test-c91f4.firebaseapp.com/pages/login.html?' + email,
    iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    // This must be true.
    handleCodeInApp: true

  };
 // console.log(email);
  firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
    .then(function() {
      // The link was successfully sent. Inform the user. Save the email
      // locally so you don't need to ask the user for it again if they open
      // the link on the same device.
    })
    .catch(function(error) {
      // Some error occurred, you can inspect the code: error.code
      console.log(error);
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