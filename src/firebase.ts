import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDug2t4RYaU8Per6T_XmvzwvI7R7K0xiw8",
  authDomain: "ofcourse-ab402.firebaseapp.com",
  databaseURL: "https://ofcourse-ab402-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ofcourse-ab402",
  storageBucket: "ofcourse-ab402.appspot.com",
  messagingSenderId: "353157039816",
  appId: "1:353157039816:web:da4c44eb17d0e17c48c7fd",
  measurementId: "G-X1LQ0ZSFET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { auth, database, analytics, storage };

// Export the app instance
export default app;