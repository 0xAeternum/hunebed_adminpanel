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
var db = firebase.firestore();
var todayMidnight = new Date();
todayMidnight.setHours(0,0,0,0);
var monthsEnglishShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Populate comments box
populateComments();
// Populate ratings box
populateRatings();

// $('#adminTable tbody').on('click', 'button', function () {
//   var data = table.row( $(this).parents('tr') ).data();
//   alert('You will edit: ' + data[0]);
//   sessionStorage.setItem('name',        data[0]);
//   sessionStorage.setItem('title',       data[1]);
//   sessionStorage.setItem('email',       data[2]);
//   sessionStorage.setItem('password',    data[3]);
//   sessionStorage.setItem('super_admin', data[5]);
//   window.location.assign('admin-add.html');
// });
  
// var table = $('#deviceTable').DataTable({
//   "columnDefs": [ {
//   "targets": -1,
//   "data": null,
//   "defaultContent": "<button class='btn-warning'>Edit</button>",
// }]});

// $('#deviceTable tbody').on('click', 'button', function () {
//   var data = table.row( $(this).parents('tr') ).data();
//   alert('You will edit: ' + data[0]);
//   sessionStorage.setItem('name',        data[0]);
//   sessionStorage.setItem('user',        data[1]);
//   sessionStorage.setItem('mac_address', data[2]);
//   window.location.assign('device-add.html');
// });

// db.collection('comments').get().then(snap => {
//   document.getElementById("newCommentsCount").innerHTML = snap.size;
// });

// db.collection("administrators").get().then(function(querySnapshot) {
//   querySnapshot.forEach(function(admin) {
//     if(admin.data().device) {
//       db.collection("device").doc(admin.data().device.id).get().then(function(device) {
//         if(device.data().active == true) { 
//           var deviceTable = $('#deviceTable').DataTable();
//           deviceTable.row.add([
//             String(device.data().name),
//             String(admin.data().name),
//             String(device.data().mac_address),
//             null
//           ]).draw();
//         }
//       });
//     }
//   });
// });

async function populateComments(){
  // Calculate comments from today
  var i = 0;
  await db.collection("comments").where("date", ">", todayMidnight)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(comment) {
          if(comment.data().active == true) {
            i++;
          }
        })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  document.getElementById("newCommentsCount").innerHTML = i;

  // Get two most recent comments
  i = 1;
  db.collection("comments")
    .orderBy("date", "desc").limit(2).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(comment) {
          if(comment.data().active == true) {
            // Create the box layout
            var text = "<span class=\"small pull-right\" id=\"commentdate" + i + 
                       "\"></span><br /><span class=\"pull-right\"><b>" +
                       comment.data().user + "</b></span>" + 
                       comment.data().comment;
            // Add text to document
            document.getElementById("commentbox" + i).innerHTML = text;

            // Prepare and add date of rating
            var a     = new Date(comment.data().date.seconds * 1000);
            var year  = a.getFullYear();
            var month = monthsEnglishShort[a.getMonth()];
            var date  = a.getDate();
            var hour  = a.getHours();
            var min   = a.getMinutes();
            var sec   = a.getSeconds();
            var time  = date + ' ' + month + ' ' + year + ' at ' + hour + ':' + min + ':' + sec;
            document.getElementById("commentdate" + i).innerHTML = time;

            i++;
          }
        })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

