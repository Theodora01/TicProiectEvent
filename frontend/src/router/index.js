import { createRouter, createWebHistory } from 'vue-router';
//import HelloWorld from '../components/HelloWorld.vue';
import AboutPage from '../components/AboutPage.vue'; 
import HomePage from '../components/HomePage.vue';
import RegisterPage from '../components/RegisterPage.vue'
import LoginPage from '@/components/LoginPage.vue';
import MainPage from '@/components/MainPage.vue';

const routes = [
  {
    path: '/', name: 'Home', component: HomePage
  },
  {
    path: '/about', name: 'About', component: AboutPage
  },
  { 
    path: '/register', name: 'Inregistrare', component: RegisterPage 
  },
  {
    path: '/login', name: 'Autentificare', component: LoginPage
  },
  {
    path: '/mainPage', name: 'Pagina principala', component: MainPage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
