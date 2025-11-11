# Metronome Web App - Comprehensive Test Strategy

## Project Overview
Minimalist metronome web application with:
- BPM (Beats Per Minute) control
- Time signature selection
- Per-beat accent/mute configuration
- Clean, aesthetic UI

---

## 1. Timing Accuracy Tests

### 1.1 BPM Precision Testing
**Objective**: Verify that actual beat intervals match expected intervals with high precision.

#### Test Cases:
- **TC-T001**: Test 60 BPM (1 beat per second)
  - Expected: 1000ms ± 5ms between beats
  - Method: Measure actual intervals using performance.now()
  - Pass Criteria: 95% of beats within tolerance

- **TC-T002**: Test 120 BPM (2 beats per second)
  - Expected: 500ms ± 5ms between beats
  - Pass Criteria: 95% of beats within tolerance

- **TC-T003**: Edge Case - Slow BPM (40 BPM)
  - Expected: 1500ms ± 5ms between beats
  - Verify no drift over 60 seconds (40 beats)

- **TC-T004**: Edge Case - Fast BPM (240 BPM)
  - Expected: 250ms ± 5ms between beats
  - Verify scheduler can maintain precision at high rates

- **TC-T005**: BPM Range Validation
  - Test minimum: 40 BPM
  - Test maximum: 240 BPM
  - Verify UI prevents out-of-range values

### 1.2 Long-Duration Drift Testing
**Objective**: Ensure timing doesn't drift over extended periods.

- **TC-T006**: 5-minute drift test at 60 BPM
  - Run for 300 beats
  - Measure cumulative drift
  - Pass Criteria: Total drift < 100ms

- **TC-T007**: 5-minute drift test at 120 BPM
  - Run for 600 beats
  - Pass Criteria: Total drift < 100ms

### 1.3 Time Signature Accuracy
**Objective**: Verify correct beat patterns for different time signatures.

- **TC-T008**: 4/4 time signature
  - Verify 4 beats per measure
  - Verify accent on beat 1

- **TC-T009**: 3/4 time signature
  - Verify 3 beats per measure
  - Verify accent on beat 1

- **TC-T010**: 6/8 time signature
  - Verify 6 beats per measure
  - Verify accent pattern (typically beats 1 and 4)

- **TC-T011**: Time signature changes while running
  - Change from 4/4 to 3/4 mid-playback
  - Verify immediate adaptation without timing disruption

---

## 2. Audio Functionality Tests

### 2.1 Sound Generation
**Objective**: Verify Web Audio API integration and sound quality.

- **TC-A001**: Audio Context Initialization
  - Verify AudioContext creates successfully
  - Handle browser autoplay policies
  - Test user gesture requirement

- **TC-A002**: Normal Beat Sound
  - Verify sound plays on normal beats
  - Verify consistent volume
  - Verify no clipping/distortion

- **TC-A003**: Accent Beat Sound
  - Verify accent sounds differ from normal (higher pitch/volume)
  - Verify perceptibly distinct from normal beats
  - Test frequency difference (suggest 800Hz vs 400Hz)

- **TC-A004**: Muted Beat Behavior
  - Verify NO sound on muted beats
  - Verify visual indicator still shows beat
  - Verify timing maintains despite mute

### 2.2 Audio Performance
- **TC-A005**: Audio Scheduling Precision
  - Verify use of AudioContext.currentTime for scheduling
  - Test lookahead scheduling (schedule beats ~100ms ahead)
  - Verify no audio glitches at beat boundaries

- **TC-A006**: Multiple Rapid Clicks (Start/Stop)
  - Start/stop rapidly 10 times
  - Verify no audio artifacts
  - Verify no memory leaks in audio nodes

---

## 3. UI Interaction Tests

### 3.1 BPM Control
**Objective**: Test BPM input mechanisms and validation.

- **TC-U001**: BPM Slider Interaction
  - Drag slider to various positions
  - Verify BPM value updates in real-time
  - Verify metronome tempo changes if running

- **TC-U002**: BPM Numeric Input
  - Type valid BPM values (60, 120, 180)
  - Type invalid values (0, 300, "abc")
  - Verify validation and error messaging

- **TC-U003**: BPM Input Synchronization
  - Change slider → verify input field updates
  - Change input field → verify slider updates
  - Verify bidirectional sync

### 3.2 Time Signature Selection
- **TC-U004**: Time Signature Dropdown
  - Select each available time signature
  - Verify beat grid updates to show correct beat count
  - Verify running metronome adapts immediately

### 3.3 Beat Configuration
**Objective**: Test per-beat accent/mute controls.

