const db = require('./database');

db.collection('test')
  .get()
  .then(snapshot => {
    console.log('Firestore connection successful!');
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch(error => {
    console.error('Error connecting to Firestore:', error);
  });