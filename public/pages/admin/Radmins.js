
// Get all admins
getAll();
//Create table 
var table = $('#adminTable').DataTable({
  "columnDefs": [{
    "targets": -1,
    "data": null,
    "defaultContent": "<button class='btn-danger'>Remove</button>",
  }, {
    "targets": [2],
    "visible": false
}]});
//Wait for remove button to be pressed and ask user to confirm
$('#adminTable tbody').on('click', 'button', function () {
  var data = table.row($(this).parents('tr')).data();

  if (confirm("Are you sure you want to delete "+ data[0]+"?")) {

    db.collection("administrator").doc(data[2]).update({
      active: false
    });
    table.row($(this)).remove();
  } else {
    //alert("Cancelled.");
  }

});
//Call all users from the database and on any activity reload the table
function getAll() {
  db.collection("administrator").where('active', '==', true).onSnapshot(function(querySnapshot){
    var adminTable = $('#adminTable').DataTable();
    adminTable.rows().remove();
      querySnapshot.forEach(function(admin) {
        
        adminTable.row.add([
          String(admin.data().username),
          String(admin.data().email),
          String(admin.id),
          null,
        ]).draw();
      })
    });
}