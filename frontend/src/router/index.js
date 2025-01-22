import { createRouter, createWebHistory } from 'vue-router';
//import HelloWorld from '../components/HelloWorld.vue';
import AboutPage from '../components/AboutPage.vue'; 
import HomePage from '../components/HomePage.vue';
import RegisterPage from '../components/RegisterPage.vue'
import LoginPage from '@/components/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: RegisterPage 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
