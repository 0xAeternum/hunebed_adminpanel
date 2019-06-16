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
  var pathname = window.location.href.split('#')[1] ;
  
  function getDates(y,m,d){

    if(cacheY != y || cacheM != m || cacheD  != d){
        cacheY = y;
        cacheM = m;
        cacheD = d;

        var li = document.createElement("li");
        li.className = "time-label";
        var span = document.createElement("span"); 
        span.className = "bg-red";
        span.innerHTML = cacheD + " " + months[cacheM] + " " + cacheY; 
        li.appendChild(span);
        document.getElementById("timeline").appendChild(li);   

    }
  }

  function getReviews(type){

    db.collection("reviews").orderBy("created_at", 'desc').onSnapshot(function (querySnapshot) {
        document.getElementById("timeline").innerHTML = "";
        querySnapshot.forEach(function (doc) {
           if(doc.data().active == true && doc.data().type == type){
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

  function createCommentItem(reviewDoc){
  

    
    

    var li = document.createElement("li");
  

    var iStar = document.createElement("i");
    iStar.className = "fa fa-comment bg-blue";

    var divTimelineItem = document.createElement("div");
    divTimelineItem.className="timeline-item";
 
    if(pathname != null && pathname == reviewDoc.id){

        divTimelineItem.style.outline.none;
        divTimelineItem.style.borderColor = "#FF0000";
        divTimelineItem.style.boxShadow = "0 0 10px #FF0000";
    }

    divTimelineItem.addEventListener("mouseover", function(){
       
        divTimelineItem.style.outline.none;
        divTimelineItem.style.borderColor = "#FF0000";
        divTimelineItem.style.boxShadow = "0 0 10px #FF0000";
    });
    divTimelineItem.addEventListener("mouseout", function(){
       
        setTimeout(function(){
            divTimelineItem.style.outline.none;
            divTimelineItem.style.borderColor = "black";
            divTimelineItem.style.boxShadow = "0 0 0px black";
        }, 650);

    });
    
    var iClock = document.createElement("i");
    iClock.className = "fa fa-clock-o";

    var span = document.createElement("span"); 
    span.className = "time";
    span.innerHTML = createTimeAgoTimestamp(reviewDoc);
    span.className = "time";
    setInterval(() => {
        span.innerHTML = span.innerHTML = createTimeAgoTimestamp(reviewDoc);
        span.appendChild(iClock);   
      }, 500);

    var timelineHeader = document.createElement("h3");
    timelineHeader.className = "timeline-header";
    //console.log(getUser(reviewDoc.data().user.id));
    var user;
    
    db.collection("users").doc(reviewDoc.data().user.id).get().then(function(doc) {
        if (doc.exists) {
            user = doc.data().username;
            timelineHeader.innerHTML = "<b>" + user + "</b>" + " commented on " + "<b>" + reviewDoc.data().attraction.id + "</b>";           // console.log(user);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });
    
    
    var divTimelineBody = document.createElement("div");
    divTimelineBody.className = "timeline-body";
    divTimelineBody.innerHTML = reviewDoc.data().review;

    var divTimelineFooter = document.createElement("div");
    divTimelineFooter.className = "timeline-footer";
    
    var replyButton = document.createElement("a");
    replyButton.className = "btn btn-warning btn-xs";
    replyButton.innerHTML = "Reply";
    replyButton.style.marginRight = '3px';


    var manageButton = document.createElement("a");
    manageButton.className = "btn btn-primary btn-xs";
    manageButton.innerHTML = "Edit";
    manageButton.style.marginRight = '3px';


    manageButton.addEventListener("click" , function(){
        //alert(doc.data().comment);
       // document.getElementById("description").innerHTML = review.data().review; 
        //var text = '<div class="modal-content" style="margin: auto; margin-top: 90px; width: 70%; padding: 10px;">';
        
        var modal = document.createElement('div');
        modal.className = "modal";

        var modalContent = document.createElement('div');
        modalContent.className = "modal-content";
        modalContent.style = "margin: auto; margin-top: 90px; width: 70%; padding: 10px;";

        var pad = document.createElement('div');
        pad.className = 'pad';

        var textarea = document.createElement('textarea');
        textarea.className = "textarea";
        textarea.style = "width: 100%; height: 200px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;";
        textarea.innerHTML = reviewDoc.data().review; 

        window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
        }

        var label = document.createElement('label');
        label.innerHTML = 'Editing comment from ' + user;

        var updateButton = document.createElement('a');
        updateButton.className = 'btn btn-primary';
        updateButton.innerHTML = 'Update';
        
        updateButton.addEventListener('click',function(){
            db.collection('reviews').doc(reviewDoc.id).update(
                {
                    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                    review: textarea.value
                }   
            ).then(function() {
               // alert("Comment updated!");
                modal.style.display = "none";
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
            
        });
        
        pad.appendChild(label);
        pad.appendChild(textarea);
        pad.appendChild(updateButton);
        modalContent.appendChild(pad);
        modal.appendChild(modalContent);
        document.getElementsByClassName("content")[0].appendChild(modal);   
        modal.style.display = "block";  


    });
    
    var blockButton = document.createElement("a");
    blockButton.className = "btn btn-danger btn-xs";
    blockButton.innerHTML = "Delete and Block user";
    
    blockButton.addEventListener("click" , function(){    
            /*
            * undefined here
            */
        var r = confirm("Remove " + user + "s' comment ?");

        if (r == true) {

            db.collection("reviews").doc(reviewDoc.id).update({
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                active: false
            }).then(function() {
                alert("Document successfully deleted!");
                    /*
                    * undefined here
                    */
                var r = confirm("Block " + user + "?");

                if (r == true) {
                    
                    db.collection("users").doc(reviewDoc.data().user.id).get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            db.collection("users").doc(doc.id).update({                                  
                            updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                            status: true
                            }).then(function() {
                                //console.log("Document successfully written!");
                                alert("User successfully blocked!");
                                //location.reload();
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
                   // location.reload();
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

    divTimelineFooter.appendChild(replyButton);
    divTimelineFooter.appendChild(manageButton);   
    divTimelineFooter.appendChild(blockButton);   

    divTimelineItem.appendChild(span);  
    divTimelineItem.appendChild(timelineHeader);
    divTimelineItem.appendChild(divTimelineBody);
    divTimelineItem.appendChild(divTimelineFooter);
    
    document.getElementById("timeline").appendChild(li);   

    }
  

  function createRatingItem(reviewDoc){
    var li = document.createElement("li");
    
    var iStar = document.createElement("i");
    iStar.className = "fa fa-star bg-yellow";

    var divTimelineItem = document.createElement("div");
    divTimelineItem.className="timeline-item";
    

    
    if(pathname != null && pathname == reviewDoc.id){
        divTimelineItem.style.outline.none;
        divTimelineItem.style.borderColor = "#FF0000";
        divTimelineItem.style.boxShadow = "0 0 10px #FF0000";
    }

    divTimelineItem.addEventListener("mouseover", function(){
       
        divTimelineItem.style.outline.none;
        divTimelineItem.style.borderColor = "#FF0000";
        divTimelineItem.style.boxShadow = "0 0 10px #FF0000";
    });
    divTimelineItem.addEventListener("mouseout", function(){
       
        setTimeout(function(){
            divTimelineItem.style.outline.none;
            divTimelineItem.style.borderColor = "black";
            divTimelineItem.style.boxShadow = "0 0 0px black";
        }, 650);
    });

    var iClock = document.createElement("i");
    iClock.className = "fa fa-clock-o";

    var span = document.createElement("span"); 
    span.className = "time";
    span.innerHTML = createTimeAgoTimestamp(reviewDoc);
    setInterval(() => {
        span.innerHTML = createTimeAgoTimestamp(reviewDoc);
        span.appendChild(iClock);   
      }, 500);

    var timelineHeader = document.createElement("h3");
    timelineHeader.className = "timeline-header";

   db.collection("users").doc(reviewDoc.data().user.id).get().then(function(doc) {
        if (doc.exists) {
            user = doc.data().username;
        
            timelineHeader.innerHTML = "<b>" + user + "</b>" + " reviewed " + "<b>" + reviewDoc.data().attraction.id + "</b>";      // console.log(user);
        
            return user;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });
    


    var divTimelineBody = document.createElement("div");
    divTimelineBody.className = "timeline-body";
    divTimelineBody.style.paddingBottom = "2%";
    for(var x = reviewDoc.data().review; x > 0; x--) {
      
        var i = document.createElement('i');
        i.className = "fa fa-star pull-left";
        divTimelineBody.appendChild(i);
    }
    for(var x = 5 - reviewDoc.data().review; x > 0; x--) {

        var i = document.createElement('i');
        i.className = "fa fa-star-o pull-left";
        divTimelineBody.appendChild(i);
    }


    li.appendChild(iStar);
    li.appendChild(divTimelineItem);           
    
   span.appendChild(iClock);     

    divTimelineItem.appendChild(span);
    divTimelineItem.appendChild(timelineHeader);
    divTimelineItem.appendChild(divTimelineBody);
    
    document.getElementById("timeline").appendChild(li);   
  }


  function createTimeAgoTimestamp(reviewDoc){
    var time = reviewDoc.data().created_at;
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
        message += diffMinutes +  " minutes and "; 
    }
    message += " and " + diffSeconds + " seconds ago " ;

    return message;
  }


