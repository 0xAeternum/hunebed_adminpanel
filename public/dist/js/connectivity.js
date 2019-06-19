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

var provider = new firebase.auth.GoogleAuthProvider();
var db = firebase.firestore();

function login(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
        
       
        db.collection('administrator').doc(result.user.uid).get().then(function(doc){
            if(doc.data().email == result.user.email){
               // console.log(doc.data());
                location.assign('../../pages/dashboard/statistics.html');
            }else{
              logout();
            }
        }).catch(function(error){
           // console.log(error);
           logout();
        });
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(error)
      });
}
function logout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        location.assign('../../pages/login.html');
      }).catch(function(error) {
        // An error happened.
      });
}
/*
$( document ).ready(function() {
    var user = firebase.auth().currentUser;

    if (user != null) {
        document.getElementById('profileImage').setAttribute('src', user.photoURL);
        document.getElementById('displayName').innerHTML = user.displayName;
        document.getElementById('profileImageL').setAttribute('src', user.photoURL);
        document.getElementById('displayNameL').innerHTML = user.displayName;
        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
    }
});*/




