import firebase from 'firebase/app';
// eslint-disable-next-line import/no-duplicates

import 'firebase/database';
// eslint-disable-next-line import/no-duplicates
import 'firebase/auth';

const offline = false;
const CONFIGS = {
  production: {
    apiKey: "AIzaSyCRPmcHWHFzp-o1N4f0CUxyMxuNAckksU8",
    authDomain: "crossworld-8f2b0.firebaseapp.com",
    databaseURL: "https://crossworld-8f2b0-default-rtdb.firebaseio.com",
    projectId: "crossworld-8f2b0",
    storageBucket: "crossworld-8f2b0.appspot.com",
    messagingSenderId: "941944703099",
    appId: "1:941944703099:web:249fa25e731462046afade",
    measurementId: "G-Q3XESGY4J7"
  },
  development: {
    apiKey: "AIzaSyCW7JO8IyiOd1-EcVIdXGDw7Qot7axDJ3g",
    authDomain: "crossworld--dev.firebaseapp.com",
    databaseURL: "https://crossworld--dev-default-rtdb.firebaseio.com",
    projectId: "crossworld--dev",
    storageBucket: "crossworld--dev.appspot.com",
    messagingSenderId: "572818054731",
    appId: "1:572818054731:web:2a800ce5579a5749c0b7ce",
    measurementId: "G-LZQ0283BFR"
  },
};
const config = CONFIGS["development"];

firebase.initializeApp(config);
const db = firebase.database();

const SERVER_TIME = firebase.database.ServerValue.TIMESTAMP;

const offsetRef = firebase.database().ref('.info/serverTimeOffset');
let offset = 0;

offsetRef.once('value', (result) => {
  offset = result.val();
});

function getTime() {
  return new Date().getTime() + offset;
}

export {offline, getTime};
export {db, SERVER_TIME};
export default firebase;
