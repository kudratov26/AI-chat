Build a clean, responsive web app that simulates a video conversation with a virtual anime-style character. The app plays pre-recorded video responses triggered by simple keyword detection from the user's speech (using browser SpeechRecognition or an optional third-party STT service).

This task evaluates:

Smooth video playback & state transitions (no gaps/jumps)
Integration of browser speech recognition (or external API)
Modern, maintainable frontend code
Responsive design & UX polish
Thoughtful error handling & edge cases
Estimated time: 15–25 hours (2–4 focused days max — please don't exceed ~25h; quality and smart decisions > full completion)

Core Requirements (Must-Have for Strong Consideration)
1. Video Playback & State Machine
Use HTML5 <video> (with preload="auto" or preloading logic) or a library like video.js / Plyr for better control. Achieve seamless transitions between states with no black screens, loading spinners, or noticeable delays:

Idle → Looping standby video (character waiting patiently)
Greeting → Plays on "Start Chat" click
Listening → Looping attentive video + microphone active
Response → Plays matching pre-recorded video based on keywords
Back to Listening → After response ends
Goodbye → Ends conversation and returns to Idle
Critical: Preload next videos or use multiple hidden <video> elements to make switches instant.

2. Speech Recognition
Option A (Recommended – simplest & free): Use the browser's built-in Web Speech API (SpeechRecognition / webkitSpeechRecognition with fallback).

Request microphone permission gracefully
Start listening when Listening video begins
Stop on result or error
Continuous/interim results if supported
Option B (Stretch – for better accuracy/multi-lang): Use a third-party STT service (e.g., AssemblyAI streaming, Deepgram, Google Cloud Speech-to-Text). You'll need to sign up for a free tier/API key and handle it client-side or via a minimal backend proxy.

Trigger responses based on these keywords (case-insensitive, partial matches OK):

"hello", "hi" → greeting/general response
"weather", "today" → weather response
Anything else / no match → general response ("I'm glad to hear that! ...")
"goodbye", "bye" → trigger Goodbye video
Handle basic failures → play fallback video ("I didn't catch that...")

3. Minimal Conversation Flow
Page loads → Idle video loops + "Start Chat" button visible
Click "Start Chat" → Greeting video
Greeting ends → Listening video + mic on
User speaks → Matching response video
Response ends → Listening video + mic on again
User says "goodbye" → Goodbye video → back to Idle
Stretch Goals (Nice-to-Have – Do If Time Allows)
Silence detection: After 8–10s no speech → play "Are you still there?" video, then resume Listening
After second silence → auto-end with Goodbye
Visual mic feedback (e.g., animated waveform/pulse while listening)
Responsive design (mobile-friendly portrait layout)
Add text transcript of what user said (displayed below video)
Simple animations/transitions (Tailwind + framer-motion if React)
Technical Requirements
Languages/Frameworks: React + TypeScript + Tailwind CSS (recommended), Vue 3, or plain HTML/CSS/JS (vanilla)
Video player: Native <video> preferred (preload strategies); optional lightweight libs
Browser support: Latest Chrome/Edge (Web Speech API works best there); graceful fallback for others
No backend required unless using third-party STT (then minimal proxy if CORS/API key hiding needed)
Architecture: Clean component/state management (e.g., React hooks + Zustand/Redux Toolkit, Vue Composition API, or simple JS classes)
Provided assets: Download video_files.zip from this repo (idle, greeting, listening, weather, general_response, goodbye, fallback, prompt)
Place videos in /public/videos/ or import as assets. You're welcome to add CSS animations, better UI, or creative touches — but prioritize core seamlessness.

Deliverables
Public GitHub repo containing:
Full source code (builds/runs with npm run dev or static serve)
README.md with:
Setup & run instructions
Tech choices & why (framework, STT option, etc.)
Video playback strategy (how you achieved seamlessness)
Speech integration approach & keyword logic
Implemented vs. stretch goals
Challenges & solutions
Known limitations & future ideas
(Highly recommended) 1–2 min screen recording demo:
Full flow (start → conversation → goodbye)
One failure case (e.g. "I didn't catch that")
Bonus: silence prompt if implemented
Evaluation Criteria
Seamless video playback & state management (35%) – Core differentiator
Clean, maintainable code & architecture (30%)
Speech recognition integration & error handling (20%)
UX/responsiveness & thoughtful edges (10%)
Clear documentation & communication (5%)
Partial submissions are very welcome if the completed parts show high-quality code, good structure, and solid explanations.