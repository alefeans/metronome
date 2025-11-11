# Loop Pattern Architecture Design

## Overview
Bar-based loop pattern feature for practice timing with alternating sound/mute cycles.

---

## User Story
As a musician, I want to practice keeping time by:
- Setting N bars to play with sound (e.g., 4 bars)
- Setting M bars to play muted (e.g., 2 bars)
- Loop repeats: Sound → Mute → Sound → Mute → ...
- This helps develop internal timing without auditory feedback

---

## UI Design

### Layout Mockup
```
┌─────────────────────────────────────────┐
│         METRONOME CONTROLS              │
│  BPM: [120] ♩ Time: [4/4]              │
├─────────────────────────────────────────┤
│         LOOP PATTERN                    │
│  ┌───────────────────────────────────┐  │
│  │ [✓] Enable Loop Practice          │  │
│  │                                    │  │
│  │  Sound Bars:  [4] ┃━━━━┃          │  │
│  │  Mute Bars:   [2] ┃━━┃            │  │
│  │                                    │  │
│  │  ┌──────────────────────────────┐ │  │
│  │  │ Bar 3 of 6  ●●●○○○           │ │  │
│  │  │ [━━━━━━━━━━━━━━━━━━━━━━━━━] │ │  │
│  │  │ SOUND PHASE                   │ │  │
│  │  └──────────────────────────────┘ │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│        [START/STOP]                     │
└─────────────────────────────────────────┘
```

### Component Placement
1. **Loop Pattern Section**: New collapsible section below time signature
2. **Toggle Switch**: Enable/disable loop feature
3. **Bar Input Controls**: Number spinners with +/- buttons
4. **Progress Indicator**: Visual bar counter with phase indicator
5. **Progress Bar**: Horizontal bar showing position in total cycle

### Visual Design Elements

**Phase Indicators:**
```
SOUND PHASE:  [━━━━━━━━━━━━] Green background, clicks playing
MUTE PHASE:   [━━━━━━━━━━━━] Gray background, no clicks
```

**Bar Counter Dots:**
```
Bar 3 of 6:  ●●●○○○  (filled = completed, empty = remaining)
```

**Color Scheme:**
- Sound Phase: `#10b981` (green-500)
- Mute Phase: `#6b7280` (gray-500)
- Active Bar: `#3b82f6` (blue-500)
- Disabled: `#d1d5db` (gray-300)

---

## State Management Architecture

### Data Structure
```javascript
// Loop configuration state
const loopConfig = {
    enabled: false,           // Loop feature on/off
    soundBars: 4,            // N bars with sound
    muteBars: 2,             // M bars without sound
    currentBar: 1,           // Current bar in cycle (1-based)
    currentBeat: 1,          // Current beat in bar
    inSoundPhase: true,      // true = sound, false = mute
    totalBars: 6             // soundBars + muteBars
};

// Computed properties
const loopState = {
    totalBars: soundBars + muteBars,
    soundPhaseEnd: soundBars,
    mutePhaseEnd: soundBars + muteBars,
    cycleProgress: (currentBar / totalBars) * 100,
    shouldPlayClick: enabled && inSoundPhase
};
```

### State Transitions
```
┌─────────────────────────────────────────┐
│ Loop Start (currentBar = 1)             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ SOUND PHASE (bars 1-N)                  │
│ • Play clicks on each beat              │
│ • Visual: green background              │
│ • currentBar increments each bar        │
└────────────┬────────────────────────────┘
             │ currentBar > soundBars
             ▼
┌─────────────────────────────────────────┐
│ MUTE PHASE (bars N+1 to N+M)           │
│ • Suppress clicks                       │
│ • Visual: gray background               │
│ • Beat counter still advances           │
└────────────┬────────────────────────────┘
             │ currentBar > totalBars
             ▼
┌─────────────────────────────────────────┐
│ Loop Reset (currentBar = 1)             │
│ • Return to sound phase                 │
│ • Cycle repeats                         │
└─────────────────────────────────────────┘
```

### State Update Logic
```javascript
// On each beat tick
function onBeatTick(currentBeat, beatsPerBar) {
    if (currentBeat === 1) {
        // New bar started
        incrementBar();
        updatePhase();
    }
}

function incrementBar() {
    loopConfig.currentBar++;

    // Reset to 1 when cycle completes
    if (loopConfig.currentBar > loopConfig.totalBars) {
        loopConfig.currentBar = 1;
    }
}

function updatePhase() {
    if (loopConfig.currentBar <= loopConfig.soundBars) {
        loopConfig.inSoundPhase = true;
    } else {
        loopConfig.inSoundPhase = false;
    }
}

// Determine if click should play
function shouldPlayClick() {
    if (!loopConfig.enabled) return true;  // Normal mode
    return loopConfig.inSoundPhase;        // Loop mode
}
```

---

## Component Architecture

