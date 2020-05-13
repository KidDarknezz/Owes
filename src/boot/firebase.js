// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app")

// Add the Firebase products that you want to use
require("firebase/auth")
require("firebase/database")
require("firebase/storage")

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDPVhfra9qBe605id7RD5Q8eyVwWeI5t5M",
	authDomain: "owes-c686b.firebaseapp.com",
	databaseURL: "https://owes-c686b.firebaseio.com",
	projectId: "owes-c686b",
	storageBucket: "owes-c686b.appspot.com",
	messagingSenderId: "372724803848",
	appId: "1:372724803848:web:338330ca964ad664c6e4bd",
	measurementId: "G-E6SNZR52WJ"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.database()
let firebaseStorage = firebaseApp.storage()

export { firebaseAuth, firebaseDb, firebaseStorage }
