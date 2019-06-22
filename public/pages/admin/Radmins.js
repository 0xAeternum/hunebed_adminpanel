
// Get all admins
getAll();

var table = $('#adminTable').DataTable({
  "columnDefs": [{
    "targets": -1,
    "data": null,
    "defaultContent": "<button class='btn-warning'>Edit</button>",
  }, {
    "targets": [2],
    "visible": false
}]});

$('#adminTable tbody').on('click', 'button', function () {
  var data = table.row($(this).parents('tr')).data();
  alert('You will edit: ' + data[0]);
  sessionStorage.setItem('name',     data[0]);
  sessionStorage.setItem('email',    data[1]);
  sessionStorage.setItem('admin_id', data[2]);
  window.location.assign('admin-add.html');
});

function getAll() {
  db.collection("administrator").where('active', '==', true).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(admin) {
        var adminTable = $('#adminTable').DataTable();
        adminTable.row.add([
          String(admin.data().username),
          String(admin.data().email),
          String(admin.id),
          null,
        ]).draw();
      })
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
}