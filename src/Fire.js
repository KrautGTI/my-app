
// TODO: pick firebase libraries you'll, delete the others so you aren't loading extra
import firebase from 'firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/firestore';   // for cloud firestore
import 'firebase/functions';   // for cloud functions
// import 'firebase/messaging'; // for cloud messaging

// TODO: include the config vars in the .env file
const liveConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_LIVE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_LIVE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_LIVE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_LIVE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_LIVE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_LIVE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_LIVE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_LIVE_MEASUREMENT_ID
};

// TODO: update me if you are using a test server
// const testConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_TEST_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_TEST_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_TEST_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_TEST_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_TEST_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_TEST_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_TEST_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_TEST_MEASUREMENT_ID
// };

// const config = (process.env.NODE_ENV === 'production' ? liveConfig : testConfig); 

const config = (liveConfig);

const fire = firebase.initializeApp(config);
const firestore = firebase.firestore();
const storage = firebase.storage();
const functions = firebase.functions();

// TODO: if you want in browser notifications, here is the setup for that
// const auth = firebase.auth();
// var messaging = null;

// if (firebase.messaging.isSupported()) {
//   messaging = firebase.messaging();
//   messaging.usePublicVapidKey(process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FIREBASE_LIVE_VAPID_KEY : process.env.REACT_APP_FIREBASE_TEST_VAPID_KEY);
// }

// export async function handleTokenRefresh() {
//   if(auth.currentUser){
//     return messaging.getToken()
//       .then((token) => {
//         firestore.collection("users").doc(auth.currentUser.uid).collection("tokens").doc("push").set({ token: token }, { merge: true })
//             .then(() => {
//                 console.log("Successfully updated push notification token.")
//             })
//             .catch((error) => {
//                 console.error("Error setting push notification token: " + error)
//             })
//       }).catch((error) => {
//           console.error("Error getting token: " + error)
//       })
//   } else {
//     return console.log("auth.currentUser is not set, might be signed out")
//   }
  
// }

export { 
  firebase, 
  fire, 
  firestore, 
  storage, 
  functions, 
  // messaging 
};