### Component Hierarchy
```
MetronomeApp
├── MetronomeControls
│   ├── BPMControl
│   ├── TimeSignatureControl
│   └── LoopPatternControl  ← NEW
│       ├── LoopToggle
│       ├── BarInputs
│       │   ├── SoundBarsInput
│       │   └── MuteBarsInput
│       └── LoopProgressIndicator
│           ├── BarCounter
│           ├── ProgressBar
│           └── PhaseLabel
└── PlaybackControl
```

### New Components

#### 1. LoopPatternControl
**Purpose**: Container for all loop pattern UI
**Props**:
```javascript
{
    config: LoopConfig,
    onConfigChange: (config: LoopConfig) => void,
    currentBar: number,
    currentPhase: 'sound' | 'mute'
}
```

#### 2. BarInputs
**Purpose**: Input controls for sound/mute bar counts
**Features**:
- Number spinners with min/max validation
- +/- buttons for easy adjustment
- Keyboard input support
- Real-time validation

**Validation Rules**:
```javascript
const VALIDATION = {
    soundBars: { min: 0, max: 32, default: 4 },
    muteBars: { min: 0, max: 32, default: 2 }
};

// Special cases
if (soundBars === 0 && muteBars === 0) {
    // Disable loop feature
    loopConfig.enabled = false;
}

if (soundBars > 0 && muteBars === 0) {
    // Acts as normal metronome
    loopConfig.enabled = false;
}
```

#### 3. LoopProgressIndicator
**Purpose**: Real-time visual feedback of loop position
**Elements**:
- Bar counter: "Bar X of Y"
- Dot indicators: ●●●○○○
- Progress bar: horizontal bar with fill
- Phase label: "SOUND PHASE" / "MUTE PHASE"

**Update Frequency**: Every beat (synchronized with metronome)

---

## Visual Feedback Strategy

### 1. Phase Indication (Primary)
```css
.loop-indicator {
    transition: background-color 0.3s ease;
}

.loop-indicator.sound-phase {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-left: 4px solid #10b981;
}

.loop-indicator.mute-phase {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    border-left: 4px solid #6b7280;
}
```

### 2. Progress Animation
```javascript
// Smooth progress bar animation
const progressPercent = ((currentBar - 1) / totalBars) * 100 +
                       (currentBeat / beatsPerBar) * (100 / totalBars);

// CSS transition
.progress-fill {
    width: ${progressPercent}%;
    transition: width 0.1s linear;
}
```

### 3. Beat Pulse (Secondary)
```css
/* Pulse on each beat */
@keyframes beat-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.bar-dot.active {
    animation: beat-pulse 0.2s ease;
}
```

### 4. Bar Transition Effect
```javascript
// Visual cue when bar changes
function onBarChange() {
    // Flash effect
    progressIndicator.classList.add('bar-transition');
    setTimeout(() => {
        progressIndicator.classList.remove('bar-transition');
    }, 200);
}
```

---

## Implementation Phases

### Phase 1: Core Loop Logic (Priority: HIGH)
**Duration**: 1-2 hours

**Tasks**:
1. Create loop state management
2. Implement bar counting logic
3. Add phase detection (sound/mute)
4. Integrate with existing tick system
5. Add click suppression during mute phase

**Files to Modify**:
- `/app/src/lib/metronome.ts` - Core loop logic
- `/app/src/lib/types.ts` - Add LoopConfig type

**Testing**:
- Bar counter increments correctly
- Phase transitions at right time
- Loop resets after total bars
- Clicks suppressed during mute phase

### Phase 2: UI Components (Priority: HIGH)
**Duration**: 2-3 hours

**Tasks**:
1. Create LoopPatternControl component
2. Add bar input controls
3. Implement loop toggle
4. Add basic progress indicator
5. Wire up state to UI

**Files to Create**:
- `/app/src/components/LoopPatternControl.tsx`
- `/app/src/components/BarInputs.tsx`
- `/app/src/components/LoopProgressIndicator.tsx`

**Testing**:
- Inputs update state correctly
- Toggle enables/disables feature
- UI reflects current state

### Phase 3: Visual Feedback (Priority: MEDIUM)
**Duration**: 2-3 hours

**Tasks**:
1. Add progress bar animation
2. Implement phase color coding
3. Add bar counter dots
4. Create transition effects
5. Polish animations

**Files to Modify**:
- Component CSS/styles
- Animation timing constants

**Testing**:
- Smooth progress bar movement
- Phase colors transition correctly
- Animations don't lag metronome

### Phase 4: Edge Cases & Polish (Priority: MEDIUM)
**Duration**: 1-2 hours

**Tasks**:
1. Handle edge cases (0 bars, etc.)
2. Add input validation
3. Implement preset patterns
4. Add keyboard shortcuts
5. Accessibility improvements

**Testing**:
- All edge cases handled
- Validation prevents invalid states
- Keyboard navigation works
- Screen reader compatible

### Phase 5: Persistence & Presets (Priority: LOW)
**Duration**: 1 hour

