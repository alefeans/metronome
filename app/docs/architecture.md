# Metronome Web App - System Architecture

## Overview
A minimalist, high-precision metronome web application built with vanilla JavaScript, focusing on accurate timing, clean UI, and modularity.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ BPM Control  │  │  Beat Grid   │  │ Time Sig UI  │          │
│  │  Component   │  │  Component   │  │   Component  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
│         └─────────────────┼──────────────────┘                   │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYER                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    AppState Manager                       │   │
│  │  • BPM (40-300)                                          │   │
│  │  • Time Signature (1-16 beats)                           │   │
│  │  • isPlaying (boolean)                                   │   │
│  │  • currentBeat (0-15)                                    │   │
│  │  • accentPattern (array)                                 │   │
│  └───────────────────────┬──────────────────────────────────┘   │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CORE BUSINESS LOGIC                         │
│  ┌─────────────────┐           ┌──────────────────┐            │
│  │ Timing Engine   │           │ Audio Controller │            │
│  │  • Schedule     │◄──────────┤  • Web Audio API │            │
│  │  • Calculate    │           │  • Sample Buffer │            │
│  │  • Lookahead    │           │  • Gain Control  │            │
│  └─────────────────┘           └──────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Structure

### 1. **Timing Engine** (`src/core/timing-engine.js`)
**Pure logic module - No DOM dependencies**

**Responsibilities:**
- Calculate precise beat intervals from BPM
- Implement lookahead scheduling (Web Audio best practice)
- Manage beat counter and time signature logic
- Detect accent patterns

**Key Methods:**
```javascript
class TimingEngine {
  constructor(bpm, beatsPerMeasure)
  start()
  stop()
  setBPM(newBPM)
  setTimeSignature(beats)
  scheduleAheadTime()      // Lookahead window (100ms)
  nextNoteTime()           // Calculate next beat time
  shouldAccent(beatIndex)  // Determine if beat should be accented
}
```

**Why separate?** Allows testing timing logic without audio or UI.

---

### 2. **Audio Controller** (`src/core/audio-controller.js`)
**Web Audio API wrapper**

**Responsibilities:**
- Initialize Web Audio context
- Load/create beat sound samples (oscillator or buffer)
- Schedule audio events with precise timing
- Manage volume/gain for accented vs. normal beats

**Key Methods:**
```javascript
class AudioController {
  constructor()
  async init()                      // Create AudioContext
  createBeatSound(frequency, accent) // Generate tone
  playBeat(time, isAccent)          // Schedule beat at precise time
  setVolume(level)
}
```

**Audio Strategy:**
- Use `OscillatorNode` for lightweight click sounds
- Schedule beats using `audioContext.currentTime` (NOT setTimeout!)
- Accent beats = higher pitch + louder volume

---

### 3. **UI Components** (`src/ui/`)

#### A. **BPM Controller** (`bpm-controller.js`)
```javascript
class BPMController {
  render()              // Slider + number input
  handleBPMChange()     // Update state + re-render
  tapTempo()            // Optional: Tap BPM detection
}
```

#### B. **Beat Grid** (`beat-grid.js`)
```javascript
class BeatGrid {
  render(beatsPerMeasure, currentBeat)
  highlightBeat(index)  // Visual beat indicator
  setAccentPattern()    // Click beats to toggle accents
}
```

#### C. **Controls** (`controls.js`)
```javascript
class Controls {
  renderPlayPause()
  renderTimeSignature() // Dropdown/buttons for 2/4, 3/4, 4/4, etc.
  renderVolumeControl()
}
```

---

### 4. **State Manager** (`src/state/app-state.js`)
**Centralized state with observer pattern**

```javascript
class AppState {
  constructor() {
    this.state = {
      bpm: 120,
      beatsPerMeasure: 4,
      isPlaying: false,
      currentBeat: 0,
      accentPattern: [true, false, false, false] // First beat accented
    }
    this.listeners = []
  }

  subscribe(listener)   // Observer pattern for UI updates
  setState(updates)     // Immutable state updates
  getState()
}
```

**Why centralized state?**
- Single source of truth
- Easy debugging
- Predictable data flow
- Simplifies testing

---

