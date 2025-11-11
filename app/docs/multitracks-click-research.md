# Multitracks.com Metronome Click Sound Research

## Executive Summary

This document contains research findings on the metronome/click track sound characteristics used by Multitracks.com, a leading worship music backing tracks platform. While specific technical details about their built-in click sounds are not publicly documented, this research synthesizes available information about their platform, technical requirements, and industry standards.

---

## 1. Platform Overview

### What is Multitracks.com?

**Multitracks.com** is a comprehensive digital platform providing worship resources including:
- Professional backing tracks for worship songs
- Individual instrument tracks (multitrack recordings)
- Click & Guide tracks for tempo synchronization
- Playback software for churches and worship teams

### Target Audience
- Church worship teams
- Worship leaders and musicians
- Audio engineers in church production

### Key Product: Playback App
Multitracks.com's **Playback** application is their primary software for worship teams, offering:
- Built-in click track options
- Custom click sound uploads
- Automatic tempo synchronization with backing tracks
- Subdivision controls (quarter notes, eighth notes, sixteenth notes)
- Accent patterns for downbeats

---

## 2. Technical Specifications for Custom Click Sounds

### Required Audio Format

According to Multitracks.com's official documentation:

| Specification | Requirement |
|--------------|-------------|
| **Sample Rate** | 44.1 kHz |
| **Bit Depth** | 16 bit |
| **File Format** | M4A (AAC) |
| **Container** | ZIP file containing M4A files |
| **Channels** | Stereo |
| **Duration** | 0.2 - 2.0 seconds |
| **Transient Placement** | As close to beginning as possible |

### File Naming
- No special symbols allowed (&, /, *, etc.)
- Must correspond to subdivision labels (accent, quarter, eighth, sixteenth)

---

## 3. Click Sound Features in Playback

### Built-in Click Options
Multitracks.com offers multiple **built-in click sounds** (specific sound types not documented publicly), which they recommend over custom uploads for cloud songs.

### Subdivision Support
When using built-in clicks, users can control:
- **Accent** - Downbeat emphasis
- **Quarter note** (¼) - Beat clicks
- **Eighth note** (⅛) - Subdivision clicks
- **Sixteenth note** (1/16) - Fine subdivision clicks

Each subdivision can have its own volume level in the mix.

### Custom Click Limitations
- Uploaded custom click sounds do **NOT** support subdivision or accent settings
- Custom clicks play the pre-engineered audio file exactly as uploaded
- Built-in clicks are recommended for full feature access

---

## 4. User Descriptions & Feedback

### Sound Preferences from Worship Community

Based on research from worship music forums and tutorials:

1. **Woodblock Preference**
   - Many worship leaders prefer "natural woodblock sounds" over electronic beeps
   - Woodblock clicks are less fatiguing during long rehearsals/services

2. **Pitch Requirements**
   - Click must be "high enough pitch so it won't get lost in the mix"
   - Should be audible but not ear-piercing
   - Needs to cut through drums, bass, and other instruments

3. **Monitoring Quality**
   - Professional teams use quality in-ear monitors (Shure, Westone, 1964 Ears)
   - Consumer earbuds often lack clarity for click tracks
   - Isolation is critical - musicians need to hear click clearly

4. **Timing Precision**
   - Click track transient must be extremely tight (< 1ms attack)
   - Synchronization with backing tracks must be sample-accurate
   - Any latency is immediately noticeable and disruptive

---

## 5. Industry Standards for Professional Metronome Clicks

### Common Click Sound Types

1. **Electronic Beep/Sine Tone**
   - Frequency: 800-2000 Hz (typical)
   - Accent: Higher pitch (1500-2500 Hz) or louder volume
   - Waveform: Sine wave or band-limited square wave
   - Duration: 10-50ms

2. **Woodblock/Percussion**
   - More natural sound profile
   - Broader frequency spectrum (200-4000 Hz)
   - Short decay (< 100ms)
   - Accent achieved through louder volume or lower pitch

3. **Digital Click (Sharp Transient)**
   - Very short duration (5-20ms)
   - Noise burst or filtered impulse
   - Extremely tight timing
   - High-frequency content for clarity

### Typical Implementation Parameters

Based on professional metronome and DAW standards:

