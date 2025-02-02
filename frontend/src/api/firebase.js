import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBUQvC9xnn74ZjcV2_R6nLSBEpDvXsRC8k",
    authDomain: "eventmanager-b53d2.firebaseapp.com",
    projectId: "eventmanager-b53d2",
    storageBucket: "eventmanager-b53d2.firebasestorage.app",
    messagingSenderId: "292433609450",
    appId: "1:292433609450:web:41a54ed7f1c78743b88d93"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
