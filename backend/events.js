const express = require("express");
const db = require("./database");
const { v4: uuidv4 } = require("uuid");

const routeEvents = express.Router();

routeEvents.post("/add", async (req , res) => {
    try{
        const {title, description, date, idUser} = req.body;

        if(!title || !description || !date || !idUser){
            return res.status(400).json({ error: "Toate campurile sunt obligatorii."});
        }

        const eventId = uuidv4();
        await db.collection("events").doc(eventId).set({
            id: eventId,
            title,
            description,
            date,
            idUser
        });

        res.status(201).json({ message: "Eveniment adaugat!", id: eventId})
    }catch(error){
        console.error("Eroare la salvarea evenimentului", error);
        res.status(500).json({ error : "Evenimentul nu a putut fi adaugat."})
    }
});

routeEvents.delete("/delete/:id", async (req, res) => {
    try {
      const eventId = req.params.id;
      await db.collection("events").doc(eventId).delete();
      res.status(200).json({ message: "Eveniment șters cu succes!" });
    } catch (error) {
      console.error("Eroare la ștergerea evenimentului:", error);
      res.status(500).json({ error: "Eroare la ștergerea evenimentului." });
    }
});

routeEvents.put("/update/:id", async (req, res) => {
    try {
      const eventId = req.params.id;
      const { title, description, date } = req.body;
  
      await db.collection("events").doc(eventId).update({
        title,
        description,
        date,
      });
  
      const updatedEvent = (await db.collection("events").doc(eventId).get()).data();
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Eroare la actualizarea evenimentului:", error);
      res.status(500).json({ error: "Eroare la actualizarea evenimentului." });
    }
});

routeEvents.get("/getByUser/:idUser", async (req, res) => {
    const { idUser } = req.params;

    try {
        const snapshot = await db.collection("events").where("idUser", "==", idUser).get();

        if (snapshot.empty) {
            return res.status(404).json({ error: "Nu există evenimente pentru acest utilizator." });
        }

        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(events);
    } catch (error) {
        console.error("Eroare la obținerea evenimentelor:", error);
        res.status(500).json({ error: "Eroare la obținerea evenimentelor." });
    }
});

module.exports = routeEvents;