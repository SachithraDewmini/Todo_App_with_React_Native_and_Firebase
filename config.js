import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAhFhZq53jt20fXBMgvzlA9TwLx3sLIjIY",
    authDomain: "todo-c0d74.firebaseapp.com",
    projectId: "todo-c0d74",
    storageBucket: "todo-c0d74.appspot.com",
    messagingSenderId: "356677119757",
    appId: "1:356677119757:web:df76243b0480a4a04e0a44",
    measurementId: "G-SKVF74CCDW"
}

// Initialize Firebase only if it hasn't been initialized yet
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
