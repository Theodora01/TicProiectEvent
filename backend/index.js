const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const db = require('./database');
const admin = require("firebase-admin");
//const firebaseAuth = require('firebase/auth');
const eventsRoute = require("./events"); 
const port = 5000;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { v4: uuidv4 } = require('uuid');

function validatePassword(password){
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// Înregistrare utilizatori
app.post('/api/register', async (req, res) => {
  try {
    const { nume, prenume, email, password } = req.body;

    if(!validatePassword(password)){
       return res.status(400).json({message:'Parola trebuie să aibă minim 8 caractere, o literă mare, un număr și un caracter special!' });
    }

    if (!nume || !prenume || !email || !password) {
      return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii!' });
    }
    
    const userRegister = await admin.auth().createUser({
      email: email,
      password: password
    });

    const idUnic = uuidv4();

    await db.collection('users').doc(userRegister.uid).set({
      id: idUnic,
      nume,
      prenume,
      email
    });

    res.status(201).json({ message: 'Utilizator inregistrat cu succes!'});
  } catch (error) {
    console.error('Eroare in timpul inregistrarii:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Autentificare utilizator
const SECRET_KEY = 'SECRET_KEY';

app.post('/api/login', async (req,res) => {

  const { email } = req.body;
  try{
    const userCredential = await admin.auth().getUserByEmail(email);

    const token = jwt.sign(
      {
        uid : userCredential.uid,
        email: userCredential.email
      },
      SECRET_KEY,
      { expiresIn: '1h' } 
    );
    console.log("Token JWT generat:", token);

    const userDoc = await db.collection('users').doc(userCredential.uid).get();
    const userData = userDoc.data();

    if (!userDoc.exists) {
      console.error("Documentul utilizatorului nu există.");
    }
    if (!userData) {
      return res.status(404).json({ message: 'Utilizatorul nu are date asociate!' });
    }
    res.status(200).json({
      message: 'Autentificare reusita!',
      token,
      user: {
        uid: userCredential.uid,
        prenume: userData.prenume,
        nume: userData.nume,
        email: userData.email,
      },
    });
  
  }catch(error) {
    console.error('Eroare in timpul autentificarii!', error);
    res.status(401).json({ message: 'Email sau parola incorecta!'});
  }

});

app.use("/events", eventsRoute); 
app.get("/", (req, res) => {
  res.send("Serverul Express funcționează!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = {app, db };
