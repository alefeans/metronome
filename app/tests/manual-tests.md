# Manual Testing Checklist - Metronome Web App

## 🎯 Pre-Test Setup

### Equipment Needed
- [ ] Desktop computer with latest Chrome, Firefox, Safari
- [ ] Android device with Chrome
- [ ] iOS device (iPhone/iPad) with Safari
- [ ] Headphones or speakers for audio testing
- [ ] Stopwatch or timer app
- [ ] Screen reader (NVDA/JAWS on Windows, VoiceOver on Mac/iOS)

### Test Environment
- [ ] Clear browser cache and cookies
- [ ] Disable browser extensions that might interfere
- [ ] Ensure stable internet connection (if app requires CDN resources)
- [ ] Set device volume to 50% for consistent audio testing

---

## 📋 Test Session 1: Core Functionality

### 1.1 Initial Load
- [ ] Open the app in browser
- [ ] **Verify**: Page loads within 3 seconds
- [ ] **Verify**: No JavaScript errors in console (F12)
- [ ] **Verify**: Default BPM is visible and sensible (e.g., 120)
- [ ] **Verify**: Default time signature is displayed (e.g., 4/4)
- [ ] **Verify**: Beat indicators are visible
- [ ] **Verify**: Start button is clearly labeled and accessible

**Notes**: _______________________________________________________

### 1.2 Start Metronome
- [ ] Click the "Start" button
- [ ] **Verify**: Audio begins playing immediately (within 100ms)
- [ ] **Verify**: Beat indicator flashes in sync with audio
- [ ] **Verify**: Button changes to "Stop"
- [ ] **Verify**: First beat sounds like an accent (if default pattern)
- [ ] **Listen**: Sound is clear, no clicks, pops, or distortion

**Notes**: _______________________________________________________

### 1.3 Stop Metronome
- [ ] Click the "Stop" button
- [ ] **Verify**: Audio stops immediately
- [ ] **Verify**: Beat indicator stops flashing
- [ ] **Verify**: Button changes back to "Start"
- [ ] **Verify**: No residual sounds or echoes

**Notes**: _______________________________________________________

### 1.4 BPM Control - Slider
- [ ] While metronome is STOPPED:
  - [ ] Drag slider to 60 BPM
  - [ ] **Verify**: BPM display updates to "60"
  - [ ] Drag slider to 180 BPM
  - [ ] **Verify**: BPM display updates to "180"

- [ ] While metronome is RUNNING:
  - [ ] Start at 120 BPM
  - [ ] Drag slider to 90 BPM while running
  - [ ] **Verify**: Tempo changes smoothly without stopping
  - [ ] **Listen**: No audio glitches during tempo change

**Notes**: _______________________________________________________

### 1.5 BPM Control - Numeric Input
- [ ] Click on BPM input field
- [ ] Type "72" and press Enter
- [ ] **Verify**: BPM changes to 72
- [ ] **Verify**: Slider position updates to match
- [ ] Try invalid inputs:
  - [ ] Type "abc" → **Verify**: Rejected or error message shown
  - [ ] Type "0" → **Verify**: Rejected or reset to minimum (40)
  - [ ] Type "999" → **Verify**: Capped at maximum (240)

**Notes**: _______________________________________________________

### 1.6 Time Signature Selection
- [ ] Select 3/4 time signature
- [ ] **Verify**: Beat grid shows 3 beats
- [ ] **Verify**: If running, metronome adapts immediately
- [ ] Select 6/8 time signature
- [ ] **Verify**: Beat grid shows 6 beats
- [ ] Select 4/4 time signature
- [ ] **Verify**: Beat grid shows 4 beats

**Notes**: _______________________________________________________

---

## 📋 Test Session 2: Beat Configuration

### 2.1 Accent Configuration
- [ ] Set time signature to 4/4
- [ ] Click on beat 1 indicator
- [ ] **Verify**: Cycles through states (Normal → Accent → Mute → Normal)
- [ ] **Verify**: Visual indication of state (different color/icon)
- [ ] Start metronome with beat 1 as ACCENT
- [ ] **Listen**: Beat 1 is noticeably louder or higher pitch
- [ ] **Listen**: Beats 2, 3, 4 are normal

**Notes**: _______________________________________________________

### 2.2 Mute Configuration
- [ ] Configure beat 2 as MUTE
- [ ] Start metronome
- [ ] **Verify**: Visual indicator flashes on beat 2
- [ ] **Listen**: NO SOUND on beat 2
- [ ] **Verify**: Timing remains consistent (no gap)
- [ ] **Listen**: Beat 3 follows at correct interval

