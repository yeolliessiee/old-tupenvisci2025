import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import 'dotenv/config'; 

// Use variables instead of hardcoded strings
const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_DB_URL,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_SENDER_ID,
  appId: process.env.VITE_APP_ID
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log(" STARTING VIRTUAL SENSOR");
console.log(`Targeting Database: ${process.env.VITE_DB_URL}`);
console.log("Press Ctrl+C to stop.\n");

// SIMULATION LOOP (Every 3 seconds)
setInterval(() => {
    // Generate random realistic values
    const temp = (25 + Math.random() * 5).toFixed(1); 
    const hum = Math.floor(50 + Math.random() * 20);  
    const pres = Math.floor(1008 + Math.random() * 10);
    const pm1 = Math.floor(5 + Math.random() * 10);    // PM 1.0
    const pm25 = Math.floor(10 + Math.random() * 40);  // PM 2.5
    const pm10 = Math.floor(20 + Math.random() * 60);  // PM 10

    // Update Firebase
    const updates = {};
    updates['/sensors/temperature'] = parseFloat(temp);
    updates['/sensors/humidity'] = hum;
    updates['/sensors/pressure'] = pres;
    updates['/sensors/pm1'] = pm1;    // Added PM 1.0
    updates['/sensors/pm25'] = pm25;
    updates['/sensors/pm10'] = pm10;

    update(ref(db), updates)
        .then(() => {
            console.log("Data Sent: Temp=${temp}°C | PM2.5=${pm25}");
        })
        .catch((error) => {
            console.error("Error:", error);
        });

}, 3000);