async function populateRatings(){
  // Calculate ratings from today
  var i = 0;
  await db.collection("rating").where("date", ">", todayMidnight).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(rating) {
          i++;
        })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  document.getElementById("newRatingsCount").innerHTML = i;
  
  // Get two most recent ratings
  i = 1;
  db.collection("rating")
    .orderBy("date", "desc").limit(2)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(rating) {
        db.collection("attraction").doc(rating.data().attraction.id).get()
          .then(function(attraction) {
            if(attraction.data().active == true) {
              // Create the box layout
              var text = "<a class=\"info-box-more bg-green\" href=\"../../pages/user_requests/ratings.html\">" +
                        "<span class=\"small pull-right\" id=\"ratingdate" + i + 
                        "\"></span><br /><span class=\"pull-right\">";
              // Add rating starts
              for(var x = 5 - rating.data().rating; x > 0; x--) {
                text += "<i class=\"fa fa-star-o pull-right\"></i>\n";
              }
              for(var x = rating.data().rating; x > 0; x--) {
                text += "<i class=\"fa fa-star pull-right\"></i>\n";
              }
              text += "</span></a><span onclick=\"seeAttraction('" +
                      rating.data().attraction.id + "', '" +
                      attraction.data().description + "', " +
                      attraction.data().position.latitude + ", " +
                      attraction.data().position.longitude + ", " +
                      attraction.data().direction +
                      ")\">" + rating.data().attraction.id + "</span>";
              // Add text to document
              if(i == 1) document.getElementById("ratingbox").innerHTML = text;
              else document.getElementById("ratingbox").innerHTML += text;

              // Prepare and add date of rating
              var a     =     new Date(rating.data().date.seconds * 1000);
              var year  =  a.getFullYear();
              var month = monthsEnglishShort[a.getMonth()];
              var date  =  a.getDate();
              var hour  =  a.getHours();
              var min   =   a.getMinutes();
              var sec   =   a.getSeconds();
              var time  =  date + ' ' + month + ' ' + year + ' at ' + hour + ':' + min + ':' + sec;
              document.getElementById("ratingdate" + i).innerHTML = time;

              i++;
            }
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          })
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function seeAttraction(id, description, latitude, longitude, direction) {
  // Add the sessionStorage to attraction to modify and redirect
  sessionStorage.setItem('id',          id);
  sessionStorage.setItem('description', description);
  sessionStorage.setItem('latitude',    latitude);
  sessionStorage.setItem('longitude',   longitude);
  sessionStorage.setItem('direction',   direction);
  window.location.assign('../../pages/locations/locations-add.html');
}

//Admin LTE Stuff
$(function () {

  'use strict';

  // bootstrap WYSIHTML5 - text editor
  $('.textarea').wysihtml5();

  $('.daterange').daterangepicker({
    ranges   : {
      'Today'       : [moment(), moment()],
      'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month'  : [moment().startOf('month'), moment().endOf('month')],
      'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    startDate: moment().subtract(29, 'days'),
    endDate  : moment()
  }, function (start, end) {
    window.alert('You chose: ' + start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  });

  /* jQueryKnob */
  $('.knob').knob();

  // jvectormap data
  var visitorsData = {
    US: 398, // USA
    SA: 400, // Saudi Arabia
    CA: 1000, // Canada
    DE: 500, // Germany
    FR: 760, // France
    CN: 300, // China
    AU: 700, // Australia
    BR: 600, // Brazil
    IN: 800, // India
    GB: 320, // Great Britain
    RU: 3000 // Russia
  };
  // World map by jvectormap
  $('#world-map').vectorMap({
    map              : 'world_mill_en',
    backgroundColor  : 'transparent',
    regionStyle      : {
      initial: {
        fill            : '#e4e4e4',
        'fill-opacity'  : 1,
        stroke          : 'none',
        'stroke-width'  : 0,
        'stroke-opacity': 1
      }
    },
    series           : {
      regions: [
        {
          values           : visitorsData,
          scale            : ['#92c1dc', '#ebf4f9'],
          normalizeFunction: 'polynomial'
        }
      ]
    },
    onRegionLabelShow: function (e, el, code) {
      if (typeof visitorsData[code] != 'undefined')
        el.html(el.html() + ': ' + visitorsData[code] + ' new visitors');
    }
  });

  // The Calender
  $('#calendar').datepicker();

  /* The todo list plugin */
  $('.todo-list').todoList({
    onCheck  : function () {
      window.console.log($(this), 'The element has been checked');
    },
    onUnCheck: function () {
      window.console.log($(this), 'The element has been unchecked');
    }
  });

});