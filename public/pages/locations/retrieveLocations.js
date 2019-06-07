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
 // var table =  null;
  function getAttraction(){
   
  }
  function getAll(){
    //table =  $('#monumentsTable').DataTable();
    db.collection("attraction").get().then(function(querySnapshot) {
      
      
   
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        //var table = document.getElementById("monumentsTable");
        //console.log(doc.id);
        var table =  $('#monumentsTable').DataTable();

        
        table.row.add([
          String(doc.id),
          String(doc.data().description),
          String(doc.data().position.latitude),
          String(doc.data().position.longitude),
          String(doc.data().direction),
          null
        ]).draw(); 
   /*
        var btn = document.createElement('input');
        btn.type = "button";
        btn.className = "btn-warning";
        btn.value = "Edit";
        

        var btnDelete = document.createElement('input');
        btnDelete.type = "button";
        btnDelete.className = "btn-danger";
        btnDelete.value = "Delete";
        // btn.setAttribute("id",doc.id)
        btn.addEventListener ("click", function() {

          //alert(doc.id);
          //Save data to sessionStorage
          sessionStorage.setItem('id', doc.id);
          sessionStorage.setItem('description', String(doc.data().description));
          sessionStorage.setItem('latitude', String(doc.data().position.latitude));
          sessionStorage.setItem('longitude', String(doc.data().position.longitude));
          sessionStorage.setItem('direction', String(doc.data().direction));
          window.location.assign('locations-add.html');
          // Get saved data from sessionStorage
          //var data = sessionStorage.getItem('key');
          // Remove saved data from sessionStorage
          //sessionStorage.removeItem('key');
        });
        btnDelete.addEventListener ("click", function() {

         

          var txt;
          var r = confirm("Press a button!");
          if (r == true) {
            alert(doc.id + " would be deleted");
            /*
            db.collection("cities").doc(doc.id).delete().then(function() {
              console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
            table.draw();
            
          } else {
            alert("cancelled");
          }

        });
     
        var td = document.getElementsByTagName('td')[i];
        td.appendChild(btn);
        var td = document.getElementsByTagName('td')[i+1];
        td.appendChild(btnDelete);
*/

       

      });
     //var table =  $('#monumentsTable').DataTable();
      
  });
 
  }

  
