
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
                  if(min < 10) min = "0" + min;
                  var sec   =   a.getSeconds();
                  if(sec < 10) sec = "0" + sec;
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
              if(min < 10) min = "0" + min;
              var sec   = a.getSeconds();
              if(sec < 10) sec = "0" + sec;
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
$(async function () {

  'use strict';

  // $('.daterange').daterangepicker({
  //   ranges   : {
  //     'Today'       : [moment(), moment()],
  //     'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  //     'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
  //     'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  //     'This Month'  : [moment().startOf('month'), moment().endOf('month')],
  //     'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  //   },
  //   startDate: moment().subtract(29, 'days'),
  //   endDate  : moment()
  // }, function (start, end) {
  //   window.alert('You chose: ' + start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  // });

  // jvectormap data
  var visitorsData = {
    HC:   240,  // Hunebed Centre
    D27:  148,  // Hunebed D27
    HGEG: 78,   // Hundsrug Geopark Expedition Gateway
    PP:   79,   // Prehistoric Park
    BG:   37    // Boulder Garden
  };

  // Hunebed map by jvectormap
  $('#hunebed-map').vectorMap({
    map              : 'hunebed-map',
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
        el.html(el.html() + ': ' + visitorsData[code] + ' visitors');
    }
  });

  //-------------
  //- PIE CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  var pieChartCanvas = $('#pieChart').get(0).getContext('2d');
  var pieChart       = new Chart(pieChartCanvas);
  var PieData        = [
    {
      value    : 700,
      color    : 'rgb(151,181,33)',
      highlight: 'rgb(151,181,33)',
      label    : 'Chrome'
    },
    {
      value    : 600,
      color    : 'rgb(68,153,193)',
      highlight: 'rgb(68,153,193)',
      label    : 'FireFox'
    },
    {
      value    : 500,
      color    : 'rgb(229,29,68)',
      highlight: 'rgb(229,29,68)',
      label    : 'Opera'
    },
    {
      value    : 400,
      color    : 'rgb(225,163,11)',
      highlight: 'rgb(225,163,11)',
      label    : 'Navigator'
    },
    {
      value    : 400,
      color    : 'rgb(191,213,199)',
      highlight: 'rgb(191,213,199)',
      label    : 'IE'
    },
    {
      value    : 300,
      color    : 'rgb(210,225,232)',
      highlight: 'rgb(210,225,232)',
      label    : 'Safari'
    },
    {
      value    : 100,
      color    : 'rgb(237,212,211)',
      highlight: 'rgb(237,212,211)',
      label    : 'Navigator'
    }
  ];
  var pieOptions     = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke    : true,
    //String - The colour of each segment stroke
    segmentStrokeColor   : '#fff',
    //Number - The width of each segment stroke
    segmentStrokeWidth   : 2,
    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    //Number - Amount of animation steps
    animationSteps       : 100,
    //String - Animation easing effect
    animationEasing      : 'easeOutBounce',
    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate        : true,
    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale         : false,
    //Boolean - whether to make the chart responsive to window resizing
    responsive           : true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio  : true,
    //String - A legend template
    legendTemplate       : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
  };
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  pieChart.Doughnut(PieData, pieOptions);

  //-------------
  //- BAR CHART -
  //-------------
  var barChartCanvas  = $('#barChart').get(0).getContext('2d');
  var barChart        = new Chart(barChartCanvas);

  //Prepare month labels starting this month
  var monthLabels = [];
  var monthNumbers = [];
  for(let i = 0; i < 12; i++) {
    if(todayMidnight.getMonth() + i + 1 < 12) {
      monthLabels[i] = monthsEnglishShort[todayMidnight.getMonth() + i + 1];
      monthNumbers[i] = todayMidnight.getMonth() + i + 1;
    } else {
      monthLabels[i] = monthsEnglishShort[todayMidnight.getMonth() + i + 1 - 12];
      monthNumbers[i] = todayMidnight.getMonth() + i + 1 - 12;
    }
  }

  //Get data for bar chart
  var lastYear = new Date();
  lastYear.setDate(todayMidnight.getDate() - 365);
  lastYear.setMonth(lastYear.getMonth() + 1, 1);
  var monthlyUsers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  await db.collection("users").where("created", ">", lastYear)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(user) {
        let userDate = new Date(user.data().created.seconds * 1000);
        monthlyUsers[monthNumbers[userDate.getMonth()]]++;
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  var barChartData = {
    labels  : monthLabels,
    datasets: [{
      label               : 'Digital Goods',
      fillColor           : 'rgba(225,163,11,0.9)',
      strokeColor         : 'rgba(225,163,11,0.8)',
      pointColor          : '#3b8bba',
      pointStrokeColor    : 'rgba(225,163,11,1)',
      pointHighlightFill  : '#fff',
      pointHighlightStroke: 'rgba(225,163,11,1)',
      data                : monthlyUsers
    }]
  };
  barChartData.datasets[0].fillColor   = 'rgb(225,163,11)';
  barChartData.datasets[0].strokeColor = 'rgb(225,163,11)';
  barChartData.datasets[0].pointColor  = 'rgb(225,163,11)';
  var barChartOptions                  = {
    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero        : true,
    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines      : true,
    //String - Colour of the grid lines
    scaleGridLineColor      : 'rgba(0,0,0,.05)',
    //Number - Width of the grid lines
    scaleGridLineWidth      : 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines  : true,
    //Boolean - If there is a stroke on each bar
    barShowStroke           : true,
    //Number - Pixel width of the bar stroke
    barStrokeWidth          : 2,
    //Number - Spacing between each of the X value sets
    barValueSpacing         : 5,
    //Number - Spacing between data sets within X values
    barDatasetSpacing       : 1,
    //String - A legend template
    legendTemplate          : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
    //Boolean - whether to make the chart responsive
    responsive              : true,
    maintainAspectRatio     : true
  };

  barChartOptions.datasetFill = false;
  barChart.Bar(barChartData, barChartOptions);
});