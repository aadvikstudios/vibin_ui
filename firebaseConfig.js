import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDJBl9LTEWGsfFHAj9_1euH4vRcktF2HHo', // Web API Key
  authDomain: 'vibin-ui.firebaseapp.com', // Firebase Auth Domain
  projectId: 'vibin-ui', // Project ID
  storageBucket: 'vibin-ui.appspot.com', // Firebase Storage Bucket (derived from project name)
  messagingSenderId: '874321282922', // Project Number (Messaging Sender ID)
  appId: '1:874321282922:WEB:your-app-id', // Replace "your-app-id" with the App ID from the Firebase console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
