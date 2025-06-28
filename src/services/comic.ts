import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { ref, onValue, set, push, remove } from 'firebase/database'
import { db, rtdb } from '@/config/firebase'
import type { Comic, Panel } from '@/types'
import { v4 as uuidv4 } from 'uuid'

class ComicService {
  async createComic(comic: Omit<Comic, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const comicData = {
      ...comic,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const docRef = await addDoc(collection(db, 'comics'), comicData)
    return docRef.id
  }

  async updateComic(id: string, updates: Partial<Comic>): Promise<void> {
    const comicRef = doc(db, 'comics', id)
    await updateDoc(comicRef, {
      ...updates,
      updatedAt: new Date()
    })
  }

  async deleteComic(id: string): Promise<void> {
    await deleteDoc(doc(db, 'comics', id))
  }

  async getComic(id: string): Promise<Comic | null> {
    const comicDoc = await getDoc(doc(db, 'comics', id))
    if (comicDoc.exists()) {
      return { id: comicDoc.id, ...comicDoc.data() } as Comic
    }
    return null
  }

  async getUserComics(userId: string): Promise<Comic[]> {
    const q = query(
      collection(db, 'comics'),
      where('authorId', '==', userId),
      orderBy('updatedAt', 'desc')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comic))
  }

  async getPublicComics(): Promise<Comic[]> {
    const q = query(
      collection(db, 'comics'),
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comic))
  }

  // Real-time collaboration methods using Realtime Database
  subscribeToComicChanges(comicId: string, callback: (panels: Panel[]) => void): () => void {
    const panelsRef = ref(rtdb, `comics/${comicId}/panels`)
    return onValue(panelsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const panels = Object.values(data) as Panel[]
        panels.sort((a, b) => a.order - b.order)
        callback(panels)
      }
    })
  }

  async updatePanelRealtime(comicId: string, panel: Panel): Promise<void> {
    const panelRef = ref(rtdb, `comics/${comicId}/panels/${panel.id}`)
    await set(panelRef, panel)
  }

  async addPanelRealtime(comicId: string, panel: Omit<Panel, 'id'>): Promise<string> {
    const panelsRef = ref(rtdb, `comics/${comicId}/panels`)
    const newPanelRef = push(panelsRef)
    const panelId = newPanelRef.key!
    
    const panelData: Panel = {
      ...panel,
      id: panelId
    }
    
    await set(newPanelRef, panelData)
    return panelId
  }

  async deletePanelRealtime(comicId: string, panelId: string): Promise<void> {
    const panelRef = ref(rtdb, `comics/${comicId}/panels/${panelId}`)
    await remove(panelRef)
  }

  generateShareUrl(comicId: string): string {
    return `${window.location.origin}/comic/${comicId}`
  }
}

export const comicService = new ComicService()