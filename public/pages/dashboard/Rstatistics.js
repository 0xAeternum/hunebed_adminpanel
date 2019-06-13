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

// Populate 4 small boxes on top
populateSmallBoxes();
// Populate ratings box
populateRatings();
// Populate comments box
populateComments();

// $('#deviceTable tbody').on('click', 'button', function () {
//   var data = table.row( $(this).parents('tr') ).data();
//   alert('You will edit: ' + data[0]);
//   sessionStorage.setItem('name',        data[0]);
//   sessionStorage.setItem('user',        data[1]);
//   sessionStorage.setItem('mac_address', data[2]);
//   window.location.assign('device-add.html');
// });

async function populateSmallBoxes() {
  // Calculate user registrations from today
  var i = 0;
  await db.collection("users").where("created", ">", todayMidnight)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(user) {
        if(user.data().status == true) {
          i++;
        }
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  document.getElementById("newUsersTodayCount").innerHTML = i;

  // Calculate user registrations from last 30 days
  var dt = new Date();
  dt.setDate(todayMidnight.getDate() - 30);
  i = 0;

  await db.collection("users").where("created", ">", dt)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(user) {
        if(user.data().status == true) {
          i++;
        }
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  document.getElementById("newUsersMonthCount").innerHTML = i;

  // Calculate unique attractions in the museum
  i = 0;
  await db.collection("attraction").where("active", "==", true)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function() {
        i++;
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  document.getElementById("uniqueAttractionsCount").innerHTML = i;

  // Calculate posted ratings and comments
  i = 0;
  await db.collection("reviews").where("active", "==", true)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function() {
        i++;
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  document.getElementById("ratingsCommentsCount").innerHTML = i;
}

async function populateRatings() {
  // Calculate ratings from today
  var i = 0;
  await db.collection("reviews").where("created_at", ">", todayMidnight).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(rating) {
          if(rating.data().active == true && rating.data().type == 1) {
            i++;
          }
        })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  document.getElementById("newRatingsCount").innerHTML = i;
  
  // Get two most recent ratings
  i = 1;
  db.collection("reviews")
    .orderBy("created_at", "desc").limit(20).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(rating) {
        if(rating.data().active == true && rating.data().type == 1) {
          db.collection("attraction").doc(rating.data().attraction.id).get()
            .then(function(attraction) {
              if(attraction.data().active == true) {
                if(i < 3) {
                  // Create the box layout
                  var text = "<a class=\"info-box-more bg-green\" href=\"../../pages/user_requests/ratings.html\">" +
                            "<span class=\"small pull-right\" id=\"ratingdate" + i + "\"></span><br />" + 
                            "<span class=\"pull-right\">";
                  // Add rating starts
                  for(var x = 5 - rating.data().review; x > 0; x--) {
                    text += "<i class=\"fa fa-star-o pull-right\"></i>\n";
                  }
                  for(var x = rating.data().review; x > 0; x--) {
                    text += "<i class=\"fa fa-star pull-right\"></i>\n";
                  }
                  text += "</span></a>" + 
                          "<span onclick=\"seeAttraction('" +
                            rating.data().attraction.id + "', '" +
                            attraction.data().description + "', " +
                            attraction.data().position.latitude + ", " +
                            attraction.data().position.longitude + ", " +
                            attraction.data().direction +
                          ")\" style=\"cursor: pointer\">" + rating.data().attraction.id + "</span>";
                  // Add text to document
                  if(i == 1) document.getElementById("ratingbox").innerHTML = text;
                  else document.getElementById("ratingbox").innerHTML += text;

                  // Prepare and add date of rating
                  var a     =     new Date(rating.data().created_at.seconds * 1000);
                  var year  =  a.getFullYear();
                  var month = monthsEnglishShort[a.getMonth()];
                  var date  =  a.getDate();
                  var hour  =  a.getHours();
                  var min   =   a.getMinutes();
                  var sec   =   a.getSeconds();
                  var time  =  date + ' ' + month + ' ' + year + ' at ' + hour + ':' + min + ':' + sec;
                  document.getElementById("ratingdate" + i).innerHTML = time;
                }
                i++;
              }
            })
            .catch(function(error) {
              console.log("Error getting documents: ", error);
            })
          }
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

async function populateComments() {
  // Calculate comments from today
  var i = 0;
  await db.collection("reviews").where("created_at", ">", todayMidnight)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(comment) {
        if(comment.data().active == true && comment.data().type == 0) {
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
  db.collection("reviews")
    .orderBy("created_at", "desc").limit(20).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(comment) {
          if(comment.data().active == true && comment.data().type == 0) {
            if(i < 3) {
              var text = "<a class=\"info-box-more bg-green\" href=\"../../pages/user_requests/ratings.html\">" +
                            "<span class=\"small pull-right\" id=\"ratingdate" + i + 
                            "\"></span><br /><span class=\"pull-right\">";
              // Create the box layout
              var text = "<a class=\"info-box-more bg-blue\" href=\"../../pages/user_requests/comments-manage.html\">" +
                "<span class=\"small pull-right\" id=\"commentdate" + i + "\"></span><br />" +
                "<span class=\"pull-right\" onclick=\"seeUser(" + comment.data().user.id + ")\" style=\"cursor: pointer\">" +
                  "<b>" + comment.data().user.id + "</b>" +
                "</span>" + comment.data().review + "</a>";
              // Add text to document
              if(i == 1) document.getElementById("commentbox").innerHTML = text;
              else document.getElementById("commentbox").innerHTML += text;

              // Prepare and add date of rating
              var a     = new Date(comment.data().created_at.seconds * 1000);
              var year  = a.getFullYear();
              var month = monthsEnglishShort[a.getMonth()];
              var date  = a.getDate();
              var hour  = a.getHours();
              var min   = a.getMinutes();
              var sec   = a.getSeconds();
              var time  = date + ' ' + month + ' ' + year + ' at ' + hour + ':' + min + ':' + sec;
              document.getElementById("commentdate" + i).innerHTML = time;
            }
            i++;
          }
        })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function seeAttraction(id, description, latitude, longitude, direction) {
  // Add the attraction to sessionStorage to modify and redirect
  sessionStorage.setItem('id',          id);
  sessionStorage.setItem('description', description);
  sessionStorage.setItem('latitude',    latitude);
  sessionStorage.setItem('longitude',   longitude);
  sessionStorage.setItem('direction',   direction);
  window.location.assign('../../pages/locations/locations-add.html');
}

function seeUser(id) {
  // Add the user to sessionStorage to outline and redirect
  sessionStorage.setItem('id',          id);
  window.location.assign('../../pages/users/users-block.html');
}

//Date range picker and map population
$(function () {

  'use strict';

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
});