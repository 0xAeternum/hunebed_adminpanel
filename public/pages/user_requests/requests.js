

  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var cacheY = cacheM = cacheD = null;
  var pathname = window.location.href.split('#')[1] ;
  
  function getDates(y,m,d){

    if(cacheY != y || cacheM != m || cacheD  != d){
        
        cacheY = y;
        cacheM = m;
        cacheD = d;
        if(document.getElementById(cacheD + " " + months[cacheM] + " " + cacheY) == null){
            var li = document.createElement("li");
            li.id = cacheD + " " + months[cacheM] + " " + cacheY; 
            li.className = "time-label";
            var span = document.createElement("span"); 
            span.className = "bg-red";
            span.innerHTML = cacheD + " " + months[cacheM] + " " + cacheY; 
            li.appendChild(span);
            document.getElementById("timeline").appendChild(li);   
        }


    }
  }
/*
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
*/

  function getReviews(){

    db.collection("attraction").where('active','==', true).onSnapshot(function (querySnapshot) {
        
        var ratings = [];
        querySnapshot.forEach(function (doc) {
            var attractionId = doc.id; 
            var attractionName = doc.data().title; 
            db.collection("attraction").doc(doc.id).collection('review').orderBy("created_at", 'desc').onSnapshot(function(querySnapshot){
                //document.getElementById("timeline").innerHTML = "";
                querySnapshot.forEach(function (doc) {
                    if(doc.data().active == true ){
                        var docid = doc.id;
                        var created = doc.data().created_at.seconds;
                        var review = {id: docid,created: created, attractionId: attractionId, attractionName: attractionName};
                        
                       
                        //console.log(ratings);            
                        //ratings.find(rating => rating.some(item => item.id === docid));        
                       
                        //
                        /*
                        ratings.sort(function(obj1, obj2) {
                               
                            return obj1.created - obj2.created;
                        });*/
                        if(ratings.some(item => item.id === docid)){
                           
                            //console.log(ratings.length);
                        }else{
                            ratings.push(review); 
                            //console.log(ratings);     

                            //createCommentItem(review.attractionId,review.attractionName,review.id);
                            
                           //console.log(ratings.length);
                           //createRatingItem(review.attractionId,review.attractionName,review.id);
                           //createCommentItem(review.attractionId,review.attractionName,review.id);
                         
                           draw(ratings);
                        }

                    }
            
                });
 
                //document.getElementById("timeline").innerHTML = "";
                          
                //ratings.sort();
                

                //createCommentItem(review.attractionId,review.attractionName,review.id);
               console.log(ratings);
               
                 //var element = ratings[ratings.length - 1];
                     //createRatingItem(element.attractionId,element.attractionName,element.id);
               
            })
           
           
        });
        //console.log(ratings.find(rating => rating.items.some(item => item.id === docid)));
        


    });
  }

