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

  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var cacheY = cacheM = cacheD = null;
  
  function getDates(y,m,d){

    if(cacheY != y || cacheM != m || cacheD  != d){
        cacheY = y;
        cacheM = m;
        cacheD = d;

        var li = document.createElement("li");
        li.className = "time-label";
        var span = document.createElement("span"); 
        span.className = "bg-red";
        span.innerHTML = cacheD + " " + months[cacheM] + " " + cacheY; //diffDays + " days " + diffHours + " hours " +  diffMinutes +" minutes and " + diffSeconds + " seconds ago ";
        li.appendChild(span);
        document.getElementById("timeline").appendChild(li);   

    }
  }
  function getReviews(){

    db.collection("reviews").orderBy("created_at", 'desc').onSnapshot(function (querySnapshot) {
        document.getElementById("timeline").innerHTML = "";
        querySnapshot.forEach(function (doc) {
           if(doc.data().active == true){
            var time = doc.data().created_at;
            var diffTime = Date.now() - time.toDate();
            
            const diffDays = Math.floor(diffTime / 1000 / 60 / 60 / 24); 
            diffTime -= diffDays * 1000 * 60 * 60 * 24;

            const diffHours = Math.floor(diffTime / 1000 /60 / 60);
            diffTime -= diffHours * 1000 * 60 * 60;

            const diffMinutes = Math.floor(diffTime / 1000 / 60);
            diffTime -= diffMinutes * 1000 * 60;

            const diffSeconds = Math.floor(diffTime / 1000);


            getDates(time.toDate().getFullYear(),time.toDate().getMonth(),time.toDate().getDate());

            if(doc.data().type == 0){
                
                createCommentItem(doc,diffDays,diffHours,diffMinutes,diffSeconds);
            }
            else if(doc.data().type == 1)
            {
              
                createRatingItem(doc,diffDays,diffHours,diffMinutes,diffSeconds);
            }else{

            }

           }


        });
    });
  }

  function createCommentItem(review){

    var li = document.createElement("li");
    var iStar = document.createElement("i");
    iStar.className = "fa fa-envelope bg-blue";

    var divTimelineItem = document.createElement("div");
    divTimelineItem.className="timeline-item";
    
    var iClock = document.createElement("i");
    iClock.className = "fa fa-clock-o";

    var span = document.createElement("span"); 
    span.className = "time";
    span.innerHTML = createTimeAgoTimestamp(review);
    setInterval(() => {
        span.innerHTML = createTimeAgoTimestamp(review);
        span.appendChild(iClock);   
      }, 500);

    var timelineHeader = document.createElement("h3");
    timelineHeader.className = "timeline-header";
    timelineHeader.innerHTML = "<b>" + getUser(review.data().user.id) + "</b>" + " commented on " + "<b>" + review.data().attraction.id + "</b>";
    
    var divTimelineBody = document.createElement("div");
    divTimelineBody.className = "timeline-body";
    divTimelineBody.innerHTML = review.data().review;

    var divTimelineFooter = document.createElement("div");
    divTimelineFooter.className = "timeline-footer";

    var viewButton = document.createElement("a");
    viewButton.className = "btn btn-primary btn-xs";
    viewButton.innerHTML = "View";
    viewButton.style.marginRight = '3px';

    viewButton.addEventListener("click" , function(){
        //alert(doc.data().comment);
        
        //document.getElementById("myModal").style.display = "block";               
        location.assign('../user_requests/comments-manage.html#'+review.id)
        // sessionStorage.setItem("comment",doc.data().comment);
    });

    li.appendChild(iStar);
    li.appendChild(divTimelineItem);

    span.appendChild(iClock);    

    divTimelineFooter.appendChild(viewButton);

    divTimelineItem.appendChild(span);  
    divTimelineItem.appendChild(timelineHeader);
    divTimelineItem.appendChild(divTimelineBody);
    divTimelineItem.appendChild(divTimelineFooter);
 
    
    document.getElementById("timeline").appendChild(li);   

    }
  

  function createRatingItem(review){
    var li = document.createElement("li");
    var iStar = document.createElement("i");
    iStar.className = "fa fa-star bg-yellow";

    var divTimelineItem = document.createElement("div");
    divTimelineItem.className="timeline-item";
    
    var iClock = document.createElement("i");
    iClock.className = "fa fa-clock-o";

    var span = document.createElement("span"); 
    span.className = "time";
    
    
    span.innerHTML = createTimeAgoTimestamp(review);
    span.className = "time";
    span.innerHTML = createTimeAgoTimestamp(review);
    setInterval(() => {
        span.innerHTML = createTimeAgoTimestamp(review);
        span.appendChild(iClock);   
      }, 500);

    var timelineHeader = document.createElement("h3");
    timelineHeader.className = "timeline-header";
    timelineHeader.innerHTML = "<b>" + getUser(review.data().user.id) + "</b>" + " reviewed " + "<b>" + review.data().attraction.id + "</b>";


    var divTimelineBody = document.createElement("div");
    divTimelineBody.className = "timeline-body";
    divTimelineBody.innerHTML = "Rating: " + review.data().review;

    var divTimelineFooter = document.createElement("div");
    divTimelineFooter.className = "timeline-footer";

    var viewButton = document.createElement("a");
    viewButton.className = "btn btn-primary btn-xs";
    viewButton.innerHTML = "View";
    viewButton.style.marginRight = '3px';

    viewButton.addEventListener("click" , function(){
        //alert(doc.data().comment);
        
        //document.getElementById("myModal").style.display = "block";               
        location.assign('../user_requests/ratings.html#'+review.id)
        // sessionStorage.setItem("comment",doc.data().comment);
    });

    li.appendChild(iStar);
    li.appendChild(divTimelineItem);           
    
    span.appendChild(iClock);     
 
    divTimelineFooter.appendChild(viewButton);

    divTimelineItem.appendChild(span);
    divTimelineItem.appendChild(timelineHeader);
    divTimelineItem.appendChild(divTimelineBody);
    divTimelineItem.appendChild(divTimelineFooter);
    
    document.getElementById("timeline").appendChild(li);   
  }
  function createTimeAgoTimestamp(review){
    var time = review.data().created_at;
    var diffTime = Date.now() - time.toDate();
    
    const diffDays = Math.floor(diffTime / 1000 / 60 / 60 / 24); 
    diffTime -= diffDays * 1000 * 60 * 60 * 24;

    const diffHours = Math.floor(diffTime / 1000 /60 / 60);
    diffTime -= diffHours * 1000 * 60 * 60;

    const diffMinutes = Math.floor(diffTime / 1000 / 60);
    diffTime -= diffMinutes * 1000 * 60;

    const diffSeconds = Math.floor(diffTime / 1000);

    var message = '';

    if(diffDays != 0){
        message += diffDays + " days ";
    }
    if(diffHours != 0){
        message += diffHours + " hours "; 
    }
    if(diffMinutes != 0){
        message += diffMinutes +  " minutes"; 
    }
    message += " and " + diffSeconds + " seconds ago " ;

    return message;
  }
  function getUser(id){
    db.collection("users").doc(id).get().then(function(doc) {
        if (doc.exists) {
            user = doc.data().username;
            console.log(user);
            return user;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });
  }

