import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

class AnimationService {
  animatePanelReveal(element: HTMLElement, delay: number = 0): gsap.core.Timeline {
    return gsap.timeline({ delay })
      .fromTo(element, 
        { 
          opacity: 0, 
          scale: 0.8, 
          rotation: -2 
        },
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 0, 
          duration: 0.8, 
          ease: "back.out(1.7)" 
        }
      )
  }

  animatePanelSequence(panels: HTMLElement[]): gsap.core.Timeline {
    const tl = gsap.timeline()
    
    panels.forEach((panel, index) => {
      const direction = index % 2 === 0 ? -100 : 100
      
      tl.fromTo(panel,
        { 
          opacity: 0, 
          x: direction,
          scale: 0.9 
        },
        { 
          opacity: 1, 
          x: 0, 
          scale: 1, 
          duration: 0.6, 
          ease: "power2.out" 
        },
        index * 0.2
      )
    })
    
    return tl
  }

  animateSpeechBubble(element: HTMLElement): gsap.core.Timeline {
    return gsap.timeline()
      .fromTo(element,
        { 
          opacity: 0, 
          scale: 0.5, 
          transformOrigin: "bottom center" 
        },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.3, 
          ease: "back.out(2)" 
        }
      )
  }

  setupParallaxScroll(container: HTMLElement): void {
    const panels = container.querySelectorAll('.comic-panel')
    
    panels.forEach((panel, index) => {
      const speed = (index % 2 === 0) ? 0.5 : -0.3
      
      gsap.fromTo(panel,
        { y: 0 },
        {
          y: () => speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      )
    })
  }

  animateChoiceButtons(buttons: HTMLElement[]): gsap.core.Timeline {
    const tl = gsap.timeline()
    
    buttons.forEach((button, index) => {
      tl.fromTo(button,
        { 
          opacity: 0, 
          y: 20, 
          scale: 0.9 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.4, 
          ease: "power2.out" 
        },
        index * 0.1
      )
    })
    
    return tl
  }

  animatePageTransition(from: HTMLElement, to: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve })
      
      tl.to(from, { 
        opacity: 0, 
        x: -50, 
        duration: 0.3, 
        ease: "power2.in" 
      })
      .fromTo(to, 
        { 
          opacity: 0, 
          x: 50 
        },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.3, 
          ease: "power2.out" 
        },
        0.15
      )
    })
  }

  pulseElement(element: HTMLElement, duration: number = 2): gsap.core.Tween {
    return gsap.to(element, {
      scale: 1.05,
      duration: duration,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    })
  }

  cleanup(): void {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    gsap.killTweensOf("*")
  }
}

export const animationService = new AnimationService()