```
NORMAL CLICK:
- Waveform: Sine wave or woodblock sample
- Frequency: 1000-1500 Hz (sine) or broadband (woodblock)
- Duration: 20-40ms
- Envelope: Fast attack (< 1ms), exponential decay
- Volume: -12 to -6 dBFS

ACCENT CLICK (Downbeat):
- Frequency: 1500-2000 Hz (sine) or same as normal
- Duration: 30-50ms (slightly longer)
- Envelope: Fast attack (< 1ms), exponential decay
- Volume: -6 to 0 dBFS (+6dB louder than normal)
```

---

## 6. Best Guess Implementation for Multitracks.com-Style Click

### Recommended Parameters (Based on Research)

#### Option 1: Electronic Beep (Simple)
```javascript
{
  normal: {
    waveform: 'sine',
    frequency: 1200,      // Hz - high enough to cut through
    duration: 0.03,       // 30ms
    attack: 0.001,        // 1ms
    decay: 0.029,         // Exponential decay
    volume: 0.6           // 60% amplitude
  },
  accent: {
    waveform: 'sine',
    frequency: 1800,      // Hz - higher pitch for accent
    duration: 0.04,       // 40ms - slightly longer
    attack: 0.001,        // 1ms
    decay: 0.039,         // Exponential decay
    volume: 0.9           // 90% amplitude (+50% louder)
  }
}
```

#### Option 2: Woodblock (Natural)
```javascript
{
  normal: {
    waveform: 'filtered-noise',  // Band-pass filtered noise burst
    filterFreq: 800,              // Hz - center frequency
    filterQ: 3,                   // Moderate resonance
    duration: 0.025,              // 25ms
    attack: 0.0005,               // 0.5ms - very fast
    decay: 0.0245,                // Exponential decay
    volume: 0.65                  // 65% amplitude
  },
  accent: {
    waveform: 'filtered-noise',
    filterFreq: 600,              // Hz - lower for accent
    filterQ: 3,
    duration: 0.035,              // 35ms - longer
    attack: 0.0005,
    decay: 0.0345,
    volume: 0.95                  // 95% amplitude
  }
}
```

#### Option 3: Hybrid (Professional)
```javascript
{
  normal: {
    // Mix of sine tone + noise burst
    sine: { freq: 1000, volume: 0.5 },
    noise: {
      filterFreq: 2000,
      filterQ: 5,
      volume: 0.3
    },
    duration: 0.025,
    attack: 0.0008,
    decay: 0.0242,
    totalVolume: 0.7
  },
  accent: {
    sine: { freq: 1500, volume: 0.6 },
    noise: {
      filterFreq: 2500,
      filterQ: 5,
      volume: 0.4
    },
    duration: 0.035,
    attack: 0.0008,
    decay: 0.0342,
    totalVolume: 1.0
  }
}
```

---

## 7. Critical Design Considerations

### Timing Precision
- **Sample-accurate timing** is non-negotiable
- Any jitter or latency will be immediately noticed by musicians
- Scheduling should use `AudioContext.currentTime` + lookahead
- Buffer clicks in advance (100-200ms lookahead recommended)

### Frequency Selection
- **Too low** (< 600 Hz): Gets masked by bass/drums
- **Too high** (> 3000 Hz): Becomes ear-fatiguing, harsh
- **Sweet spot**: 1000-1500 Hz for normal, 1500-2000 Hz for accent

### Duration Selection
- **Too short** (< 10ms): May sound like a glitch, hard to perceive
- **Too long** (> 100ms): Clutters the mix, overlaps with music
- **Sweet spot**: 20-40ms provides clear definition without intrusion

### Volume Dynamics
- Accent should be **noticeably louder** but not jarring
- Recommended difference: +3 to +6 dB (50% to 100% amplitude increase)
- User should be able to mix click volume independently

### Audio Processing
- **High-pass filter** at 400-500 Hz to remove low-end mud
- **Gentle compression** to ensure consistent perceived loudness
- **No reverb or delay** - click must be dry and immediate

---

## 8. Synthesis Approach Recommendations

### For Web Audio API Implementation

```javascript
// Recommended synthesis chain:
1. Generate base waveform (sine or noise)
2. Apply band-pass or high-pass filter
3. Apply ADSR envelope (very fast attack, exponential decay)
4. Apply gentle compression (optional)
5. Pan to appropriate channel (L for click, R for music)
6. Schedule with sample-accurate timing
```

### Sample-Based Approach
- Pre-render click sounds to AudioBuffer
- Store multiple variations (normal, accent, subdivisions)
- Use `AudioBufferSourceNode` for playback
- Extremely low CPU overhead
- Guarantees consistent sound

