<template>
    <div class="home-page">
      <h1>Bine ai venit!</h1>
      <router-link to="/register">
        <button>Creare cont</button>
      </router-link>

      <router-link to="/login">
        <button>Intra in cont</button>
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage'
  };
  </script>
  
  <style scoped>
  .home-page {
    background: #e0effb;
    border-radius: 15px;
    box-shadow: 0 4px 6px #e1e2f21a;
    padding: 30px;
    max-width: 400px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column; 
    justify-content: center;
    align-items: center; 
    margin: 0 auto; 
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #a1b1e9;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  button:hover {
    background-color: #c4c5e0;
  }
  </style>
  