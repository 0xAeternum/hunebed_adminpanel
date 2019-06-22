

// Populate users in form
populateUsers();

// Submit form
function submitForm(e) {
  // Get values
  var name        = getInputVal('name');
  var mac_address = getInputVal('mac_address');
  var user        = getInputVal('user');

  // Save Device
  saveDevice(name, mac_address, user);
  // Show alert
  alert(name + " has been added!");
  // Clear form
  document.getElementById('addDeviceForm').reset();
}

// Update form
function updateForm(e) {
  // Get values
  var name        = getInputVal('name');
  var mac_address = getInputVal('mac_address');
  var user        = getInputVal('user');
  var old_user    = getInputVal('old_user');

  // Update Admin
  updateDevice(name, mac_address, user, old_user);
  // Show alert
  alert(name + " has been updated!");
  // Clear form
  document.getElementById('addDeviceForm').reset();
  document.getElementById("name").readOnly = false;
  document.getElementById("submit").style.visibility = 'visible';
  document.getElementById("delete").style.visibility = 'hidden';
  document.getElementById("update").style.visibility = 'hidden';
  document.getElementById("form-title-textbox").innerHTML = "Add Device";
}

function deleteInput() {
  if (confirm("Are you sure you want to delete the device?")) {
    var name = getInputVal('name');
    var user = getInputVal('user');
    db.collection("device").doc(name).update({
      active: false, 
      updated_at: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function() {
      db.collection("administrators").doc(user).update({
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        device: null
      }).then(function() {
        alert(name + " has been deleted!");
        //console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error saving changes: ", error);
      });
    })
    .catch(function(error) {
        console.error("Error deleting device: ", error);
    });
    // Clear form
    document.getElementById('addDeviceForm').reset();
    document.getElementById("name").readOnly = false;
    document.getElementById("submit").style.visibility = 'visible';
    document.getElementById("delete").style.visibility = 'hidden';
    document.getElementById("update").style.visibility = 'hidden';
    document.getElementById("form-title-textbox").innerHTML = "Add Device";
  } else {
    //alert("Cancelled.");
  }
}

// Update Device in firebase
function updateDevice(name, mac_address, user, old_user) {
  db.collection("device").doc(name).update({
    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    mac_address: mac_address,
  })
  .then(function() {
    if(old_user != user) {
      db.collection("administrators").doc(user).update({
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        device: db.doc('device/' + name)
      }).then(function() {
        db.collection("administrators").doc(old_user).update({
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          device: null
        }).then(function() {
          //console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error saving changes: ", error);
        });
      })
      .catch(function(error) {
        console.error("Error saving changes: ", error);
      });
    }
  })
  .catch(function(error) {
    console.error("Error saving changes: ", error);
  });
}

// Save Device to firebase
function saveDevice(name, mac_address, user) {
  db.collection("device").doc(name).set({
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    active: true,
    name: name,
    mac_address: mac_address,
  })
  .then(function() {
    db.collection("administrators").doc(user).update({
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      device: db.doc('device/' + name)
    }).then(function() {
      //console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error saving changes: ", error);
    });
  })
  .catch(function(error) {
    console.error("Error saving changes: ", error);
  });
}

// Function to get values form inputs
function getInputVal(field_id) {
  return document.getElementById(field_id).value;
}

async function populateUsers() {
  await db.collection("administrators").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(admin) {
      var select = document.getElementById("user");
      var option = document.createElement("option");
      option.text = admin.data().name;
      option.value = admin.data().name;
      select.add(option);
    });
  });
  // Check session for preloaded data
  checkSession();
}

function checkSession() {
  document.getElementById("delete").style.visibility = 'hidden';
  document.getElementById("update").style.visibility = 'hidden';
  
  if(sessionStorage.getItem('name') != null){
    document.getElementById('name').value = sessionStorage.getItem('name');
    document.getElementById('mac_address').value = sessionStorage.getItem('mac_address');
    $("#user").val(sessionStorage.getItem('user'));
    document.getElementById('old_user').value = sessionStorage.getItem('user');

    sessionStorage.clear();
    document.getElementById("name").readOnly = true;
    document.getElementById("form-title-textbox").innerHTML = "Update Device";
    document.getElementById("submit").style.visibility = 'hidden';
    document.getElementById("delete").style.visibility = 'visible';
    document.getElementById("update").style.visibility = 'visible';
  }
}