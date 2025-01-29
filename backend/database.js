const admin = require("firebase-admin");

const serviceAccount = require('C:/Users/Theodora/OneDrive/Desktop/Proiect_TIC/backend/eventmanager-b53d2-firebase-adminsdk-16g9v-c6271c1f05.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
 
module.exports = db;