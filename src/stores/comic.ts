import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { comicService } from '@/services/comic'
import { aiService } from '@/services/ai'
import type { Comic, Panel, ComicScript } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export const useComicStore = defineStore('comic', () => {
  const comics = ref<Comic[]>([])
  const currentComic = ref<Comic | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const sortedPanels = computed(() => {
    if (!currentComic.value) return []
    return [...currentComic.value.panels].sort((a, b) => a.order - b.order)
  })

  const loadUserComics = async (userId: string) => {
    loading.value = true
    try {
      comics.value = await comicService.getUserComics(userId)
    } catch (err) {
      error.value = 'Failed to load comics'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const loadPublicComics = async () => {
    loading.value = true
    try {
      comics.value = await comicService.getPublicComics()
    } catch (err) {
      error.value = 'Failed to load public comics'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const loadComic = async (id: string) => {
    loading.value = true
    try {
      currentComic.value = await comicService.getComic(id)
    } catch (err) {
      error.value = 'Failed to load comic'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const generateComic = async (prompt: string, userId: string, userName: string) => {
    loading.value = true
    error.value = null
    
    try {
      // Generate script with Claude
      const scriptResponse = await aiService.generateComicScript(prompt)
      if (!scriptResponse.success) {
        throw new Error(scriptResponse.error || 'Failed to generate script')
      }

      const script = scriptResponse.data as ComicScript
      
      // Create comic document
      const comicData: Omit<Comic, 'id' | 'createdAt' | 'updatedAt'> = {
        title: script.title,
        description: script.description,
        authorId: userId,
        authorName: userName,
        panels: [],
        isPublic: false,
        collaborators: []
      }

      const comicId = await comicService.createComic(comicData)
      
      // Generate panels with images
      const panels: Panel[] = []
      for (let i = 0; i < script.panels.length; i++) {
        const panelData = script.panels[i]
        
        const panel: Panel = {
          id: uuidv4(),
          order: i,
          imageUrl: '',
          prompt: panelData.scenePrompt,
          speechBubbles: panelData.dialogue.map((text, index) => ({
            id: uuidv4(),
            text,
            x: 50 + (index * 200),
            y: 50 + (index * 100),
            width: 150,
            height: 80,
            type: 'speech' as const
          })),
          stickers: [],
          isGenerating: true
        }

        panels.push(panel)
        await comicService.addPanelRealtime(comicId, panel)

        // Generate image for this panel
        const imageResponse = await aiService.generatePanelImage(panelData.scenePrompt)
        if (imageResponse.success) {
          panel.imageUrl = imageResponse.data.imageUrl
          panel.isGenerating = false
          await comicService.updatePanelRealtime(comicId, panel)
        }
      }

      // Update comic with panels
      await comicService.updateComic(comicId, { panels })
      
      return comicId
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate comic'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const subscribeToComic = (comicId: string) => {
    return comicService.subscribeToComicChanges(comicId, (panels) => {
      if (currentComic.value && currentComic.value.id === comicId) {
        currentComic.value.panels = panels
      }
    })
  }

  const updatePanel = async (comicId: string, panel: Panel) => {
    try {
      await comicService.updatePanelRealtime(comicId, panel)
    } catch (err) {
      error.value = 'Failed to update panel'
      console.error(err)
    }
  }

  const generateChoicePanels = async (comicId: string, choice: string, context: string) => {
    loading.value = true
    try {
      const response = await aiService.generateChoiceOutcome(choice, context)
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate choice outcome')
      }

      const newPanels = response.data
      const currentPanelCount = currentComic.value?.panels.length || 0

      for (let i = 0; i < newPanels.length; i++) {
        const panelData = newPanels[i]
        
        const panel: Panel = {
          id: uuidv4(),
          order: currentPanelCount + i,
          imageUrl: '',
          prompt: panelData.scenePrompt,
          speechBubbles: panelData.dialogue.map((text: string, index: number) => ({
            id: uuidv4(),
            text,
            x: 50 + (index * 200),
            y: 50 + (index * 100),
            width: 150,
            height: 80,
            type: 'speech' as const
          })),
          stickers: [],
          isGenerating: true
        }

        await comicService.addPanelRealtime(comicId, panel)

        // Generate image
        const imageResponse = await aiService.generatePanelImage(panelData.scenePrompt)
        if (imageResponse.success) {
          panel.imageUrl = imageResponse.data.imageUrl
          panel.isGenerating = false
          await comicService.updatePanelRealtime(comicId, panel)
        }
      }
    } catch (err) {
      error.value = 'Failed to generate choice panels'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    comics,
    currentComic,
    loading,
    error,
    sortedPanels,
    loadUserComics,
    loadPublicComics,
    loadComic,
    generateComic,
    subscribeToComic,
    updatePanel,
    generateChoicePanels
  }
})