- **TC-U005**: Beat Accent Toggle
  - Click beat 1 → should cycle: normal → accent → mute → normal
  - Verify visual state change (color/icon)
  - Verify audio reflects change immediately if running

- **TC-U006**: Multiple Beat Configurations
  - Create pattern: Accent, Normal, Mute, Normal
  - Start metronome
  - Verify audio pattern matches visual configuration

- **TC-U007**: Configuration Persistence During Time Signature Change
  - Configure accents in 4/4
  - Change to 3/4
  - Verify first 3 beats retain configuration

### 3.4 Start/Stop Controls
- **TC-U008**: Start Button
  - Click start with valid configuration
  - Verify metronome begins immediately
  - Verify button changes to "Stop"

- **TC-U009**: Stop Button
  - Click stop while running
  - Verify immediate silence
  - Verify no residual audio nodes

- **TC-U010**: Keyboard Shortcuts (if implemented)
  - Space bar to start/stop
  - Arrow keys for BPM adjustment

### 3.5 Visual Beat Indicator
**Objective**: Test visual synchronization with audio.

- **TC-U011**: Beat Indicator Synchronization
  - Start metronome
  - Verify visual indicator flashes in sync with audio
  - Measure visual-to-audio latency (<50ms acceptable)

- **TC-U012**: Visual Indicator During Muted Beats
  - Configure beat 2 as muted
  - Verify indicator still shows beat 2 visually
  - Verify no audio on beat 2

---

## 4. Cross-Browser Compatibility Tests

### 4.1 Desktop Browsers
**Objective**: Ensure consistent behavior across major browsers.

- **TC-B001**: Chrome/Edge (Chromium)
  - Test all core functionality
  - Verify Web Audio API support
  - Expected: Full support

- **TC-B002**: Firefox
  - Test all core functionality
  - Verify Web Audio API implementation differences
  - Expected: Full support, may have timing differences

- **TC-B003**: Safari
  - Test AudioContext autoplay restrictions
  - Verify user gesture handling
  - Test on macOS Safari

### 4.2 Mobile Browsers
- **TC-B004**: Mobile Chrome (Android)
  - Test touch interactions
  - Verify audio works with screen lock
  - Test wake lock (if implemented)

- **TC-B005**: Mobile Safari (iOS)
  - Test strict autoplay policies
  - Verify audio in background (likely limitation)
  - Test on iPhone and iPad

### 4.3 Web Audio API Support Verification
- **TC-B006**: Feature Detection
  - Detect AudioContext support
  - Display graceful error if unsupported
  - Suggest modern browser

---

## 5. Responsive Design Tests

### 5.1 Screen Sizes
**Objective**: Verify UI adapts to different viewports.

- **TC-R001**: Desktop (1920x1080)
  - Verify comfortable spacing
  - Verify readable typography

- **TC-R002**: Tablet (768x1024)
  - Verify layout adaptation
  - Verify touch targets ≥44x44px

- **TC-R003**: Mobile (375x667)
  - Verify single-column layout
  - Verify controls remain accessible

### 5.2 Orientation Changes
- **TC-R004**: Portrait to Landscape
  - Rotate device during playback
  - Verify layout adapts without stopping metronome
  - Verify no audio glitches

---

## 6. Performance Tests

### 6.1 Resource Usage
- **TC-P001**: CPU Usage
  - Run metronome for 10 minutes at 120 BPM
  - Monitor CPU usage (should be <5% on modern hardware)

- **TC-P002**: Memory Usage
  - Run for 30 minutes
  - Verify no memory leaks
  - Check DevTools memory profiler

### 6.2 Battery Impact (Mobile)
- **TC-P003**: Battery Drain Test
  - Run for 1 hour on mobile device
  - Measure battery consumption
  - Compare with/without wake lock

---

## 7. Accessibility Tests

### 7.1 Keyboard Navigation
- **TC-A001**: Tab Navigation
  - Tab through all controls
  - Verify logical focus order
  - Verify visible focus indicators

### 7.2 Screen Reader Support
- **TC-A002**: ARIA Labels
  - Test with NVDA/JAWS (Windows) or VoiceOver (Mac/iOS)
  - Verify all controls have meaningful labels
  - Verify state changes are announced

### 7.3 Color Contrast
- **TC-A003**: WCAG Compliance
  - Verify text has ≥4.5:1 contrast ratio
  - Verify accent indicators have ≥3:1 contrast

---

## 8. Error Handling & Edge Cases

### 8.1 Audio Context Errors
- **TC-E001**: AudioContext Creation Failure
  - Simulate failure (browser without Web Audio)
  - Verify user-friendly error message
  - Verify graceful degradation

