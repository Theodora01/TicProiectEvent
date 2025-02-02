<template>
    <div class="main-page">
      <header class="header">
        <h1>Bun venit la Evenimente!</h1>
        <div class="user-info" v-if="isAuthenticated">
          <p>{{ user.prenume }} {{ user.nume }}</p>
          <button @click="logout">Deconectare</button>
        </div>
      </header>
  
      <section class="dashboard">
        <div class="event-panel">
        <h2>Creaza eveniment</h2>
        <form @submit.prevent ="handleSubmit">
          <label for="event-title">Titlu Eveniment:</label>
          <input id="event-title" type="text" v-model="eventForm.title" placeholder="Titlu Eveniment" required />

          <label for="event-description">Descriere Eveniment:</label>
          <textarea id="event-description" v-model="eventForm.description" placeholder="Descriere Eveniment" required></textarea>

          <label for="event-date">Data Eveniment:</label>
          <input id="event-date" type="date" v-model="eventForm.date" required />

          <button type="submit"> {{ eventForm.id ? "Actualizeaza Eveniment" : "Adauga Eveniment" }}</button>
        </form>
      </div>

      <div class="event-table">
        <h2>Evenimentele Mele</h2>
        <table>
          <thead>
            <tr>
              <th>Titlu</th>
              <th>Descriere</th>
              <th>Data</th>
              <th>Numar participanti</th>
              <th>Actiuni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id">
              <td>{{ event.title }}</td>
              <td>{{ event.description }}</td>
              <td>{{ event.date }}</td>
              <td>{{ event.participant }}</td>
              <td>
                <button @click="editEvent(event)">Editează</button>
                <button @click="deleteEvent(event.id)">Șterge</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="all-events">
      <div>
        <button @click="showJoined = false">Toate Evenimentele</button>
        <button @click="showJoined = true">Evenimentele la care particip</button>
      </div>

      <div v-if="showJoined">
        <div v-for="event in joinedEvents" :key="event.id" class="event-card">
          <h3>{{ event.title }}</h3>
          <p><strong>Descriere:</strong> {{ event.description }}</p>
          <p><strong>Data:</strong> {{ event.date }}</p>
          <p><strong>Număr participanți:</strong> {{ event.participant || 0 }}</p>
          <button @click="unsubscribeEvent(event.id)"> Dezabonare </button>
          <p class="joined-message">Ești înscris la acest eveniment</p>
        </div>
      </div>

      <div v-else>
        <div v-for="event in filteredAllEvents" :key="event.id" class="event-card">
          <h3>{{ event.title }}</h3>
            <p><strong>Descriere:</strong> {{ event.description }}</p>
            <p><strong>Data:</strong> {{ event.date }}</p>
            <p><strong>Număr participanți:</strong> {{ event.participant || 0 }}</p>

            <button @click="joinEvent(event.id)"> Participă </button>
        </div>
      </div>
  </div>
  </div>

  </template>
  
  <script>

  export default {
    name: "MainPage",
    data() {
      return {
        showJoined: false,
        eventForm: {
          id: null,
          title: '',
          description: '',
          date: '',
          participant: 0,
        },
        events: [],
        allEvents: []
      };
    },
    computed: {
      user() {
        return this.$store.getters.getUser;
      },
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      joinedEvents() {
        return this.allEvents.filter(
          (event) => event.participants && event.participants.includes(this.user.uid)
        );
      },
      filteredAllEvents() {
        return this.allEvents.filter(
          (event) => !event.participants || !event.participants.includes(this.user.uid)
        );
      },
    },
    mounted() {
      this.removeExpiredEvents();
      this.fetchEvents();
      this.fetchAllEvents();
    },
    methods: {
        async handleSubmit() {
          if (this.eventForm.id) {
              await this.updateEvent();
          } else {
              await this.addEvent();
          }
        },
        async addEvent() {
          try{
            const token = localStorage.getItem('token');
            console.log("Token pentru addEvent:", token);
            const response = await fetch("http://localhost:5000/events/add", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    title: this.eventForm.title,
                    description: this.eventForm.description,
                    date: this.eventForm.date,
                    idUser: this.user.uid,
                  }),
                });

                if (!response.ok) {
                  const error = await response.json();
                  alert(error.error || "Eroare la adăugarea evenimentului.");
                  return;
                }

                const result = await response.json();
                console.log("Eveniment adăugat cu ID:", result.id);

                this.events.push({
                  id: result.id,
                  title: this.eventForm.title,
                  description: this.eventForm.description,
                  date: this.eventForm.date,
                  idUser: this.user.uid,
                });
                alert("Eveniment adaugat cu sccces")
                this.eventForm = { id: null, title: "", description: "", date: "" };
            }catch(error){
              console.error("Eroare la adăugarea evenimentului:", error);
              alert("Eroare la conectarea cu serverul.");
            }
        },
        async updateEvent() {
        try {
          const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/events/update/${this.eventForm.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: this.eventForm.title,
                    description: this.eventForm.description,
                    date: this.eventForm.date,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error || "Eroare la actualizarea evenimentului.");
                return;
            }

            const index = this.events.findIndex((event) => event.id === this.eventForm.id);
            if (index !== -1) {
                this.events[index] = {
                    ...this.events[index],
                    title: this.eventForm.title,
                    description: this.eventForm.description,
                    date: this.eventForm.date,
                };
            }
                alert("Eveniment actualizat cu succes!");
                this.eventForm = { id: null, title: "", description: "", date: "" };
            } catch (error) {
                console.error("Eroare la actualizarea evenimentului:", error);
                alert("Eroare la conectarea cu serverul.");
            }
        },
        editEvent(event) {
            this.eventForm = { ...event };
        },
        async fetchEvents() {
            try {
                const response = await fetch(`http://localhost:5000/events/getByUser/${this.user.uid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(error.error || "Eroare la preluarea evenimentelor.");
                    return;
                }

                const eventsById = await response.json();
                this.events = eventsById;
            
            } catch (error) {
                console.error("Eroare la preluarea evenimentelor:", error);
                alert("Eroare la conectarea cu serverul.");
            }
        },
        async fetchAllEvents(){
            try{
              const response = await fetch(`http://localhost:5000/events/getAllEvents/${this.user.uid}` ,{
                method: "GET",
                headers: {
                        "Content-Type": "application/json",
                    },
              });
              
              if(!response.ok){
                const error = await response.json();
                alert(error.error || "Eroare la preluarea evenimentelor")
                return;
              }

              const events = await response.json();
              this.allEvents = events;

            }catch(error){
              console.error("Eroare la obținerea evenimentelor:", error);
              alert("Nu s-au putut încărca evenimentele.");
            }
        },
        logout() {
            this.$store.dispatch('logout');
            this.$router.push('/');
        },
        async deleteEvent(eventId) {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/events/delete/${eventId}`, {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
            });

            if (!response.ok) {
              const error = await response.json();
              alert(error.error || "Eroare la ștergerea evenimentului.");
              return;
            }

            this.events = this.events.filter((event) => event.id !== eventId);
            console.log(`Evenimentul cu ID ${eventId} a fost șters.`);
          } catch (error) {
            console.error("Eroare la ștergerea evenimentului:", error);
            alert("Eroare la conectarea cu serverul.");
          }
      },
      async joinEvent(idEvent){
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/events/join/${idEvent}`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                  idUser: this.user.uid,
              })
           });

          if (!response.ok) {
            const error = await response.json();
            alert(error.error || "Eroare la înscriere.");
            return;
          }

          alert("Te-ai înscris cu succes la eveniment!");
          await this.fetchAllEvents();
        }catch (error) {
            console.error("Eroare la înscriere:", error);
            alert("Eroare la conectarea cu serverul.");
        }
      },
      async removeExpiredEvents() {
        try {
          const response = await fetch("http://localhost:5000/events/removeExpiredEvents", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const error = await response.json();
            console.error(error.error || "Eroare la ștergerea evenimentelor expirate.");
            return;
          }

          console.log("Evenimentele expirate au fost șterse.");
        } catch (error) {
          console.error("Eroare la conectarea cu serverul pentru ștergerea evenimentelor expirate:", error);
        }
      },
      async unsubscribeEvent(idEvent){
        try{
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/events/unsubscribeEvent/${idEvent}`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                  idUser: this.user.uid,
              })
           });

           if(!response){
            const error = await response.json();
            alert(error.message || "Eroare la dezabonare.");
            return;
           }
           await this.fetchAllEvents();
           alert("Te-ai dezabonat de la eveniment!");
        }catch(error){
          console.error("Eroare la dezabonare:", error);
          alert("Eroare la conectarea cu serverul.");
        }
      }
    },
};
  </script>
  
  <style scoped>

  .main-page {
    padding: 20px;
    background-color: #ffffff;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    color: #004080;
    padding: 10px 10px;
    border-radius: 15px;
  }
  
  .user-info p {
    margin: 0;
  }
  
  .actions {
    margin: 20px 0;
  }
  
  button {
    padding: 10px 25px;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    margin-bottom: 20px;
    margin-right: 20px;
    background-color: #709ce7;
    color: white;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #818fb3;
  }
  
  .dashboard {
    display: flex;
    margin-top: 20px;
    background-color: #ffffff;
    }

  .event-panel {
    width: 35%;
    background: #b6dbf9;
    border-radius: 10px;
    padding: 20px;
    margin-right: 25px;
    box-shadow: 0 4px 6px rgba(96, 95, 95, 0.1);
  }

  .event-panel h2 {
    margin-bottom: 20px;
  }

  .event-panel form input,
  .event-panel form textarea {
    display: block;
    width: 100%;
    margin-bottom: 15px; 
    padding: 10px; 
    border: 1px solid #ccc; 
    border-radius: 5px; 
    box-sizing: border-box; 
    }
  .event-table {
    flex-grow: 1;
  }

  .event-table table {
    width: 100%;
    border-collapse: collapse;
  }

  .event-table th,
  .event-table td {
    padding: 10px;
    border: 1px solid #7c8aa6;
    text-align: left;
  }

  .event-table th {
    background-color: #b6dbf9;
    color: #151718;
  }

  .event-table button {
    margin-right: 5px;
    background-color: #b6dbf9;
  }

  .all-events {
    margin-top: 40px;
  }

  .event-card {
    border: 1px solid #cfdaf5;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .event-card h3 {
    margin-bottom: 10px;
    color: #5582f7;
  }

  .event-card p {
    margin: 5px 0;
  }
  .event-card button {
    margin-right: 20px;
  }
  </style>
  