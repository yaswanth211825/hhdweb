// Firebase client setup.
// Add these to .env.local (get values from Firebase Console → Project Settings → Web App):
//
// NEXT_PUBLIC_FIREBASE_API_KEY=...
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
// NEXT_PUBLIC_FIREBASE_APP_ID=...
//
// In Firebase Console → Authentication → Sign-in method, enable:
//   - Email/Password
//   - Google

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null
let firestore: Firestore | null = null
let storage: FirebaseStorage | null = null

export function getFirebaseApp() {
  if (firebaseApp) return firebaseApp

  if (!getApps().length) {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    firebaseApp = initializeApp(config)
  } else {
    firebaseApp = getApps()[0]!
  }

  return firebaseApp
}

export function getFirebaseAuth() {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp())
  }
  return firebaseAuth
}

export function getFirestoreDb() {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp())
  }
  return firestore
}

export function getFirebaseStorage() {
  if (!storage) {
    storage = getStorage(getFirebaseApp())
  }
  return storage
}

export function getGoogleAuthProvider() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: "select_account" })
  return provider
}