## Data Flow Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   User   │────▶│    UI    │────▶│  State   │────▶│  Timing  │
│  Action  │     │Component │     │ Manager  │     │  Engine  │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                         │
                      ┌──────────────────────────────────┘
                      ▼
                 ┌──────────┐     ┌──────────┐
                 │  Audio   │────▶│ Web Audio│
                 │Controller│     │   API    │
                 └──────────┘     └──────────┘
                      │
                      ▼
                 ┌──────────┐
                 │    UI    │ (beat highlight)
                 │  Update  │
                 └──────────┘
```

### Flow Example: User Changes BPM
1. User drags slider → `BPMController.handleBPMChange()`
2. Controller calls → `appState.setState({ bpm: newValue })`
3. State notifies → `timingEngine.setBPM(newValue)`
4. Timing engine recalculates → Next beat interval
5. State notifies → `bpmController.render()` (update UI display)

---

## File Structure

```
metrow/
├── app/
│   ├── src/
│   │   ├── core/                   # Business logic (no DOM)
│   │   │   ├── timing-engine.js    # Beat scheduling logic
│   │   │   └── audio-controller.js # Web Audio wrapper
│   │   │
│   │   ├── state/
│   │   │   └── app-state.js        # Centralized state manager
│   │   │
│   │   ├── ui/                     # UI components
│   │   │   ├── bpm-controller.js   # BPM slider/input
│   │   │   ├── beat-grid.js        # Visual beat indicators
│   │   │   └── controls.js         # Play/pause/settings
│   │   │
│   │   └── main.js                 # App initialization
│   │
│   ├── styles/
│   │   ├── base.css                # CSS reset + variables
│   │   └── components.css          # Component styles
│   │
│   ├── index.html                  # Entry point
│   └── docs/
│       └── architecture.md         # This file
│
└── tests/                          # Test files (separate from app)
    ├── timing-engine.test.js
    ├── audio-controller.test.js
    └── state.test.js
```

**Organization Principles:**
- `core/` = Pure JavaScript, no DOM
- `ui/` = DOM manipulation only
- `state/` = Data management
- Tests mirror `src/` structure

---

## Technology Stack Decisions

### 1. **Vanilla JavaScript** ✅
**Why NOT a framework?**
- No build step needed → Instant development
- Tiny bundle size (< 10KB total)
- Full control over timing precision
- Educational value (understand fundamentals)
- Zero dependencies = Zero security vulnerabilities

**When to reconsider:**
- If app grows beyond 15+ components
- Need complex state management (then add Zustand/Redux)

---

### 2. **CSS Approach: Vanilla CSS** ✅
**Why NOT Tailwind/CSS-in-JS?**
- No build step preserves simplicity
- CSS Custom Properties for theming
- Small app = minimal CSS (~200 lines)
- Full browser support

**CSS Architecture:**
```css
/* base.css - Design tokens */
:root {
  --color-primary: #3b82f6;
  --color-accent: #ef4444;
  --spacing-unit: 8px;
  --border-radius: 8px;
}

/* components.css - BEM naming */
.beat-grid { ... }
.beat-grid__beat { ... }
.beat-grid__beat--active { ... }
.beat-grid__beat--accent { ... }
```

---

### 3. **Build Tools: None** ✅
**Zero-build setup**
- Use ES6 modules (`type="module"` in HTML)
- Modern browsers support all needed features
- Instant refresh during development
- Deploy = copy files to static host

**Example HTML:**
```html
<script type="module" src="src/main.js"></script>
```

**If scaling up:**
- Add Vite (5-minute setup, instant HMR)
- Enable TypeScript for type safety
- Minification for production

---

### 4. **Web Audio API** ✅
**Why NOT `<audio>` tags?**
- Millisecond-precision timing
- Programmatic sound generation
- Low latency (< 10ms)
- Full control over waveforms

**Reference:**
- [MDN Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Chris Wilson's "A Tale of Two Clocks"](https://web.dev/audio-scheduling/)

---

## Event Handling Strategy

### 1. **User Input Events**
```javascript
// Debounced BPM slider
slider.addEventListener('input', debounce((e) => {
  appState.setState({ bpm: e.target.value })
}, 50))
```

### 2. **State Change Events**
```javascript
// Observer pattern for state updates
appState.subscribe((newState, oldState) => {
  if (newState.currentBeat !== oldState.currentBeat) {
    beatGrid.highlightBeat(newState.currentBeat)
  }
})
```

### 3. **Audio Scheduling**
```javascript
// Lookahead scheduling (recommended by Web Audio spec)
function scheduler() {
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(currentBeat, nextNoteTime)
    advanceCurrentBeat()
    nextNoteTime += beatInterval
  }
  requestAnimationFrame(scheduler) // 60fps scheduling loop
}
```

---

## Performance Considerations

### 1. **Timing Accuracy**
- **Challenge:** JavaScript timers (`setTimeout`) drift over time
- **Solution:** Web Audio API clock (`audioContext.currentTime`)
- **Implementation:** Lookahead scheduling pattern

### 2. **UI Rendering**
- **Challenge:** 60fps updates can cause jank
- **Solution:**
  - Use `requestAnimationFrame` for beat highlights
  - Debounce BPM slider (50ms)
  - CSS transitions for smooth animations

### 3. **Memory Management**
- Reuse oscillator nodes (don't create new ones per beat)
- Clean up event listeners on component unmount
- Use weak references for observers

---

## Accessibility

### Visual
- High contrast beat indicators
- Keyboard controls (Space = play/pause, Arrow keys = BPM)
- Focus visible states

### Auditory
- Visual beat grid for hearing-impaired users
- Haptic feedback option (Vibration API on mobile)

### Implementation:
```html
<button aria-label="Play metronome" aria-pressed="false">
  <svg aria-hidden="true">...</svg>
