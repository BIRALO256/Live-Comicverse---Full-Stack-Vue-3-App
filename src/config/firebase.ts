import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  // These will be set via environment variables
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
}

// Check if we have valid Firebase configuration
const hasValidConfig = firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('demo') &&
  !firebaseConfig.apiKey.includes('your_')

let app: any = null
let auth: any = null
let db: any = null
let rtdb: any = null
let storage: any = null

if (hasValidConfig) {
  // Initialize Firebase with real configuration
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  rtdb = getDatabase(app)
  storage = getStorage(app)
} else {
  // Use Firebase emulators for development when no real config is available
  console.warn('Using Firebase emulators - please configure your Firebase project for production use')
  
  // Create a mock Firebase app for development
  const mockConfig = {
    apiKey: "demo-key",
    authDomain: "demo.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:demo",
    databaseURL: "https://demo-project-default-rtdb.firebaseio.com"
  }
  
  app = initializeApp(mockConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  rtdb = getDatabase(app)
  storage = getStorage(app)
  
  // Connect to emulators if available
  try {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      connectFirestoreEmulator(db, 'localhost', 8080)
      connectDatabaseEmulator(rtdb, 'localhost', 9000)
      connectStorageEmulator(storage, 'localhost', 9199)
    }
  } catch (error) {
    // Emulators not available, continue with mock setup
    console.log('Firebase emulators not available, using mock configuration')
  }
}

export { auth, db, rtdb, storage }
export default app