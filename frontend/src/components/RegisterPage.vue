<template>
    <div class="register-page">
      <div class="form-container">
      <h1>Creare cont</h1>
      <form @submit.prevent="register">
        <div>
          <label for="prenume">Prenume:</label>
          <input type="text" id="prenume" v-model="prenume" required />
        </div>
        <div>
          <label for="nume">Nume:</label>
          <input type="text" id="nume" v-model="nume" required />
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
        <div v-if="loading" class="loader">Înregistrare în curs...</div>
      </form>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
    </div>
  </template>
  
  <script>
  import axios from '@/api/axios';
  
  export default {
    name: 'RegisterPage',
    data() {
      return {
        prenume: '',
        nume: '',
        email: '',
        password: '',
        confirmPassword: '',
        successMessage: '',
        errorMessage: '',
        loading: false
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          this.errorMessage = 'Parolele nu se potrivesc!';
          this.successMessage = '';
          return;
        }
  
        this.loading = true; 
        this.successMessage = '';
        this.errorMessage = '';
        try {
          const response = await axios.post('/register', {
            prenume: this.prenume,
            nume: this.nume,
            email: this.email,
            password: this.password
          });
  
          this.successMessage = response.data.message;
          this.errorMessage = '';
  
          this.nume = '';
          this.email = '';
          this.prenume = '';
          this.password = '';
          this.confirmPassword = '';

          this.$router.push('/login');
        } catch (error) {
          if (error.response) {
                  this.errorMessage = error.response.data.message || 'Eroare la autentificare!';
                } else if (error.request) {
                  this.errorMessage = 'Serverul nu răspunde. Vă rugăm încercați mai târziu.';
                } else {
                  this.errorMessage = 'A apărut o eroare.';
                }
                this.successMessage = '';
        }finally {
          this.loading = false; 
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f7fa;
  }

  .form-container {
    background: #e0effb;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 30px;
    max-width: 400px;
    width: 100%;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  input {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }

  button {
    padding: 10px 10px;
    font-size: 16px;
    background-color: #a1b1e9;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }

  button:hover {
    background-color: #c4c5e0;
  }

  .success {
    color: green;
    margin-top: 10px;
  }

  .error {
    color: red;
    margin-top: 10px;
  }
  .loader {
    margin-top: 20px;
    color: #2a1a14;
    font-weight: bold;
  }
</style>