function draw(){
    setTimeout(function(){
        document.getElementById('timeline');
        ratings.forEach(element => {
            
            createCommentItem(element.attractionId,element.attractionName,element.id);
        });
    },150);
}

function createCommentItem(attractionId,attractionName,reviewDoc){
      
    db.collection('attraction').doc(attractionId).collection('review').doc(reviewDoc).onSnapshot(function(doc){
        
      
    reviewDoc = doc;
       
    getDates(reviewDoc.data().created_at.toDate().getFullYear(),reviewDoc.data().created_at.toDate().getMonth(),reviewDoc.data().created_at.toDate().getDate());
    
    if(document.getElementById(reviewDoc.id + ' c') != null){
        //console.log(reviewDoc.id+' exists');
        var text = document.getElementById(reviewDoc.id + ' c');
        text.innerHTML = reviewDoc.data().comment;
    }else{
        //console.log(reviewDoc.id+' doesnt');
        var li = document.createElement("li");

        iStar = document.createElement('i');
        iStar.className = "fa fa-comment bg-blue";

        var divTimelineItem = document.createElement("div");
        divTimelineItem.className="timeline-item";
    
        if(pathname != null && pathname == reviewDoc.id){

            divTimelineItem.style.outline.none;
            divTimelineItem.style.borderColor = "#FF0000";
            divTimelineItem.style.boxShadow = "0 0 10px #FF0000";
            //divTimelineItem.scrollIntoView();
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
                    //alert("Comment updated!");
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
  
