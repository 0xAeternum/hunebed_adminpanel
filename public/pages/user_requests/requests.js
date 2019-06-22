var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var cacheY = cacheM = cacheD = null;
var pathname = window.location.href.split('#')[1] ;
var ratings = [];
function getReviews(){
    db.collection("attraction").where('active','==', true).onSnapshot(function (querySnapshot) {
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
                        
                        if(ratings.some(item => item.id === docid)){

                        }else{                       
                            ratings.push(review);    
                            ratings.sort((function(index){
                                return function(a, b){
                                    return (b.created === a.created  ? 0 : (b.created  < a.created  ? -1 : 1));
                                };
                            })(1));                                             
                        }
                    }           
                });
            });
        });
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