**Notes**: _______________________________________________________

### 2.3 Complex Pattern
- [ ] Set time signature to 4/4
- [ ] Configure pattern: Accent, Normal, Mute, Accent
- [ ] Start metronome at 100 BPM
- [ ] **Listen**: Pattern repeats correctly
  - Beat 1: Accent
  - Beat 2: Normal
  - Beat 3: Silence (visual only)
  - Beat 4: Accent
- [ ] **Verify**: Pattern loops seamlessly

**Notes**: _______________________________________________________

### 2.4 Configuration During Playback
- [ ] Start metronome with all normal beats
- [ ] While running, change beat 3 to MUTE
- [ ] **Verify**: Change takes effect on the next cycle
- [ ] While running, change beat 1 to ACCENT
- [ ] **Verify**: Change takes effect immediately or on next measure

**Notes**: _______________________________________________________

---

## 📋 Test Session 3: Timing Accuracy

### 3.1 Basic Timing Test (60 BPM)
- [ ] Set BPM to 60 (1 beat per second)
- [ ] Start metronome
- [ ] Use a stopwatch: Start timer on first beat
- [ ] Count 60 beats (1 minute)
- [ ] Stop timer on 60th beat
- [ ] **Verify**: Timer shows 59-61 seconds (within 1 second tolerance)

**Actual time**: _________ seconds
**Pass/Fail**: _________

### 3.2 Fast Tempo Test (180 BPM)
- [ ] Set BPM to 180 (3 beats per second)
- [ ] Start metronome
- [ ] Start timer on first beat
- [ ] Count 180 beats (1 minute)
- [ ] Stop timer on 180th beat
- [ ] **Verify**: Timer shows 59-61 seconds

**Actual time**: _________ seconds
**Pass/Fail**: _________

### 3.3 Long Duration Drift Test
- [ ] Set BPM to 120
- [ ] Start metronome
- [ ] Let run for 5 minutes while doing other tasks
- [ ] Compare with a reference metronome or clock
- [ ] **Verify**: No noticeable drift (should stay in sync)

**Observations**: _______________________________________________________

---

## 📋 Test Session 4: Cross-Browser Testing

### 4.1 Chrome Desktop
- [ ] Complete Test Sessions 1-3 in Chrome
- [ ] **Overall Result**: Pass / Fail
- [ ] **Issues Found**: _______________________________________

### 4.2 Firefox Desktop
- [ ] Complete Test Sessions 1-3 in Firefox
- [ ] **Overall Result**: Pass / Fail
- [ ] **Issues Found**: _______________________________________

### 4.3 Safari Desktop (macOS)
- [ ] Complete Test Sessions 1-3 in Safari
- [ ] **Note**: Safari may require user interaction before audio
- [ ] **Verify**: Clear prompt to enable audio if needed
- [ ] **Overall Result**: Pass / Fail
- [ ] **Issues Found**: _______________________________________

### 4.4 Mobile Chrome (Android)
- [ ] Open app on Android device
- [ ] **Verify**: Layout is readable and controls are accessible
- [ ] **Verify**: Touch targets are large enough (≥44x44px)
- [ ] Start metronome
- [ ] **Verify**: Audio plays
- [ ] Lock screen
- [ ] **Verify**: Audio continues or expected behavior
- [ ] **Overall Result**: Pass / Fail
- [ ] **Issues Found**: _______________________________________

### 4.5 Mobile Safari (iOS)
- [ ] Open app on iPhone/iPad
- [ ] **Verify**: Layout adapts to screen size
- [ ] Tap to start metronome (user gesture required)
- [ ] **Verify**: Audio plays after user interaction
- [ ] Lock screen or switch apps
- [ ] **Expected**: Audio likely stops (iOS limitation)
- [ ] **Overall Result**: Pass / Fail
- [ ] **Issues Found**: _______________________________________

---

## 📋 Test Session 5: Responsive Design

### 5.1 Desktop Viewport (1920x1080)
- [ ] Open app in full screen
- [ ] **Verify**: Layout uses space effectively
- [ ] **Verify**: No unnecessary scrolling
- [ ] **Verify**: Typography is comfortable to read

**Screenshot**: ___ Taken / Not Taken
**Notes**: _______________________________________________________

### 5.2 Tablet Viewport (768x1024)
- [ ] Resize browser to 768px width (or use tablet device)
- [ ] **Verify**: Layout adapts gracefully
- [ ] **Verify**: All controls remain accessible
- [ ] **Verify**: No horizontal scrolling

