function draw(){
  setTimeout(function(){
    document.getElementById('timeline');
    ratings.forEach(element => {
       
        createFeedItem(element.attractionId,element.attractionName,element.id);
    });
  },150);
}

function createFeedItem(attractionId,attractionName,reviewDoc){

      
  db.collection('attraction').doc(attractionId).collection('review').doc(reviewDoc).onSnapshot(function(doc){
        
    reviewDoc = doc;  
    getDates(reviewDoc.data().created_at.toDate().getFullYear(),reviewDoc.data().created_at.toDate().getMonth(),reviewDoc.data().created_at.toDate().getDate());

   if(document.getElementById(reviewDoc.id +' r') != null || document.getElementById(reviewDoc.id +' c') != null){
      var rating = document.getElementById(reviewDoc.id + ' r');
      if(reviewDoc.data().rating > 7){
        rating.className = 'h2 text-success';
      }else if(reviewDoc.data().rating > 3){
        rating.className = 'h2 text-warning';
      }else{
        rating.className = 'h2 text-danger';
      }
      rating.innerHTML = reviewDoc.data().rating;
      var text = document.getElementById(reviewDoc.id + ' c');
      text.innerHTML = reviewDoc.data().comment;
     }else{
      var li = document.createElement("li");

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

      var iStar = document.createElement('i');
      iStar.className = "fa fa-comment bg-blue";

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
            var user = doc.data().username;
        
            timelineHeader.innerHTML = "<b>" + user + "</b>" + " reviewed " + "<b>" + attractionName + "</b>";     
    
        } else {

        }
      });

      var divTimelineBody = document.createElement("div");
      
      divTimelineBody.className = "timeline-body";
      divTimelineBody.style.paddingBottom = "2%";
      //Create rating
      var number = document.createElement('span');
      number.id = reviewDoc.id;
      if(reviewDoc.data().rating > 7){
          number.className = 'h2 text-success';
      }else if(reviewDoc.data().rating > 3){
          number.className = 'h2 text-warning';
      }else{
          number.className = 'h2 text-danger';
      }
      number.innerHTML = reviewDoc.data().rating;
       //Create comment
      var text = document.createElement("span");
      text.id = reviewDoc.id + ' c';
      text.className = "timeline-body";
      text.innerHTML = reviewDoc.data().comment;
             
      span.appendChild(iClock);     

      divTimelineBody.appendChild(number);

      divTimelineBody.appendChild(text);
      divTimelineItem.appendChild(span);
      divTimelineItem.appendChild(timelineHeader);

      li.appendChild(iStar);
      li.appendChild(divTimelineItem);

      divTimelineItem.appendChild(divTimelineBody);
      
      document.getElementById("timeline").appendChild(li);   
  
          
    }
   

      

  


    
      
    
  });
}