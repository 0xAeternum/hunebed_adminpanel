//Prepare global today midnight for queries
var todayMidnight = new Date();
todayMidnight.setHours(0,0,0,0);

// Populate 4 small boxes on top
populateSmallBoxes();
// Populate ratings and comments boxes
populateRatingsComments();

async function populateSmallBoxes() {
  // Calculate user registrations from today
  var i = 0;
  await db.collection("user").where("created_at", ">", todayMidnight).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(user) {
        if(user.data().active == true) {
          i++;
          document.getElementById("newUsersTodayCount").innerHTML = i;
        }
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  // Calculate user registrations from last 30 days
  var dt = new Date();
  dt.setDate(todayMidnight.getDate() - 30);
  i = 0;
  await db.collection("user").where("created_at", ">", dt).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(user) {
        if(user.data().active == true) {
          i++;
          document.getElementById("newUsersMonthCount").innerHTML = i;
        }
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  // Calculate unique attractions in the museum
  i = 0;
  await db.collection("attraction").where("active", "==", true).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function() {
        i++;
        document.getElementById("uniqueAttractionsCount").innerHTML = i;
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  // Calculate posted ratings and comments
  i = 0;
  await db.collection("attraction").where("active", "==", true).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(async function(attraction) {
        await db.collection('attraction/' + attraction.id + '/review').where("active", "==", true).get()
          .then(function(querySnapshot1) {
            querySnapshot1.forEach(function(){
              i++;
              document.getElementById("ratingsCommentsCount").innerHTML = i;
            })
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

async function populateRatingsComments() {
  // Calculate ratings + rating average + comments from today
  var j = 0;
  var i = 0;
  var averageToday = 0;
  await db.collection("attraction").where("active", "==", true).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(async function(attraction) {
        await db.collection('attraction/' + attraction.id + '/review').where("created_at", ">", todayMidnight).get()
          .then(function(querySnapshot1) {
            querySnapshot1.forEach(function(review) {
              if(review.data().active == true && review.data().rating) {
                j++;
                averageToday += review.data().rating;
                document.getElementById("newRatingsCount").innerHTML = j;
                document.getElementById("newRatingsAverageTodayCount").innerHTML = (averageToday / j).toFixed(2);
              }
              if(review.data().active == true && review.data().comment) {
                i++;
                document.getElementById("newCommentsCount").innerHTML = i;
              }
              
            })
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          })
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  // Calculate rating average last 7 days
  var dt = new Date();
  dt.setDate(todayMidnight.getDate() - 7);
  var x = 0;
  var averageDays = 0;
  await db.collection("attraction").where("active", "==", true).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(async function(attraction) {
        await db.collection('attraction/' + attraction.id + '/review').where("created_at", ">", dt).get()
          .then(function(querySnapshot1) {
            querySnapshot1.forEach(function(review) {
              if(review.data().active == true && review.data().rating) {
                x++;
                averageDays += review.data().rating;
                document.getElementById("newRatingsAverageDaysCount").innerHTML = (averageDays / x).toFixed(2);
              }
            })
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          })
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  // Calculate added comments in last 7 days
  var dt1 = new Date();
  dt1.setDate(todayMidnight.getDate() - 7);
  var y = 0;
  await db.collection("attraction").where("active", "==", true).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(async function(attraction) {
        await db.collection('attraction/' + attraction.id + '/review').where("created_at", ">", dt1).get()
          .then(function(querySnapshot1) {
            querySnapshot1.forEach(function(review) {
              if(review.data().active == true && review.data().comment) {
                y++;
                document.getElementById("newComments7DaysCount").innerHTML = y;
              }
            })
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          })
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  // Calculate added comments in last 30 days
  var dt2 = new Date();
  dt2.setDate(todayMidnight.getDate() - 30);
  var z = 0;
  await db.collection("attraction").where("active", "==", true).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(async function(attraction) {
        await db.collection('attraction/' + attraction.id + '/review').where("created_at", ">", dt2).get()
          .then(function(querySnapshot1) {
            querySnapshot1.forEach(function(review) {
              if(review.data().active == true && review.data().comment) {
                z++;
                document.getElementById("newComments30DaysCount").innerHTML = z;
              }
            })
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

async function getAttractionArea(latitude, longitude) {
  var url = "https://us-central1-fir-test-c91f4.cloudfunctions.net/checkArea?x="
          + latitude + "&y=" + longitude;
  return await $.ajax({
			url: url,
			success: function(result) {
        return String(result);
			},
			error: function(R) {
				console.log(R);
			},
			dataType: 'json'
    });
}

// Map and charts population
$(async function () {
  'use strict';

  // jvectormap data
  var visitorsData = {
    HC:   0,  // Hunebed Centre
    D27:  0,  // Hunebed D27
    HGEG: 0,  // Hundsrug Geopark Expedition Gateway
    PP:   0,  // Prehistoric Park
    BG:   0   // Boulder Garden
  };
  var pieData = {
    HC:   0,  // Hunebed Centre
    D27:  0,  // Hunebed D27
    HGEG: 0,  // Hundsrug Geopark Expedition Gateway
    PP:   0,  // Prehistoric Park
    BG:   0   // Boulder Garden
  };

  await db.collection("attraction").where("active", "==", true).get()
    .then(async function(querySnapshot) {
      await querySnapshot.forEach(async function(attraction) {
        let areaCode = await getAttractionArea(attraction.data().geopoint.latitude, attraction.data().geopoint.longitude);
        let comments = 0;
        await db.collection("attraction").doc(attraction.id).collection("review").get().then(snap => {
          comments = snap.size;
        });
        console.log(areaCode.result + " " + comments);
        switch(areaCode.result) {
          case "HC":
            visitorsData.HC += attraction.data().views;
            pieData.HC      += comments;
            break;
          case "D27":
            visitorsData.D27 += attraction.data().views;
            pieData.D27      += comments;
            break;
          case "HGEG":
            visitorsData.HGEG += attraction.data().views;
            pieData.HGEG      += comments;
            break;
          case "PP":
            visitorsData.PP += attraction.data().views;
            pieData.PP      += comments;
            break;
          case "BG":
            visitorsData.BG += attraction.data().views;
            pieData.BG      += comments;
            break;
          default:
            console.log("Location not found in areas. Lat: " + attraction.data().geopoint.latitude + " Lon: " + attraction.data().geopoint.longitude);
            break;
        }
      });
      console.log(visitorsData);
      console.log(pieData);
      populateMap();
      populatePieChart();
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
  
  //-------------
  //- BAR CHART -
  //-------------
  var barChartCanvas  = $('#barChart').get(0).getContext('2d');
  var barChart        = new Chart(barChartCanvas);

  //Prepare month labels starting this month
  var monthsEnglishShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
  await db.collection("user").where("created_at", ">", lastYear).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(user) {
        let userDate = new Date(user.data().created_at.seconds * 1000);
        monthlyUsers[monthNumbers[userDate.getMonth()]]++;
      })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  var barChartData = {
    labels  : monthLabels,
    datasets: [{
      label               : 'Visitors',
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
    scaleBeginAtZero        : true, //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleShowGridLines      : true, //Boolean - Whether grid lines are shown across the chart
    scaleGridLineColor      : 'rgba(0,0,0,.05)', //String - Colour of the grid lines
    scaleGridLineWidth      : 1, //Number - Width of the grid lines
    scaleShowHorizontalLines: true, //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowVerticalLines  : false, //Boolean - Whether to show vertical lines (except Y axis)
    barShowStroke           : true, //Boolean - If there is a stroke on each bar
    barStrokeWidth          : 2, //Number - Pixel width of the bar stroke
    barValueSpacing         : 5, //Number - Spacing between each of the X value sets
    barDatasetSpacing       : 1, //Number - Spacing between data sets within X values
    legendTemplate          : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>', //String - A legend template
    responsive              : true, //Boolean - whether to make the chart responsive
    maintainAspectRatio     : true
  };

  barChartOptions.datasetFill = false;
  barChart.Bar(barChartData, barChartOptions);

  function populateMap() {
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
  }

  function populatePieChart() {
    //-------------
    //- PIE CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var pieChartCanvas = $('#pieChart').get(0).getContext('2d');
    var pieChart       = new Chart(pieChartCanvas);
    var PieData        = [
      {
        value    : pieData.HC,
        color    : 'rgb(229,29,68)',
        highlight: 'rgb(229,29,68)',
        label    : 'Hunebed Centre'
      },
      {
        value    : pieData.D27,
        color    : 'rgb(237,212,211)',
        highlight: 'rgb(237,212,211)',
        label    : 'Hunebed D27'
      },
      {
        value    : pieData.HGEG,
        color    : 'rgb(151,181,33)',
        highlight: 'rgb(151,181,33)',
        label    : 'Hundsrug Geopark Expedition Gateway'
      },
      {
        value    : pieData.PP,
        color    : 'rgb(191,213,199)',
        highlight: 'rgb(191,213,199)',
        label    : 'Prehistoric Park'
      },
      {
        value    : pieData.BG,
        color    : 'rgb(225,163,11)',
        highlight: 'rgb(225,163,11)',
        label    : 'Boulder Garden'
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
  }
});