function draw(ratings){
    
    ratings.sort((function(index){
        return function(a, b){

            return (b.created === a.created  ? 0 : (b.created  < a.created  ? -1 : 1));
        };
        })(1));
        document.getElementById("timeline").innerHTML = "";
    ratings.forEach(element => {
        console.log(element.attractionName);
        createCommentItem(element.attractionId,element.attractionName,element.id);
    });
}
  function createCommentItem(attractionId,attractionName,reviewDoc){
      
    db.collection('attraction').doc(attractionId).collection('review').doc(reviewDoc).get().then(function(doc){
        
      
    reviewDoc = doc;
       
    getDates(reviewDoc.data().created_at.toDate().getFullYear(),reviewDoc.data().created_at.toDate().getMonth(),reviewDoc.data().created_at.toDate().getDate());
    
    if(document.getElementById(reviewDoc.id) != null){
        var text = document.getElementById(reviewDoc.id);
        text.innerHTML = reviewDoc.data().comment;
    }else{
        var li = document.createElement("li");

        iStar = document.createElement('i');
        iStar.className = "fa fa-comment bg-blue";

        var divTimelineItem = document.createElement("div");
        divTimelineItem.className="timeline-item";
    
        if(pathname != null && pathname == reviewDoc.id){

            divTimelineItem.style.outline.none;
            divTimelineItem.style.borderColor = "#FF0000";
            divTimelineItem.style.boxShadow = "0 0 10px #FF0000";
            divTimelineItem.scrollIntoView();
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
        
        db.collection("user").doc(reviewDoc.data().user.id).get().then(function(doc) {
            if (doc.exists) {
                user = doc.data().username;
                timelineHeader.innerHTML = "<b>" + user + "</b>" + " commented on " + "<b>" + attractionName + "</b>";           // console.log(user);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        });
        
        
        var divTimelineBody = document.createElement("div");
        divTimelineBody.id = reviewDoc.id+' c';
        divTimelineBody.className = "timeline-body";
        divTimelineBody.innerHTML = reviewDoc.data().comment;

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
            textarea.innerHTML = reviewDoc.data().comment; 

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
                db.collection('attraction').doc(attractionId).collection('review').doc(reviewDoc.id).update(
                    {
                        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                        comment: textarea.value
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

                db.collection('attraction').doc(attractionId).collection('review').doc(reviewDoc.id).update({
                    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                    active: false
                }).then(function() {
                    alert("Document successfully deleted!");
                        /*
                        * undefined here
                        */
                    var r = confirm("Block " + user + "?");

                    if (r == true) {
                        
                        db.collection("user").doc(reviewDoc.data().user.id).update({                                  
                                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                                blocked: true
                                }).then(function() {
                                    //console.log("Document successfully written!");
                                    alert("User successfully blocked!");
                                    //location.reload();
                                })
                                .catch(function(error) {
                                    console.error("Error writing document: ", error);
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
    });
    
}
  

  function createRatingItem(attractionId,attractionName,reviewDoc){
    db.collection('attraction').doc(attractionId).collection('review').doc(reviewDoc).onSnapshot(function(doc){
        reviewDoc = doc;
  
    getDates(reviewDoc.data().created_at.toDate().getFullYear(),reviewDoc.data().created_at.toDate().getMonth(),reviewDoc.data().created_at.toDate().getDate());
    if(document.getElementById(reviewDoc.id) != null){
        var text = document.getElementById(reviewDoc.id);
        
        for(var x = reviewDoc.data().rating; x > 0; x--) {
      
            var i = document.createElement('i');
            i.className = "fa fa-star pull-left";
            text.appendChild(i);
        }
        for(var x = 5 - reviewDoc.data().rating; x > 0; x--) {
    
            var i = document.createElement('i');
            i.className = "fa fa-star-o pull-left";
            text.appendChild(i);
        }
    }else{
    var li = document.createElement("li");

    var iStar = document.createElement("i");
    iStar.className = "fa fa-star bg-yellow";

    var divTimelineItem = document.createElement("div");
    divTimelineItem.className="timeline-item";
    

    
    if(pathname != null && pathname == reviewDoc.id){
        divTimelineItem.style.outline.none;
        divTimelineItem.style.borderColor = "#FF0000";
        divTimelineItem.style.boxShadow = "0 0 10px #FF0000";
        divTimelineItem.scrollIntoView();
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

   db.collection("user").doc(reviewDoc.data().user.id).get().then(function(doc) {
        if (doc.exists) {
            user = doc.data().username;
        
            timelineHeader.innerHTML = "<b>" + user + "</b>" + " reviewed " + "<b>" + attractionName + "</b>";      // console.log(user);
        
            return user;
        } else {
            // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            });
            


            var divTimelineBody = document.createElement("div");
            divTimelineBody.id = reviewDoc.id+' r';
            divTimelineBody.className = "timeline-body";
            divTimelineBody.style.paddingBottom = "2%";
            for(var x = reviewDoc.data().rating; x > 0; x--) {
            
                var i = document.createElement('i');
                i.className = "fa fa-star pull-left";
                divTimelineBody.appendChild(i);
            }
            for(var x = 5 - reviewDoc.data().rating; x > 0; x--) {

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
    });
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



