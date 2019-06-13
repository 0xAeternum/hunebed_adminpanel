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
  
  function getRatings(){

    db.collection("rating").orderBy("date", 'desc').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
           // var dateDiff = Date.now() - doc.data().date.seconds;
            var time = doc.data().date;
            var diffTime = Date.now() - time.toDate();
            
            const diffDays = Math.floor(diffTime / 1000 / 60 / 60 / 24); 
            diffTime -= diffDays * 1000 * 60 * 60 * 24;

            const diffHours = Math.floor(diffTime / 1000 /60 / 60);
            diffTime -= diffHours * 1000 * 60 * 60;

            const diffMinutes = Math.floor(diffTime / 1000 / 60);
            diffTime -= diffMinutes * 1000 * 60;

            const diffSeconds = Math.floor(diffTime / 1000);


            getDates(time.toDate().getFullYear(),time.toDate().getMonth(),time.toDate().getDate());


            var li = document.createElement("li");
            var iStar = document.createElement("i");
            iStar.className = "fa fa-star bg-yellow";

            var divTimelineItem = document.createElement("div");
            divTimelineItem.className="timeline-item";
            
            var iClock = document.createElement("i");
            iClock.className = "fa fa-clock-o";

            var span = document.createElement("span"); 
            span.className = "time";
            span.innerHTML = diffDays + " days " + diffHours + " hours " +  diffMinutes +" minutes and " + diffSeconds + " seconds ago ";

            var timelineHeader = document.createElement("h3");
            timelineHeader.className = "timeline-header";
            timelineHeader.innerHTML = "<b>" + doc.data().user + "</b>" + " reviewed " + "<b>" + doc.data().attraction + "</b>";


            var divTimelineBody = document.createElement("div");
            divTimelineBody.className = "timeline-body";
            divTimelineBody.innerHTML = "Rating: " + doc.data().rating;
            li.appendChild(iStar);
            li.appendChild(divTimelineItem);           
            
            span.appendChild(iClock);     

            divTimelineItem.appendChild(span);
            divTimelineItem.appendChild(timelineHeader);
            divTimelineItem.appendChild(divTimelineBody);
            
            document.getElementById("timeline").appendChild(li);   
        });
    });
  }

  function getComments(){
    db.collection("comments").orderBy('date','desc').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
           // var dateDiff = Date.now() - doc.data().date.seconds;
           if(doc.data().active){

           
            var time = doc.data().date;
            var diffTime = Date.now() - time.toDate();
            
            const diffDays = Math.floor(diffTime / 1000 / 60 / 60 / 24); 
            diffTime -= diffDays * 1000 * 60 * 60 * 24;

            const diffHours = Math.floor(diffTime / 1000 /60 / 60);
            diffTime -= diffHours * 1000 * 60 * 60;

            const diffMinutes = Math.floor(diffTime / 1000 / 60);
            diffTime -= diffMinutes * 1000 * 60;

            const diffSeconds = Math.floor(diffTime / 1000);

            getDates(time.toDate().getFullYear(),time.toDate().getMonth(),time.toDate().getDate());

            var li = document.createElement("li");
            var iStar = document.createElement("i");
            iStar.className = "fa fa-envelope bg-blue";

            var divTimelineItem = document.createElement("div");
            divTimelineItem.className="timeline-item";
            
            var iClock = document.createElement("i");
            iClock.className = "fa fa-clock-o";

            var span = document.createElement("span"); 
            span.className = "time";
            span.innerHTML = diffDays + " days " + diffHours + " hours " +  diffMinutes +" minutes and " + diffSeconds + " seconds ago ";

            var timelineHeader = document.createElement("h3");
            timelineHeader.className = "timeline-header";
            timelineHeader.innerHTML = "<b>" + doc.data().user + "</b>" + " commented on " + "<b>" + doc.data().attraction + "</b>";
            
            var divTimelineBody = document.createElement("div");
            divTimelineBody.className = "timeline-body";
            divTimelineBody.innerHTML = "Comment: " + doc.data().comment;

            var divTimelineFooter = document.createElement("div");
            divTimelineFooter.className = "timeline-footer";
            
            var manageButton = document.createElement("a");
            manageButton.className = "btn btn-primary btn-xs";
            manageButton.innerHTML = "Edit";
            manageButton.style.marginLeft = '10pt';

            
            manageButton.addEventListener("click" , function(){
                //alert(doc.data().comment);
                
                document.getElementById("myModal").style.display = "block";               

               // sessionStorage.setItem("comment",doc.data().comment);
            });
            

            var blockButton = document.createElement("a");
            blockButton.className = "btn btn-danger btn-xs";
            blockButton.innerHTML = "Delete and Block user";
            
            blockButton.addEventListener("click" , function(){    
                var r = confirm("Remove " + doc.data().user + "s' comment ?");

                if (r == true) {

                    db.collection("comments").doc(doc.id).update({
                        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                        active: false
                    }).then(function() {
                        alert("Document successfully deleted!");

                        var r = confirm("Block " + doc.data().user + "?");

                        if (r == true) {

                            db.collection("users").where("username", "==", doc.data().user).get()
                            .then(function(querySnapshot) {
                                querySnapshot.forEach(function(doc) {
                                    db.collection("users").doc(doc.id).update({                                  
                                    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                                    status: true
                                    }).then(function() {
                                        //console.log("Document successfully written!");
                                        alert("User successfully blocked!");
                                        location.reload();
                                    })
                                    .catch(function(error) {
                                        console.error("Error writing document: ", error);
                                    });
                                });
                            })
                            .catch(function(error) {
                                console.log("Error getting documents: ", error);
                            });

                        }else{
                            location.reload();
                        }                
                    }).catch(function(error) {
                        console.error("Error removing document: ", error);
                    });

                } else {
                    alert("Cancelled");
                }
            });
            
            
            li.appendChild(iStar);
            li.appendChild(divTimelineItem);

            span.appendChild(iClock);    

            divTimelineFooter.appendChild(manageButton);   
            divTimelineFooter.appendChild(blockButton);   

            divTimelineItem.appendChild(span);  
            divTimelineItem.appendChild(timelineHeader);
            divTimelineItem.appendChild(divTimelineBody);
            divTimelineItem.appendChild(divTimelineFooter);
          
            document.getElementById("timeline").appendChild(li);   

        }
        });
    });
  }
  

