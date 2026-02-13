# AI Character Chat

A premium, interactive AI conversation experience featuring real-time speech recognition, reactive video playback, and a sleek minimalistic design.

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- NPM or Bun
- Modern browser with Speech Recognition support (Chrome, Edge, Safari)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.
3. Allow microphone permissions when prompted.
4. Click **[ START ]** to begin the transmission.

---

## 🛠 Tech Choices & Rationale

### Framework: Next.js 15 (App Router)
Chosen for its robust routing, SSR capabilities (hybridized with client components for speech/video), and native support for modern styling. It provides the backbone for a scalable React application.

### Speech-to-Text (STT): Web Speech API
Implemented using the native browser `SpeechRecognition` interface.
- **Why?**: Zero latency (local processing), no API costs, and built-in support for multiple languages without external dependencies.
- **Logic**: Custom `useSpeechRecognition` hook handles the lifecycle, interim results, and error recovery.

### Styling: Tailwind CSS + Framer Motion
- **Tailwind**: Used for a utility-first, rapid UI development with a strong focus on theme-aware design tokens.
- **Framer Motion**: Added to provide a "premium" feel with orchestrated entrance animations, presence transitions, and smooth list effects.

### Theme Management: `next-themes`
Migrated from a custom implementation to `next-themes` to ensure consistent dark/light mode performance, persistence, and zero-flicker hydration.

---

## 📹 Video Playback Strategy

To achieve a seamless "talking head" effect, the system uses a state-driven playback engine:
- **Looping vs. One-shot**: Certain states (Idle, Listening) trigger looping videos, while others (Responses, Greeting) play once and transition to the next state upon completion.
- **Sequential Handling**: The `useConversation` hook manages the transitions between video keys.
- **Visualizer Overlay**: A custom Canvas-based `AudioVisualizer` is overlaid on the video, reacting to frequency data from the microphone/audio stream to enhance immersion.

---

## 🗣 Speech Integration & Keyword Logic

The interaction flow is governed by a lightweight semantic matching strategy:
1. **Continuous Listening**: When in the `listening` state, the microphone stays active.
2. **Keyword Mapping**: Transcripts are passed through a `matchKeyword` utility that maps specific phrases (e.g., "weather", "goodbye") to pre-defined video responses.
3. **Sequential Silence Handling**:
   - **Silence 1**: Triggers a `prompt` video ("Are you still there?").
   - **Silence 2**: If no speech follows the prompt, the AI plays a `goodbye` video and closes the session.
4. **Interim Feedback**: Users see their speech in real-time within the transcript to reduce perceived latency.

---

## ✅ Implemented vs. Stretch Goals

### Implemented
- [x] High-fidelity custom Audio Visualizer (React 19 compatible).
- [x] Dark/Light mode switcher with persistence.
- [x] Semantic keyword-based video responses.
- [x] Sequential silence detection logic.
- [x] Premium Framer Motion animations.
- [x] Detailed automated transcript with auto-scroll.

### Stretch Goals
- [ ] Integration with GPT-4 / ElevenLabs for truly dynamic responses.
- [ ] Multiple AI character personalities.
- [ ] Localized speech recognition for more languages.
- [ ] Persistent conversation history database.

---

## 🚧 Challenges & Solutions

### React 19 Compatibility
**Challenge**: Many third-party audio visualizer libraries broke under React 19's strict dispatcher and hook requirements.
**Solution**: Built a custom raw Canvas visualizer within a `requestAnimationFrame` loop, carefully managing `Ref` closures and `AnalyserNode` state to ensure stable 60fps performance.

### Hydration Mismatches
**Challenge**: Flash of unstyled theme and "document is not defined" errors during SSR.
**Solution**: Utilized `next-themes` for robust theme injection and a `mounted` state check in UI components to skip inconsistent server-side renders.

### Seamless Video Transitions
**Challenge**: Lag between switching video sources.
**Solution**: Optimized the `VideoPlayer` component to handle source changes gracefully and ensured video assets are appropriately formatted for web streaming.

---

## 🔮 Known Limitations & Future Ideas
- **Browser Compatibility**: Safari requires specific user interaction to start audio contexts.
- **Vocabulary**: Currently limited to hardcoded keywords; future iterations could use a vector-based semantic search for matching.
- **Assets**: Requires a structured set of video files in the `public/` directory to function correctly.
