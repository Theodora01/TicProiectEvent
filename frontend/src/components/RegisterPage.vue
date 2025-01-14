<template>
    <div class="register-page">
      <h1>Creare cont</h1>
      <form @submit.prevent="register">
        <div>
          <label for="username">Nume utilizator:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Parolă:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div>
          <label for="confirmPassword">Confirmare parolă:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>
        <button type="submit">Creează cont</button>
      </form>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'RegisterPage',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        successMessage: '',
        errorMessage: ''
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          this.errorMessage = 'Parolele nu se potrivesc!';
          this.successMessage = '';
          return;
        }
  
        try {
          // Trimite cererea POST la backend
          const response = await axios.post('http://localhost:5000/api/register', {
            username: this.username,
            email: this.email,
            password: this.password
          });
  
          this.successMessage = response.data.message;
          this.errorMessage = '';
  
          // Resetează formularul
          this.username = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';
        } catch (error) {
          this.successMessage = '';
          this.errorMessage =
            error.response && error.response.data.message
              ? error.response.data.message
              : 'A apărut o eroare.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .register-page {
    max-width: 400px;
    margin: 50px auto;
    text-align: center;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  input {
    margin: 10px 0;
    padding: 8px;
    font-size: 14px;
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #369974;
  }
  .success {
    color: green;
  }
  .error {
    color: red;
  }
  </style>
  