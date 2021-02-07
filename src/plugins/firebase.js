import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD-OMUOxObfyO0OPCPQQL90PjWt3ILwE30",
    authDomain: "rapid-frontend-a1.firebaseapp.com",
    databaseURL: "https://rapid-frontend-a1-default-rtdb.firebaseio.com",
    projectId: "rapid-frontend-a1",
    storageBucket: "rapid-frontend-a1.appspot.com",
    messagingSenderId: "357581248809",
    appId: "1:357581248809:web:c0928c207fbf70f61fff38",
    measurementId: "G-LGJ9K5XQW3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

export default{
    install(Vue) {
        Vue.prototype.$firebase = firebase
        Vue.prototype.$database = firebase.database()
    },
    firebase: firebase
}