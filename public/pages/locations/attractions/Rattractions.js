
 // var table =  null;
 
  function getAll(){
    //table =  $('#monumentsTable').DataTable();
    db.collection("attraction").where('active','==',true).onSnapshot(function(querySnapshot) {
      

      var table =  $('#monumentsTable').DataTable();
      table.rows().remove();
     
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        //var table = document.getElementById("monumentsTable");
        //console.log(doc.id);
        

        
        table.row.add([
          String(doc.id),
          String(doc.data().description),
          String(doc.data().position.latitude),
          String(doc.data().position.longitude),
          String(doc.data().direction),
          null
        ]).draw(); 


      });
     //var table =  $('#monumentsTable').DataTable();
     
  });
  
  }

  
