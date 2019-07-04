 //Retrieves all users from the database and on any update diplays it in the table
  function getAll(status){

    db.collection("user").where("blocked", "==", status).where('active', '==', true).onSnapshot(function(querySnapshot) {
      
      
      var table =  $('#usersTable').DataTable();
      table.rows().remove();
      querySnapshot.forEach(function(doc) {

        var user = doc.data().username;
        var email = doc.data().email;
        var views = 0;
        if(doc.data().vieworder != undefined){
          views = doc.data().vieworder.length;
        }
        table.row.add([
         
          user,
          email,
          views,
          null
        ]).draw(); 

       

      });
    
      
  });
 
  }
  //Block a user which set their status to blocked = true or false
  function blockUser(name,blocked){

     db.collection("user").where('username', '==', name)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        db.collection("user").doc(doc.id).update({     
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        blocked: blocked
        }).then(function() {

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

  