### Real-Time Synthesis Approach
- Generate clicks on-demand with `OscillatorNode`
- More flexible for user customization
- Slightly higher CPU usage
- May introduce very minor timing variability

**Recommendation**: **Sample-based approach** for production use, matching Multitracks.com's model of pre-engineered click sounds.

---

## 9. Key Findings Summary

### What We Know
✅ Multitracks.com uses multiple built-in click sound options
✅ Custom clicks must be 44.1kHz, 16-bit, stereo M4A files
✅ Click duration should be 0.2-2.0 seconds (likely on shorter end)
✅ Transient must be at beginning for tight timing
✅ Built-in clicks support accent and subdivision mixing
✅ Worship community prefers woodblock or high-pitch beeps
✅ Click must cut through dense musical mix

### What We Don't Know
❌ Exact waveform of built-in click sounds
❌ Specific frequencies used
❌ Exact duration of default clicks
❌ Audio processing chain details
❌ Whether clicks are sample-based or synthesized

### Educated Guesses
🔸 Click is likely **woodblock** or **high-pitched beep** (1000-1500 Hz)
🔸 Duration probably **20-40ms** for clarity without clutter
🔸 Accent achieved through **higher pitch** or **louder volume** (+6dB)
🔸 Implementation is likely **sample-based** for consistency
🔸 Audio quality optimized for **in-ear monitor playback**

---

## 10. Implementation Recommendations

### For Metrow Project

Based on this research, recommend the following approach:

1. **Offer Multiple Click Presets**
   - "Beep" (sine tone, 1200 Hz)
   - "Woodblock" (filtered noise)
   - "Soft" (lower pitch, 800 Hz)
   - "Bright" (higher pitch, 1800 Hz)
   - Allow user selection

2. **Accent Implementation**
   - Accent clicks should be +6dB louder OR higher pitch
   - User should be able to toggle accent on/off
   - Visual indication of accented beats

3. **Subdivision Support**
   - Quarter notes (always on)
   - Eighth notes (optional)
   - Sixteenth notes (optional)
   - Independent volume control for each subdivision

4. **Technical Implementation**
   - Use pre-rendered AudioBuffer samples (like Multitracks)
   - Sample-accurate scheduling with Web Audio API
   - 100-200ms lookahead for buffer stability
   - High-pass filter at 500 Hz
   - Stereo output with pan control

5. **User Controls**
   - Click sound selection (preset dropdown)
   - Volume control
   - Accent on/off toggle
   - Subdivision selection (quarter/eighth/sixteenth)
   - Separate volume for subdivisions

---

## 11. References

### Official Documentation
- [MultiTracks.com Custom Click Sound Guide](https://helpcenter.multitracks.com/en/articles/6654274-how-to-custom-click-sound-in-playback)
- [MultiTracks.com Playback User Guide](https://helpcenter.multitracks.com/en/articles/4944485-playback-user-guide)

### Worship Community Resources
- [Loop Community - Click Tracks for Drummers](https://loopcommunity.com/blog/2012/03/for-drummers-using-click-track-or-metronome-in-worship/)
- [Worship Team Coach - 12 Tips for Using a Click](https://www.worshipteamcoach.com/musicianship/12-tips-for-using-a-click/)
- [Church Front - Click and Tracks Setup](https://churchfront.com/2023/06/11/how-to-setup-a-click-and-tracks-for-worship-bands/)

### Technical Resources
- [LANDR Blog - Click Tracks Guide](https://blog.landr.com/click-tracks/)
- Web Audio API specification (for implementation)

---

## 12. Next Steps for Development

1. **Prototype Testing**
   - Create 3-4 click sound variations
   - Test with musicians/worship leaders
   - Gather feedback on clarity and tone preference

2. **A/B Comparison**
   - If possible, record actual Multitracks.com click
   - Analyze waveform and frequency spectrum
   - Match characteristics in implementation

3. **User Customization**
   - Allow users to upload custom click sounds
   - Follow Multitracks technical requirements (44.1kHz, 16-bit, stereo)
   - Provide presets as starting point

4. **Performance Optimization**
   - Ensure click timing is rock-solid
   - Test with various tempos (40-240 BPM)
   - Verify no audio dropouts or glitches

---

**Research Completed**: 2025-11-10
**Researcher**: Research Agent (Hive Mind)
**Status**: Comprehensive research complete - ready for implementation
