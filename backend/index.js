const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const db = require('./database');
const admin = require("firebase-admin");
const port = 5000;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { v4: uuidv4 } = require('uuid');

// Înregistrare utilizatori
app.post('/api/register', async (req, res) => {
  try {
    const { nume, prenume, email, password } = req.body;

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
    const user = await admin.auth().getUserByEmail(email);

    if(!user){
      return res.status(404).json({ message: 'Email sau parola incorecta!'});
    }

    const token = jwt.sign(
    {
      uid : user.uid,
      email: user.email
    },
    SECRET_KEY,
    { expiresIn: '1h' } 
    );

    res.status(200).json({
      message: 'Autentificare reusita!',
      token,
      user: {
        uid: user.uid,
        email: user.email
      },
    });
  }catch(error) {
    console.error('Eroare in timpul autentificarii!', error);
    res.status(401).json({ message: 'Email sau parola incorecta!'});
  }

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
module.exports = db;