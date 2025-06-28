import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import type { ComicScript, AIResponse } from '@/types'

class AIService {
  private anthropic: Anthropic
  private openai: OpenAI

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true
    })

    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
  }

  async generateComicScript(prompt: string): Promise<AIResponse> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Generate a 4-6 panel comic script based on this prompt: "${prompt}". 
          Return a JSON object with this structure:
          {
            "title": "Comic Title",
            "description": "Brief description",
            "panels": [
              {
                "description": "What happens in this panel",
                "dialogue": ["Character 1: Hello", "Character 2: Hi there"],
                "scenePrompt": "Detailed scene description for image generation"
              }
            ]
          }
          Make it engaging, funny, and suitable for a comic format. Each panel should have clear visual elements and dialogue.`
        }]
      })

      const content = response.content[0]
      if (content.type === 'text') {
        const scriptData = JSON.parse(content.text) as ComicScript
        return { success: true, data: scriptData }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.error('Error generating comic script:', error)
      return { success: false, error: 'Failed to generate comic script' }
    }
  }

  async generatePanelImage(prompt: string): Promise<AIResponse> {
    try {
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: `Comic book style panel: ${prompt}. High quality digital art, vibrant colors, clear composition, suitable for comic book layout.`,
        size: '1024x1024',
        quality: 'standard',
        n: 1
      })

      const imageUrl = response.data[0]?.url
      if (imageUrl) {
        return { success: true, data: { imageUrl } }
      }
      
      throw new Error('No image generated')
    } catch (error) {
      console.error('Error generating panel image:', error)
      return { success: false, error: 'Failed to generate panel image' }
    }
  }

  async generateChoiceOutcome(choice: string, context: string): Promise<AIResponse> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Based on this choice: "${choice}" and story context: "${context}", 
          generate 2-3 new comic panels continuing the story. 
          Return a JSON array of panels with the same structure as before:
          [
            {
              "description": "What happens in this panel",
              "dialogue": ["Character dialogue"],
              "scenePrompt": "Scene description for image generation"
            }
          ]`
        }]
      })

      const content = response.content[0]
      if (content.type === 'text') {
        const panels = JSON.parse(content.text)
        return { success: true, data: panels }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.error('Error generating choice outcome:', error)
      return { success: false, error: 'Failed to generate choice outcome' }
    }
  }
}

export const aiService = new AIService()