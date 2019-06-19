 
 // var table =  null;
  function getAll(status){
    //table =  $('#monumentsTable').DataTable();
    db.collection("user").where("blocked", "==", status).where('active', '==', true).onSnapshot(function(querySnapshot) {
      
      
      var table =  $('#usersTable').DataTable();
      table.rows().remove();
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        //var table = document.getElementById("monumentsTable");
        //console.log(doc.id);
        

        
        table.row.add([
         
          String(doc.data().username),
          String(doc.data().email),
          doc.data().vieworder.length,
          null
        ]).draw(); 

       

      });
    
      
  });
 
  }
  function blockUser(name,blocked){
    /* var newusersRef = usersRef.push();
     newusersRef.set({
       name:name,
       longitude:longitude,
       latitude:latitude,
       direction:direction
     });*/
     db.collection("user").where('username', '==', name)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        db.collection("user").doc(doc.id).update({     
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        blocked: blocked
        }).then(function() {
         // console.log("Document successfully written!");
         // location.reload();

        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
      });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

   }

  
