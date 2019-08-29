import firebase from 'firebase';
var config = {
    apiKey: "AIzaSyArj5W8bPDSlguPDmIxyAi3hQP8aS-7Oi0",
    authDomain: "grocery-list-6ba6e.firebaseapp.com",
    databaseURL: "https://grocery-list-6ba6e.firebaseio.com",
    projectId: "grocery-list-6ba6e",
    storageBucket: "grocery-list-6ba6e.appspot.com",
    messagingSenderId: "648934695198",
    appId: "1:648934695198:web:ba46cb363bd4efa7"
  };
  var fire = firebase.initializeApp(config);
  export default fire;