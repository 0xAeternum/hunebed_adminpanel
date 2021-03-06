//Draw items and check if new items have been added and draw them
function draw(){
    var lenght = ratings.length;
    setInterval(function(){
        if(lenght == ratings.length){
       

        }else{
            lenght = ratings.length;
            document.getElementById('timeline').innerHTML = '';
            ratings.forEach(element => {       
                createRatingItem(element.attractionId,element.attractionName,element.id);
            });
        }
    },250);
}
//Create a rating item and when data is updated reload the rating item 
function createRatingItem(attractionId,attractionName,reviewDoc){
    db.collection('attraction').doc(attractionId).collection('review').doc(reviewDoc).onSnapshot(function(doc){
        reviewDoc = doc;
        if(reviewDoc.data().rating != undefined){
            getDates(reviewDoc.data().created_at.toDate().getFullYear(),reviewDoc.data().created_at.toDate().getMonth(),reviewDoc.data().created_at.toDate().getDate());
            if(document.getElementById(reviewDoc.id ) != null){
                var text = document.getElementById(reviewDoc.id);
                if(reviewDoc.data().rating > 7){
                    text.className = 'h1 text-success';
                }else if(reviewDoc.data().rating > 3){
                    text.className = 'h1 text-warning';
                }else{
                    text.className = 'h1 text-danger';
                }
                text.innerHTML = reviewDoc.data().rating;
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
                
                    divTimelineBody.className = "timeline-body";
                    divTimelineBody.style.paddingBottom = "2%";
                    var number = document.createElement('span');
                    number.id = reviewDoc.id;
                    if(reviewDoc.data().rating > 7){
                        number.className = 'h1 text-success';
                    }else if(reviewDoc.data().rating > 3){
                        number.className = 'h1 text-warning';
                    }else{
                        number.className = 'h1 text-danger';
                    }
                    number.innerHTML = reviewDoc.data().rating;
        
        
        
                    li.appendChild(iStar);
                    li.appendChild(divTimelineItem);           
                    
                    span.appendChild(iClock);     
        
                    divTimelineBody.appendChild(number);
        
                    divTimelineItem.appendChild(span);
                    divTimelineItem.appendChild(timelineHeader);
                    divTimelineItem.appendChild(divTimelineBody);
                    
                    document.getElementById("timeline").appendChild(li);   
                }
        }

    });
}