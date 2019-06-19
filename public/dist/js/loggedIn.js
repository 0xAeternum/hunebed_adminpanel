firebase.auth().onAuthStateChanged(function(user) {
    //var currentPage = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    if (user) {
        document.getElementById('profileImage').setAttribute('src', user.photoURL);
        document.getElementById('displayName').innerHTML = user.displayName;
        document.getElementById('profileImageL').setAttribute('src', user.photoURL);
        document.getElementById('displayNameL').innerHTML = user.displayName;
    } else {
        logout();
    }
});
