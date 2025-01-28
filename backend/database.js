const { getFirestore } = require('firebase-admin/firestore');
const admin = require("firebase-admin");

const serviceAccount = require('C:/Users/Theodora/TicProiect/backend/eventmanager-b53d2-firebase-adminsdk-16g9v-a073123781.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();
 
module.exports = db;