# Live Comicverse 🎨

A full-stack Vue 3 web application for creating, editing, and sharing interactive comic strips with AI assistance and real-time collaboration.

## ✨ Features

### 🤖 AI-Powered Comic Creation
- **Claude AI Integration**: Generates engaging 4-6 panel comic scripts from text prompts
- **DALL-E Image Generation**: Creates stunning artwork for each panel automatically
- **Branching Narratives**: Interactive choice buttons that generate new story paths

### 👥 Real-Time Collaboration
- **Firebase Realtime Database**: Live editing sync between collaborators
- **WYSIWYG Editor**: Drag-and-drop speech bubbles, stickers, and panel reordering
- **Multi-user Support**: Invite friends to edit comics together

### 🎬 Smooth Animations
- **GSAP Integration**: Sequential panel reveals, slide-in animations
- **Parallax Scrolling**: Subtle depth effects during scroll
- **Micro-interactions**: Hover states and button animations

### 🔐 Authentication & Storage
- **Firebase Auth**: Email/password and social login (Google, Facebook)
- **Firestore**: Comics metadata and user management
- **Cloud Storage**: Image and asset storage

### 📱 Modern UI/UX
- **Tailwind CSS**: Responsive design with comic book aesthetics
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile-First**: Optimized for all device sizes

### 🚀 Deployment & Sharing
- **Firebase Hosting**: One-click deployment
- **GitHub Actions**: Automated CI/CD pipeline
- **Share Features**: Public URLs and animated GIF export

## 🛠️ Tech Stack

- **Frontend**: Vue 3, TypeScript, Composition API
- **Styling**: Tailwind CSS, Custom Comic Aesthetics
- **Animation**: GSAP, CSS Animations
- **Backend**: Firebase (Auth, Firestore, Realtime DB, Storage)
- **AI Services**: Anthropic Claude, OpenAI DALL-E
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Deployment**: Firebase Hosting
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase account
- Anthropic API key
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd live-comicverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys and Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Firebase**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Deploy to Firebase**
   ```bash
   npm run deploy
   # or use the deployment script
   chmod +x deploy.sh
   ./deploy.sh
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── ComicPanel.vue   # Individual comic panel with editing
│   ├── SpeechBubble.vue # Draggable speech bubbles
│   ├── Sticker.vue      # Interactive stickers
│   └── Navbar.vue       # Navigation component
├── views/               # Page components
│   ├── HomeView.vue     # Landing page
│   ├── LoginView.vue    # Authentication
│   ├── DashboardView.vue # User comic management
│   ├── CreateView.vue   # Comic creation wizard
│   ├── EditorView.vue   # Real-time comic editor
│   ├── ViewerView.vue   # Comic reading experience
│   └── GalleryView.vue  # Public comic gallery
├── stores/              # Pinia state management
│   ├── auth.ts          # Authentication state
│   └── comic.ts         # Comic data management
├── services/            # Business logic
│   ├── auth.ts          # Firebase Auth wrapper
│   ├── ai.ts            # AI service integration
│   ├── comic.ts         # Comic CRUD operations
│   └── animation.ts     # GSAP animation helpers
├── types/               # TypeScript definitions
├── config/              # Configuration files
└── router/              # Vue Router setup
```

## 🎨 Key Features Explained

### AI Comic Generation
1. User enters a story prompt
2. Claude AI generates a structured comic script
3. DALL-E creates artwork for each panel
4. Speech bubbles are automatically positioned
5. Users can edit and refine the result

### Real-Time Collaboration
- Firebase Realtime Database syncs panel changes instantly
- Multiple users can edit speech bubbles simultaneously
- Conflict resolution ensures data consistency
- Live cursor tracking shows collaborator activity

### Interactive Storytelling
- Choice buttons appear at panel endings
- Clicking choices generates new story branches
- AI continues narratives based on user decisions
- Creates unique, personalized comic experiences

### Animation System
- GSAP powers smooth panel reveals
- Staggered animations create engaging sequences
- Parallax scrolling adds depth to reading
- Micro-interactions provide tactile feedback

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to Firebase
- `npm run lint` - Run ESLint

### Code Organization
- **Composition API**: Modern Vue 3 patterns
- **TypeScript**: Full type safety
- **Modular Architecture**: Clean separation of concerns
- **Responsive Design**: Mobile-first approach

## 🚀 Deployment

### Automatic Deployment (GitHub Actions)
1. Push to main branch
2. GitHub Actions builds and deploys automatically
3. Environment variables are injected from secrets

### Manual Deployment
```bash
npm run build
firebase deploy
```

### One-Click Deploy Script
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔐 Security & Privacy

- Firebase Security Rules protect user data
- API keys are environment-specific
- User authentication required for editing
- Public comics have controlled visibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Anthropic** for Claude AI integration
- **OpenAI** for DALL-E image generation
- **Firebase** for backend infrastructure
- **GSAP** for animation capabilities
- **Tailwind CSS** for styling system

## 📞 Support

For support, email support@livecomicverse.com or join our Discord community.

---

**Live Comicverse** - Where stories come to life! 🎨✨