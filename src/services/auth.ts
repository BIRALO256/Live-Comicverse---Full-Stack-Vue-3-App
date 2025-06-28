import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import type { User as AppUser } from '@/types'

class AuthService {
  private googleProvider = new GoogleAuthProvider()
  private facebookProvider = new FacebookAuthProvider()

  async signInWithEmail(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    await this.createUserDocument(result.user)
    return result.user
  }

  async signInWithGoogle(): Promise<User> {
    const result = await signInWithPopup(auth, this.googleProvider)
    await this.createUserDocument(result.user)
    return result.user
  }

  async signInWithFacebook(): Promise<User> {
    const result = await signInWithPopup(auth, this.facebookProvider)
    await this.createUserDocument(result.user)
    return result.user
  }

  async signOut(): Promise<void> {
    await signOut(auth)
  }

  private async createUserDocument(user: User): Promise<void> {
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    
    if (!userSnap.exists()) {
      const userData: AppUser = {
        id: user.uid,
        email: user.email!,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        createdAt: new Date()
      }
      await setDoc(userRef, userData)
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  }

  getCurrentUser(): User | null {
    return auth.currentUser
  }
}

export const authService = new AuthService()