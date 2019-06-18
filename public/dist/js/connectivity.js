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

function login(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
       
        // The signed-in user info.
        var user = result.user;
        sessionStorage.setItem('user',user.uid);
        console.log(user.uid);
        location.assign('../../pages/dashboard/timeline.html');
        
        

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