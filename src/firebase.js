import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/storage'
import 'firebase/firestore'

// Initialize Firebase
firebase.initializeApp(
    {
        apiKey: "AIzaSyCsbWiLspbkrM8OOT1yGKfU2Jm_f9Fzg7c",
        authDomain: "reels-35c27.firebaseapp.com",
        projectId: "reels-35c27",
        storageBucket: "reels-35c27.appspot.com",
        messagingSenderId: "311722412629",
        appId: "1:311722412629:web:3972bfeb5e858b8e3962dc"
      }
)


export const auth = firebase.auth();    // auth
const firestore = firebase.firestore(); // firestore
// Collection/Tables from firestore(i.e DB)
export const database ={
    users:firestore.collection('users'),
    getCurrentTimeStamp : firebase.firestore.FieldValue.serverTimestamp //used to get the time when user signed in
}
export const storage = firebase.storage(); // storage of firebase
// export default firebase;