# Metronome Web App

A minimal, elegant metronome built with vanilla JavaScript and the Web Audio API.

## Features

✨ **Precise Timing**: Uses Web Audio API for accurate beat scheduling (not setTimeout)
🎵 **Flexible Time Signatures**: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8
🎚️ **BPM Range**: 40-240 BPM with slider and numeric input
🎯 **Beat Customization**: Click beats to cycle between Normal → Accent → Mute
👁️ **Visual Feedback**: Animated beat indicators show current position
🎨 **Minimalist Design**: Clean, responsive interface with smooth animations

## Usage

### Running the App

Simply open `/app/src/index.html` in any modern web browser. No build step required!

```bash
# From the project root
open app/src/index.html
```

Or use a local server:
```bash
cd app/src
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Controls

- **BPM Slider/Input**: Adjust tempo (40-240 BPM)
- **Time Signature Dropdown**: Select time signature
- **Beat Grid**: Click any beat to cycle its state:
  - **Gray (Normal)**: Standard beat
  - **Red (Accent)**: Emphasized beat (louder, higher pitch)
  - **Dark Gray (Mute)**: Silent beat (visual only)
- **Play/Pause Button**: Start/stop the metronome

## Technical Implementation

### Core Components

1. **`metronome.js`** - Timing Engine
   - Web Audio API scheduling
   - Precise beat timing using `AudioContext.currentTime`
   - Oscillator-based click sounds
   - Look-ahead scheduler (25ms) for smooth performance

2. **`ui.js`** - UI Controller
   - Beat grid rendering
   - User interaction handling
   - Visual beat feedback synchronization
   - State management

3. **`styles.css`** - Minimalist Styling
   - Clean color palette (neutral grays with blue accents)
   - Smooth transitions and animations
   - Responsive layout
   - Accessible controls

4. **`index.html`** - Structure
   - Semantic HTML5
   - No external dependencies
   - Lightweight and fast

### Key Design Decisions

- **Web Audio API**: Ensures sub-millisecond timing accuracy
- **Look-ahead Scheduling**: Schedules beats in advance to prevent timing drift
- **State Cycling**: Simple click interaction for beat customization
- **No Dependencies**: Pure vanilla JavaScript for minimal footprint
- **Responsive**: Works on desktop and mobile devices

## Browser Compatibility

Requires a modern browser with Web Audio API support:
- Chrome 34+
- Firefox 25+
- Safari 14.1+
- Edge 79+

## File Structure

```
app/
└── src/
    ├── index.html      # Main HTML structure
    ├── styles.css      # Minimalist styling
    ├── metronome.js    # Core timing engine
    └── ui.js           # UI controller
```

## License

Open source - feel free to use and modify!