### 8.2 Input Validation
- **TC-E002**: Invalid BPM Input
  - Enter negative numbers
  - Enter non-numeric characters
  - Enter extreme values (999999)
  - Verify sanitization and error messages

### 8.3 State Management
- **TC-E003**: Rapid State Changes
  - Start/stop/change BPM rapidly
  - Verify no race conditions
  - Verify state consistency

---

## 9. Security Tests

### 9.1 XSS Prevention
- **TC-S001**: Input Sanitization
  - Attempt to inject `<script>` tags in BPM input
  - Verify proper escaping
  - Test if using innerHTML vs textContent

---

## 10. User Experience Tests

### 10.1 First-Time User Flow
- **TC-UX001**: Initial Load
  - Default BPM should be sensible (120 BPM recommended)
  - Default time signature: 4/4
  - Clear visual hierarchy

### 10.2 Workflow Efficiency
- **TC-UX002**: Common Task: "Set to 90 BPM and start"
  - Measure steps required
  - Target: ≤3 interactions

---

## Test Automation Strategy

### Automated Tests (Recommended Framework: Jest + Testing Library)
1. **Unit Tests**:
   - BPM validation logic
   - Time signature calculations
   - Beat pattern generation

2. **Integration Tests**:
   - Audio scheduling logic (mock Web Audio API)
   - UI state synchronization
   - Event handler coordination

3. **E2E Tests** (Playwright/Cypress):
   - Full user workflows
   - Cross-browser smoke tests
   - Visual regression tests

### Manual Tests
- Audio quality assessment (subjective)
- Cross-device testing
- Accessibility with assistive technologies
- Real-world usage scenarios

---

## Test Environment Setup

### Required Tools
- **Jest**: Unit/integration testing
- **Testing Library**: UI component testing
- **Playwright**: Cross-browser E2E testing
- **Chrome DevTools**: Performance profiling
- **Lighthouse**: Accessibility & performance audits

### Test Data
- BPM values: 40, 60, 90, 120, 150, 180, 240
- Time signatures: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8
- Beat patterns: Various accent/mute combinations

---

## Success Criteria

### Critical (Must Pass)
✅ Timing accuracy within ±5ms at all common BPMs (60-180)
✅ No audio glitches or clicks
✅ Accent sounds clearly distinguishable
✅ Muted beats produce no sound
✅ Works in Chrome, Firefox, Safari (latest versions)
✅ Responsive on mobile devices

### Important (Should Pass)
✅ Timing drift <100ms over 5 minutes
✅ Works on iOS Safari with autoplay policy
✅ Keyboard navigation fully functional
✅ WCAG 2.1 AA compliance

### Nice-to-Have
✅ Battery-efficient on mobile
✅ Works offline (PWA)
✅ Screen reader optimized

---

## Risk Areas & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Web Audio API browser inconsistencies | High | Medium | Extensive cross-browser testing, polyfills |
| Timing drift on low-power devices | Medium | Medium | Use requestAnimationFrame + lookahead scheduling |
| iOS autoplay restrictions | High | High | Require user gesture, clear messaging |
| Memory leaks from audio nodes | Medium | Low | Proper cleanup on stop, automated leak detection |

---

## Test Schedule Recommendation

1. **Phase 1 - Core Functionality** (Week 1)
   - Timing accuracy tests
   - Audio functionality tests
   - Basic UI interaction tests

2. **Phase 2 - Cross-Browser** (Week 2)
   - Desktop browser testing
   - Mobile browser testing
   - Responsive design validation

3. **Phase 3 - Quality & Performance** (Week 3)
   - Long-duration stability tests
   - Performance profiling
   - Accessibility audit

4. **Phase 4 - User Acceptance** (Week 4)
   - Real-world usage testing
   - User feedback incorporation
   - Final regression suite

---

## Reporting

### Test Report Format
- **Summary**: Pass/Fail counts, coverage %
- **Critical Failures**: High-priority issues blocking release
- **Browser Compatibility Matrix**: Visual grid of test results per browser
- **Performance Metrics**: Timing accuracy graphs, CPU/memory usage
- **Accessibility Score**: WCAG compliance checklist

### Continuous Testing
- Run automated tests on every commit (CI/CD)
- Daily cross-browser smoke tests
- Weekly full regression suite
- Monthly accessibility audit

---

## Conclusion

This comprehensive test strategy ensures the metronome app delivers:
- **Precision**: Accurate timing for musical practice
- **Reliability**: Consistent behavior across platforms
- **Usability**: Intuitive interface with minimal learning curve
- **Accessibility**: Usable by diverse audiences

**Next Steps**: Implement automated test suite alongside development (TDD approach recommended).
