
  //var storage = firebase.storage();
  //var ref = storage.ref();
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
    //uploadFile();
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
  function deleteInput(){
    //var txt;
    var name = getInputVal('name');
    var r = confirm("Remove " + name);
    if (r == true) {
      //alert(name+ " would be deleted");
      
      db.collection("attraction").doc(name).update({
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        active: false
      }).then(function() {
        alert("Document successfully deleted!");

      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
      
     
      
      // Clear form
      //document.getElementById('addLocationForm').reset();

    } else {
      


      alert("cancelled");
      // Clear form

    }
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
      active: true,
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
  function uploadFile(){
    const file = $('#InputFile').get(0).files[0];
    const fileName = (+new Date()) + '-' + file.name + '-' + name;
    //const task = ref.child(fileName).put(file, metadata);
  
  }

    /*
    // Create a root reference
    var storageRef = firebase.storage().ref();

    // Create a reference to 'mountains.jpg'
    var mountainsRef = storageRef.child('mountains.jpg');

    // Create a reference to 'images/mountains.jpg'
    var mountainImagesRef = storageRef.child('images/mountains.jpg');

    // While the file names are the same, the references point to different files
    mountainsRef.name === mountainImagesRef.name            // true
    //mountainsRef.fullPath === mountainImagesRef.fullPath    // false
    */
  