**Tasks**:
1. Save loop config to localStorage
2. Add common preset patterns
3. Remember last used settings

**Presets to Include**:
- "4-2" (4 bars sound, 2 mute) - Standard
- "8-4" (8 bars sound, 4 mute) - Extended
- "2-2" (2 bars sound, 2 mute) - Short
- "1-1" (1 bar sound, 1 mute) - Minimal

---

## Technical Considerations

### Performance
- **Update Frequency**: Only on beat ticks (not every frame)
- **Render Optimization**: Use React.memo for progress components
- **Animation**: CSS transitions (GPU accelerated)

### Audio Timing
- **No Audio Latency**: Click suppression is instant (boolean check)
- **Tick Precision**: Loop logic runs in same tick as metronome
- **No Drift**: Bar counter synchronized with beat counter

### Accessibility
- **Screen Reader**: Announce phase changes
- **Keyboard**: Tab navigation, Enter to toggle
- **Focus Management**: Visible focus indicators
- **ARIA Labels**: Descriptive labels for all controls

### Mobile Considerations
- **Touch Targets**: Minimum 44x44px for inputs
- **Responsive**: Stack controls vertically on small screens
- **Gestures**: Swipe to toggle phases (optional)

---

## Data Flow Diagram

```
User Input (UI)
    │
    ├─→ soundBars change
    │       │
    │       ├─→ Update loopConfig.soundBars
    │       └─→ Recalculate loopConfig.totalBars
    │
    ├─→ muteBars change
    │       │
    │       ├─→ Update loopConfig.muteBars
    │       └─→ Recalculate loopConfig.totalBars
    │
    └─→ Loop toggle
            │
            └─→ Update loopConfig.enabled

Metronome Tick
    │
    ├─→ Beat increments
    │       │
    │       └─→ If beat === 1
    │               │
    │               ├─→ Increment currentBar
    │               ├─→ Update inSoundPhase
    │               └─→ Reset if currentBar > totalBars
    │
    └─→ Should play click?
            │
            ├─→ If loop disabled: YES
            └─→ If loop enabled: YES if inSoundPhase, NO if not

UI Updates (React)
    │
    ├─→ Progress bar width
    ├─→ Bar counter text
    ├─→ Phase indicator color
    └─→ Dot indicators state
```

---

## Edge Cases & Solutions

| Edge Case | Behavior | Solution |
|-----------|----------|----------|
| soundBars = 0, muteBars > 0 | Invalid state | Disable loop toggle, show warning |
| soundBars > 0, muteBars = 0 | Normal metronome | Allow, acts as regular metronome |
| Both = 0 | Invalid state | Disable loop toggle |
| Very large values (>32) | UI/UX issue | Set max limit, show warning |
| Change bars mid-loop | Reset or continue? | Reset to bar 1 on config change |
| Time signature change | Reset bar counter? | Yes, reset to bar 1 |
| BPM change | Continue loop? | Yes, maintain bar position |

---

## Success Metrics

**Functional Requirements**:
- ✅ Loop cycles between sound and mute phases
- ✅ Bar counter accurate and synchronized
- ✅ Clicks suppressed during mute phase
- ✅ Visual feedback clear and responsive
- ✅ All edge cases handled gracefully

**Performance Requirements**:
- ⏱️ No audio timing drift
- ⏱️ UI updates < 16ms (60fps)
- ⏱️ State changes instantaneous
- ⏱️ No memory leaks during long sessions

**UX Requirements**:
- 🎯 Learning curve < 30 seconds
- 🎯 Visual feedback immediate and clear
- 🎯 Mobile-friendly controls
- 🎯 Accessible to screen readers

---

## Future Enhancements (v2.0)

1. **Pattern Presets**: Save custom patterns
2. **Visual Metronome**: Flash on each beat
3. **Accent Patterns**: Different click sounds per beat
4. **Polyrhythm Support**: Multiple simultaneous patterns
5. **Practice Sessions**: Track practice time per pattern
6. **Export Patterns**: Share patterns with others

---

## Files to Create/Modify

### New Files
```
/app/src/components/LoopPatternControl.tsx
/app/src/components/BarInputs.tsx
/app/src/components/LoopProgressIndicator.tsx
/app/src/hooks/useLoopPattern.ts
```

### Modified Files
```
/app/src/lib/metronome.ts            - Add loop logic
/app/src/lib/types.ts                - Add LoopConfig type
/app/src/components/MetronomeApp.tsx - Integrate loop control
```

### Test Files
```
/app/tests/loopPattern.test.ts       - Unit tests
/app/tests/loopUI.test.tsx           - Component tests
```

---

## References

**Design Inspiration**:
- Metronome apps: Soundbrenner, Pro Metronome
- Practice patterns: Common music education methods
- Visual feedback: Material Design progress indicators

**Technical Docs**:
- Web Audio API timing precision
- React rendering optimization
- CSS animation performance

---

**Architecture approved by: System Architect**
**Date: 2025-10-29**
**Version: 1.0**
