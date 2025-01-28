<template>
    <div class="main-page">
      <header class="header">
        <h1>Bun venit la Evenimente!</h1>
        <div class="user-info" v-if="isAuthenticated">
          <p>Conectat ca: {{ user.prenume }} {{ user.nume }}</p>
          <button @click="logout">Logout</button>
        </div>
      </header>
  
    </div>
  </template>
  
  <script>
  
  export default {
    name: "MainPage",
    data() {
      return {
      };
    },
    computed: {
      user() {
        return this.$store.getters.getUser;
      },
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
            this.$router.push('/login');
        },
    },

  };
  </script>
  
  <style scoped>
  .main-page {
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #42b983;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
  }
  
  .user-info p {
    margin: 0;
  }
  
  .actions {
    margin: 20px 0;
  }
  
  button {
    padding: 10px 15px;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    background-color: #42b983;
    color: white;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #369974;
  }
  
  .events {
    margin-top: 20px;
  }
  
  .events ul {
    list-style: none;
    padding: 0;
  }
  
  .events li {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
  }
  </style>
  