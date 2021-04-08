// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyB-KY8JemBkrSSvjyHWYDMHIDwHS8VceBE",
  authDomain: "pin-projekti-51dd8.firebaseapp.com",
  databaseURL: "https://pin-projekti-51dd8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pin-projekti-51dd8",
  storageBucket: "pin-projekti-51dd8.appspot.com",
  messagingSenderId: "429832576902",
  appId: "1:429832576902:web:d3c51d1a69aea658589607",
  measurementId: "G-343D7QF0NT"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Kreiranje objekta Firebase baze
var oDb = firebase.database(); //kompletna baza
var oDbProjekti = oDb.ref('Projekti'); //čvor projekti
var oDbAktivnosti = oDb.ref('Aktivnosti'); //čvor aktivnosti
var oDbKorisnici = oDb.ref('Korisnici'); //čvor usera
