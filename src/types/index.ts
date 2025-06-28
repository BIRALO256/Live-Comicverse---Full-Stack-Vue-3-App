export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Date
}

export interface Comic {
  id: string
  title: string
  description: string
  authorId: string
  authorName: string
  panels: Panel[]
  isPublic: boolean
  collaborators: string[]
  createdAt: Date
  updatedAt: Date
  shareUrl?: string
}

export interface Panel {
  id: string
  order: number
  imageUrl: string
  prompt: string
  speechBubbles: SpeechBubble[]
  stickers: Sticker[]
  choices?: Choice[]
  isGenerating?: boolean
}

export interface SpeechBubble {
  id: string
  text: string
  x: number
  y: number
  width: number
  height: number
  type: 'speech' | 'thought' | 'narration'
  character?: string
}

export interface Sticker {
  id: string
  type: string
  x: number
  y: number
  scale: number
  rotation: number
}

export interface Choice {
  id: string
  text: string
  nextPanelPrompt: string
}

export interface ComicScript {
  title: string
  description: string
  panels: {
    description: string
    dialogue: string[]
    scenePrompt: string
  }[]
}

export interface AIResponse {
  success: boolean
  data?: any
  error?: string
}