import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCoCLRhMB-oIgWzLirzXRlYg3DPW42D6uQ",
  authDomain: "proofed-a7f69.firebaseapp.com",
  projectId: "proofed-a7f69",
  storageBucket: "proofed-a7f69.appspot.com",
  messagingSenderId: "372898505398",
  appId: "1:372898505398:web:4fa0536c2c5557b53a3c17"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