**Screenshot**: ___ Taken / Not Taken
**Notes**: _______________________________________________________

### 5.3 Mobile Viewport (375x667)
- [ ] Resize browser to 375px width (or use mobile device)
- [ ] **Verify**: Layout switches to single column if needed
- [ ] **Verify**: Beat indicators are visible and tappable
- [ ] **Verify**: BPM controls are easily adjustable
- [ ] **Verify**: No elements are cut off

**Screenshot**: ___ Taken / Not Taken
**Notes**: _______________________________________________________

### 5.4 Orientation Change
- [ ] Use tablet or smartphone in portrait mode
- [ ] Start metronome
- [ ] Rotate to landscape
- [ ] **Verify**: Layout adapts without stopping audio
- [ ] **Verify**: No visual glitches
- [ ] Rotate back to portrait
- [ ] **Verify**: Seamless transition

**Notes**: _______________________________________________________

---

## 📋 Test Session 6: Accessibility

### 6.1 Keyboard Navigation
- [ ] Close mouse cursor (or don't use it)
- [ ] Press Tab repeatedly
- [ ] **Verify**: Focus moves through all interactive elements in logical order:
  1. BPM input/slider
  2. Time signature selector
  3. Beat indicators (if focusable)
  4. Start/Stop button
- [ ] **Verify**: Focus indicator is clearly visible on each element
- [ ] Use arrow keys to adjust BPM slider
- [ ] **Verify**: Slider value changes
- [ ] Press Enter on Start button
- [ ] **Verify**: Metronome starts
- [ ] Press Space (if supported) to stop
- [ ] **Verify**: Metronome stops

**Notes**: _______________________________________________________

### 6.2 Screen Reader Test (VoiceOver/NVDA)
- [ ] Enable screen reader (VoiceOver on Mac: Cmd+F5, NVDA on Windows)
- [ ] Navigate to app
- [ ] **Verify**: Page title is announced clearly
- [ ] Tab to BPM control
- [ ] **Verify**: Announces "BPM input, 120" or similar
- [ ] Tab to Time Signature selector
- [ ] **Verify**: Announces "Time signature, 4/4" or similar
- [ ] Tab to Start button
- [ ] **Verify**: Announces "Start button" or similar
- [ ] Activate Start button
- [ ] **Verify**: State change announced ("Playing" or "Stop button")
- [ ] Tab to beat indicators
- [ ] **Verify**: Each beat's state is announced (Normal/Accent/Mute)

**Notes**: _______________________________________________________

### 6.3 Color Contrast
- [ ] Use browser DevTools or Contrast Checker tool
- [ ] Check text against background
- [ ] **Verify**: Contrast ratio ≥ 4.5:1 for normal text
- [ ] **Verify**: Contrast ratio ≥ 3:1 for large text (18pt+)
- [ ] Check accent indicators
- [ ] **Verify**: Distinguishable without relying solely on color

**Notes**: _______________________________________________________

---

## 📋 Test Session 7: User Experience Flow

### 7.1 First-Time User Scenario
**Goal**: New user wants to practice at 90 BPM in 3/4 time.

- [ ] Open app as a new user
- [ ] **Verify**: Clear visual hierarchy (user knows what to do)
- [ ] Locate BPM control
- [ ] Set to 90 BPM (count interactions: _____)
- [ ] Locate time signature control
- [ ] Set to 3/4 (count interactions: _____)
- [ ] Locate Start button
- [ ] Click Start (count interactions: _____)
- [ ] **Total interactions**: _____ (Target: ≤5)
- [ ] **Verify**: User can accomplish goal without instructions

**User Feedback**: _______________________________________________________

### 7.2 Advanced User Scenario
**Goal**: Practice with accent on beats 1 and 3 in 4/4 at 110 BPM.

- [ ] Set BPM to 110
- [ ] Set time signature to 4/4
- [ ] Configure beat 1 as Accent
- [ ] Configure beat 3 as Accent
- [ ] Start metronome
- [ ] **Verify**: Pattern is as expected
- [ ] **Total time to set up**: _____ seconds (Target: <30 seconds)

**Notes**: _______________________________________________________

---

## 📋 Test Session 8: Edge Cases & Error Handling

### 8.1 Rapid Start/Stop
- [ ] Click Start
- [ ] Immediately click Stop
- [ ] Repeat 10 times rapidly
- [ ] **Verify**: No audio artifacts or glitches
- [ ] **Verify**: UI remains responsive
- [ ] **Verify**: No JavaScript errors in console

**Notes**: _______________________________________________________

### 8.2 Extreme BPM Changes
- [ ] Start metronome at 120 BPM
- [ ] Immediately drag slider to 40 BPM
- [ ] **Verify**: Smooth transition, no audio glitches
- [ ] Immediately drag slider to 240 BPM
- [ ] **Verify**: Metronome can maintain fast tempo
- [ ] **Listen**: No missed beats or audio artifacts

**Notes**: _______________________________________________________

### 8.3 Browser Autoplay Policy (Safari/Chrome)
- [ ] Open app in Safari or Chrome (incognito mode)
- [ ] Click Start WITHOUT any prior interaction
- [ ] **Verify**: Either audio plays OR clear message explains user gesture needed
- [ ] If message shown, interact (click anywhere)
- [ ] **Verify**: Audio plays after interaction

**Notes**: _______________________________________________________

### 8.4 Low Battery / Performance Throttling (Mobile)
- [ ] On mobile device at <20% battery
- [ ] Start metronome at 120 BPM
- [ ] **Verify**: Timing remains accurate despite battery saver mode
- [ ] Let run for 5 minutes
- [ ] **Verify**: No significant drift or audio glitches

**Notes**: _______________________________________________________

---

## 📋 Test Session 9: Performance & Stability

### 9.1 Memory Leak Test
- [ ] Open browser DevTools → Performance/Memory tab
- [ ] Take initial memory snapshot
- [ ] Start metronome
- [ ] Let run for 10 minutes
- [ ] Take second memory snapshot
- [ ] Stop metronome
- [ ] Wait 1 minute
- [ ] Take third memory snapshot
- [ ] **Verify**: Memory returns close to initial level after stopping
- [ ] **Verify**: No continuous memory growth while running

**Initial**: _____ MB
**After 10 min**: _____ MB
**After stopping**: _____ MB
**Pass/Fail**: _________

### 9.2 CPU Usage Test
- [ ] Open Activity Monitor (Mac) or Task Manager (Windows)
- [ ] Start metronome at 120 BPM
- [ ] Monitor browser CPU usage
- [ ] **Verify**: CPU usage <10% on modern hardware
- [ ] **Verify**: No fan spinning up excessively

**CPU Usage**: _____ %
**Pass/Fail**: _________

---

## 📋 Test Session 10: Audio Quality Assessment

### 10.1 Subjective Audio Quality
- [ ] Use good headphones
- [ ] Start metronome at 120 BPM
- [ ] **Listen carefully**:
  - [ ] Normal beat sound is pleasant (not harsh or dull)
  - [ ] Accent sound is clearly distinguishable
  - [ ] No clicks, pops, or artifacts between beats
  - [ ] Volume is consistent across all beats
  - [ ] Sound doesn't distort at maximum device volume

**Audio Quality Rating**: ☆☆☆☆☆ (1-5 stars)
**Notes**: _______________________________________________________

### 10.2 Audio Synchronization
- [ ] Start metronome with visual indicator
- [ ] **Verify**: Visual flash aligns precisely with audio
- [ ] **Verify**: No perceptible delay between visual and audio
- [ ] Test at different BPMs (60, 120, 180)
- [ ] **Verify**: Sync remains tight at all tempos

**Notes**: _______________________________________________________

---

## 🎯 Test Summary

### Overall Results
- **Total Tests Executed**: _____
- **Tests Passed**: _____
- **Tests Failed**: _____
- **Tests Blocked**: _____

### Critical Issues Found
1. _______________________________________________________
2. _______________________________________________________
3. _______________________________________________________

### Minor Issues Found
1. _______________________________________________________
2. _______________________________________________________
3. _______________________________________________________

### Recommendations
1. _______________________________________________________
2. _______________________________________________________
3. _______________________________________________________

### Sign-Off
**Tester Name**: _______________________
**Date**: _______________________
**Overall Assessment**: Ready for Release / Needs Fixes / Major Issues

---

## 📝 Notes for Developers

### Common Issues to Watch For
- **iOS Safari**: Requires user gesture for audio, background playback limited
- **Chrome Autoplay**: May require user interaction on first visit
- **Firefox**: Slightly different Web Audio API timing characteristics
- **Mobile**: Wake lock may be needed to prevent screen sleep

### Testing Tips
- Always test with headphones AND speakers
- Test in quiet environment to catch subtle audio issues
- Use actual devices, not just browser emulation for mobile
- Clear browser cache between test sessions
- Document browser versions tested

---

**End of Manual Testing Checklist**