</button>
```

---

## Testing Strategy

### Unit Tests (Jest/Vitest)
```javascript
// timing-engine.test.js
test('calculates correct beat interval for 120 BPM', () => {
  const engine = new TimingEngine(120, 4)
  expect(engine.beatInterval).toBe(0.5) // 500ms
})

test('cycles through beats correctly', () => {
  const engine = new TimingEngine(120, 4)
  engine.advanceBeat() // 0 → 1
  engine.advanceBeat() // 1 → 2
  expect(engine.currentBeat).toBe(2)
})
```

### Integration Tests
- Test state → UI updates
- Test user interactions → state changes

### Manual Testing
- Verify audio timing with external metronome
- Test across browsers (Chrome, Firefox, Safari)

---

## Extensibility Points

### Phase 2 Features (Easy to Add)
1. **Preset Time Signatures:**
   - Add `presets.js` with common patterns
   - No architecture changes needed

2. **Custom Accent Patterns:**
   - Already supported in `accentPattern` state
   - Add UI for pattern editing

3. **Visual Themes:**
   - CSS custom properties already set up
   - Add theme switcher component

4. **Tap Tempo:**
   - Add method to `BPMController`
   - Calculate BPM from tap intervals

### Harder Additions (Require Refactoring)
- **Polyrhythms:** Need multiple timing engines
- **MIDI Output:** Need MIDI controller module
- **Audio Sample Upload:** Need audio buffer management

---

## Security & Privacy

### Web Audio Context
- Requires user gesture to start (browser policy)
- No network requests = no data leaks
- No cookies, no tracking

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'">
```

---

## Deployment

### Static Hosting (Zero config)
- GitHub Pages
- Netlify Drop
- Vercel

### CDN Optimization
- Inline critical CSS (< 2KB)
- Preload audio context on page load
- Service Worker for offline use (optional)

---

## Key Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | Vanilla JS | Simplicity, no build step, full control |
| **Styling** | Vanilla CSS | No dependencies, small scope |
| **State** | Observer pattern | Predictable, testable, scalable |
| **Audio** | Web Audio API | Precision, low latency |
| **Build** | None | Instant dev, modern browsers |
| **Testing** | Jest/Vitest | Standard, fast, simple setup |

---

## Next Steps for Implementation

1. **Core First:** Build `timing-engine.js` + tests
2. **Audio Second:** Implement `audio-controller.js`
3. **State Third:** Create `app-state.js`
4. **UI Last:** Build components using working core

**Rationale:** Bottom-up development ensures core logic is solid before adding UI complexity.

---

## References

- [Web Audio API Spec](https://www.w3.org/TR/webaudio/)
- [A Tale of Two Clocks (Scheduling)](https://web.dev/audio-scheduling/)
- [MDN: Using Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)
- [Observer Pattern in JavaScript](https://www.patterns.dev/posts/observer-pattern)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-29
**Author:** Analyst/Architect Agent
**Status:** Ready for Implementation
