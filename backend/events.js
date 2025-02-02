const express = require("express");
const db = require("./database");
const { v4: uuidv4 } = require("uuid");
const authenticateUser = require("./middleware/authMiddleware");

const routeEvents = express.Router();

routeEvents.post("/add",authenticateUser, async (req , res) => {
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
            idUser,
            participant: 0
        });

        res.status(201).json({ message: "Eveniment adaugat!", id: eventId})
    }catch(error){
        console.error("Eroare la salvarea evenimentului", error);
        res.status(500).json({ error : "Evenimentul nu a putut fi adaugat."})
    }
});

routeEvents.delete("/delete/:id",authenticateUser, async (req, res) => {
    try {
      const eventId = req.params.id;
      await db.collection("events").doc(eventId).delete();
      res.status(200).json({ message: "Eveniment șters cu succes!" });
    } catch (error) {
      console.error("Eroare la ștergerea evenimentului:", error);
      res.status(500).json({ error: "Eroare la ștergerea evenimentului." });
    }
});

routeEvents.put("/update/:id",authenticateUser, async (req, res) => {
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

routeEvents.get("/getAllEvents/:idUser", async (req, res) =>{

    const {idUser} = req.params;
    try{
        const snapshot = await db.collection("events").get();

        if(snapshot.empty){
            return res.status(404).json({ error: "Nu exista evenimente disponibile."});
        }

        const events = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(event => event.idUser !== idUser);

        res.status(200).json(events);
    }catch(error){
        res.status(500).json({ message: "Eroare la obtinerea evenimentelor"});
    }
});

routeEvents.post("/join/:idEvent",authenticateUser, async (req, res) =>{
    const {idEvent} =req.params;
    const { idUser } = req.body;

    try{
        const eventRef = db.collection("events").doc(idEvent);
        const eventDoc = await eventRef.get();

        if(!eventDoc.exists){
            return res.status(404).json({ message: "Evenimentul nu exista"});
        }

        const participants = eventDoc.data().participants || [];

        if (participants.includes(idUser)) {
            return res.status(400).json({ message: "Ești deja înscris la acest eveniment." });
        }
        participants.push(idUser);
        await eventRef.update({
            participants, 
            participant: participants.length,
        });
        res.status(200).json({ message: "Te-ai înscris la eveniment!" });
    }catch (error) {
        console.error("Eroare la înscriere:", error);
        res.status(500).json({ error: "Nu s-a putut actualiza evenimentul." });
    }
});

routeEvents.delete("/removeExpiredEvents", async() =>{
    try{
        const currentDate = new Date().toISOString().split('T')[0];

        const snapshot = await db.collection("events")
            .where('date', '<', currentDate)
            .get()

        for(const element of snapshot.docs) {
            const eventRef = db.collection('events').doc(element.id);
            await eventRef.delete();
        }

    }catch (error) {
        console.error("Eroare la ștergerea evenimentelor expirate:", error);
    }
});

routeEvents.post("/unsubscribeEvent/:idEvent",authenticateUser, async (req, res) =>{
    const {idEvent} =req.params;
    const { idUser } = req.body;

    try{
        const eventRef = db.collection("events").doc(idEvent);
        const eventDoc = await eventRef.get();

        if(!eventDoc.exists){
            return res.status(404).json({ message: "Evenimentul nu exista"});
        }

        const participants = eventDoc.data().participants || [];

        const updateParticipants = participants.filter((participant) => participant!== idUser)

        await eventRef.update({
            participants: updateParticipants,
            participant: updateParticipants.length
        })
        res.status(200).json({ message: "Te-ai dezabonat de la eveniment!" });
    }catch (error) {
        console.error("Eroare la dezabonare:", error);
        res.status(500).json({ error: "Nu s-a putut dezabonare eveniment." });
    }
});

module.exports = routeEvents;