<template>
    <div class="login-page">
     <div class="form-container">
      <h1>Autentificare</h1>
      <form @submit.prevent="login" autocomplete="off">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Parolă:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Autentifica-te</button>
        <div v-if="loading" class="loader">Autentificare în curs...</div>
      </form>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
     </div>
    </div>
  </template>
  
  <script>
  import axios from '@/api/axios';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import auth from '@/api/firebase';

  export default {
    name: "LoginPage",
    data() {
      return {
        email: '',
        password: '',
        successMessage: '',
        errorMessage: '',
        loading: false
      };
    },
    mounted() {
      this.clearForm();
    },
    methods: {
        clearForm() {
          this.email = "";
          this.password = "";
        },
        async login() {
            if (!this.email || !this.password) {
                this.errorMessage = "Toate câmpurile sunt obligatorii!";
                return;
            }
            this.errorMessage = "";
            this.loading = true;
            try {
                const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
                const token = await userCredential.user.getIdToken();

                const response = await axios.post("/login", { token });
                
                console.log(auth);
                localStorage.setItem("token", token);
                this.$store.dispatch("login", {
                  user: response.data.user,
                  token,
                });

                this.successMessage = response.data.message;
                this.errorMessage = '';

                this.email = '';
                this.password = '';

                this.$router.push('/mainPage');
            } catch (error) {
                console.error("Eroare la autentificare:", error.message);
                this.errorMessage = "Email sau parolă incorectă!";
              }finally {
                this.loading = false; 
              }
        }
    }
  };
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #fefeff;
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
  