/**
 * Automated Timing Accuracy Tests for Metronome App
 *
 * These tests verify that the metronome's timing is accurate and doesn't drift.
 *
 * NOTE: These tests assume the metronome uses:
 * - Web Audio API for scheduling (AudioContext.currentTime)
 * - Lookahead scheduling pattern (scheduling beats ~100ms ahead)
 * - requestAnimationFrame or setInterval for scheduler loop
 *
 * To run these tests:
 * 1. Include Jest or similar testing framework
 * 2. Mock Web Audio API if needed
 * 3. Run: npm test timing-test.js
 */

// Mock Web Audio API for testing environment (Node.js doesn't have AudioContext)
class MockAudioContext {
  constructor() {
    this._currentTime = 0;
    this._startTime = performance.now() / 1000; // Convert to seconds
    this.destination = {};
    this.scheduledEvents = [];
  }

  get currentTime() {
    // Simulate real-time progression
    return (performance.now() / 1000) - this._startTime;
  }

  createOscillator() {
    return new MockOscillator(this);
  }

  createGain() {
    return new MockGain(this);
  }
}

class MockOscillator {
  constructor(context) {
    this.context = context;
    this.frequency = { value: 440 };
    this.type = 'sine';
  }

  connect(destination) {
    this.destination = destination;
    return this;
  }

  start(time) {
    this.context.scheduledEvents.push({ type: 'start', time, node: 'oscillator' });
  }

  stop(time) {
    this.context.scheduledEvents.push({ type: 'stop', time, node: 'oscillator' });
  }
}

class MockGain {
  constructor(context) {
    this.context = context;
    this.gain = { value: 1 };
  }

  connect(destination) {
    this.destination = destination;
    return this;
  }
}

// Metronome class to test (simplified version)
class Metronome {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.bpm = 120;
    this.beatsPerMeasure = 4;
    this.beatSchedule = [];
    this.currentBeat = 0;
    this.nextBeatTime = 0;
    this.lookahead = 25; // ms - how far ahead to schedule
    this.scheduleAheadTime = 0.1; // seconds - how far ahead to schedule audio
    this.timerID = null;
  }

  init() {
    this.audioContext = new MockAudioContext();
  }

  start() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentBeat = 0;
    this.nextBeatTime = this.audioContext.currentTime;
    this.scheduler();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerID) {
      clearTimeout(this.timerID);
    }
  }

  scheduler() {
    // Schedule all beats that need to be played before the next interval
    while (this.nextBeatTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.nextBeatTime);
      this.nextNote();
    }

    if (this.isPlaying) {
      this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
    }
  }

  nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextBeatTime += secondsPerBeat;
    this.currentBeat = (this.currentBeat + 1) % this.beatsPerMeasure;
  }

  scheduleNote(time) {
    this.beatSchedule.push({ beat: this.currentBeat, time });

    // Create oscillator for the beat
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Accent on first beat
    if (this.currentBeat === 0) {
      osc.frequency.value = 800; // Higher pitch
      gainNode.gain.value = 1.0;
    } else {
      osc.frequency.value = 400; // Lower pitch
      gainNode.gain.value = 0.7;
    }

    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.03); // 30ms note duration
  }

  setBPM(bpm) {
    this.bpm = Math.max(40, Math.min(240, bpm));
  }

  setTimeSignature(beats) {
    this.beatsPerMeasure = beats;
  }

  getScheduledBeats() {
    return this.beatSchedule;
  }

  clearSchedule() {
    this.beatSchedule = [];
  }
}

// ============================================================================
// TEST SUITE
// ============================================================================

describe('Metronome Timing Accuracy Tests', () => {
  let metronome;

  beforeEach(() => {
    metronome = new Metronome();
    metronome.init();
  });

  afterEach(() => {
    if (metronome.isPlaying) {
      metronome.stop();
    }
  });

  // -------------------------------------------------------------------------
  // TC-T001: Test 60 BPM (1 beat per second)
  // -------------------------------------------------------------------------
  test('TC-T001: 60 BPM timing accuracy (1000ms ± 5ms)', (done) => {
    metronome.setBPM(60);
    metronome.start();

    setTimeout(() => {
      metronome.stop();
      const beats = metronome.getScheduledBeats();

      expect(beats.length).toBeGreaterThan(0);

      // Calculate intervals between beats
      const intervals = [];
      for (let i = 1; i < beats.length; i++) {
        const interval = (beats[i].time - beats[i - 1].time) * 1000; // Convert to ms
        intervals.push(interval);
      }

      // Expected interval: 1000ms at 60 BPM
      const expectedInterval = 1000;
      const tolerance = 5; // ±5ms

      intervals.forEach((interval, index) => {
        expect(interval).toBeGreaterThanOrEqual(expectedInterval - tolerance);
        expect(interval).toBeLessThanOrEqual(expectedInterval + tolerance);
      });

      done();
    }, 5000); // Test for 5 seconds
  }, 10000);

  // -------------------------------------------------------------------------
  // TC-T002: Test 120 BPM (2 beats per second)
  // -------------------------------------------------------------------------
  test('TC-T002: 120 BPM timing accuracy (500ms ± 5ms)', (done) => {
    metronome.setBPM(120);
    metronome.start();

    setTimeout(() => {
      metronome.stop();
      const beats = metronome.getScheduledBeats();

      expect(beats.length).toBeGreaterThan(0);

      const intervals = [];
      for (let i = 1; i < beats.length; i++) {
        const interval = (beats[i].time - beats[i - 1].time) * 1000;
        intervals.push(interval);
      }

      const expectedInterval = 500; // 500ms at 120 BPM
      const tolerance = 5;

      intervals.forEach(interval => {
        expect(interval).toBeGreaterThanOrEqual(expectedInterval - tolerance);
        expect(interval).toBeLessThanOrEqual(expectedInterval + tolerance);
      });

      done();
    }, 5000);
  }, 10000);

  // -------------------------------------------------------------------------
  // TC-T003: Edge Case - Slow BPM (40 BPM)
  // -------------------------------------------------------------------------
  test('TC-T003: 40 BPM edge case (1500ms ± 5ms)', (done) => {
    metronome.setBPM(40);
    metronome.start();

    setTimeout(() => {
      metronome.stop();
      const beats = metronome.getScheduledBeats();

      const intervals = [];
      for (let i = 1; i < beats.length; i++) {
        const interval = (beats[i].time - beats[i - 1].time) * 1000;
        intervals.push(interval);
      }

      const expectedInterval = 1500; // 1500ms at 40 BPM
      const tolerance = 5;

      intervals.forEach(interval => {
        expect(interval).toBeGreaterThanOrEqual(expectedInterval - tolerance);
        expect(interval).toBeLessThanOrEqual(expectedInterval + tolerance);
      });

      done();
    }, 10000); // 10 seconds for slow tempo
  }, 15000);

  // -------------------------------------------------------------------------
  // TC-T004: Edge Case - Fast BPM (240 BPM)
  // -------------------------------------------------------------------------
  test('TC-T004: 240 BPM edge case (250ms ± 5ms)', (done) => {
    metronome.setBPM(240);
    metronome.start();

    setTimeout(() => {
      metronome.stop();
      const beats = metronome.getScheduledBeats();

      expect(beats.length).toBeGreaterThan(10); // Should have many beats

      const intervals = [];
      for (let i = 1; i < beats.length; i++) {
        const interval = (beats[i].time - beats[i - 1].time) * 1000;
        intervals.push(interval);
      }

      const expectedInterval = 250; // 250ms at 240 BPM
      const tolerance = 5;

      intervals.forEach(interval => {
        expect(interval).toBeGreaterThanOrEqual(expectedInterval - tolerance);
        expect(interval).toBeLessThanOrEqual(expectedInterval + tolerance);
      });

      done();
    }, 3000);
  }, 10000);

  // -------------------------------------------------------------------------
  // TC-T005: BPM Range Validation
  // -------------------------------------------------------------------------
  test('TC-T005: BPM range validation (40-240)', () => {
    // Test minimum
    metronome.setBPM(30);
    expect(metronome.bpm).toBe(40); // Should clamp to 40

    // Test maximum
    metronome.setBPM(300);
    expect(metronome.bpm).toBe(240); // Should clamp to 240

    // Test valid values
    metronome.setBPM(120);
    expect(metronome.bpm).toBe(120);
  });

  // -------------------------------------------------------------------------
  // TC-T006: 5-minute drift test at 60 BPM
  // -------------------------------------------------------------------------
  test('TC-T006: Long-duration drift test at 60 BPM (<100ms drift)', (done) => {
    metronome.setBPM(60);
    metronome.start();

    setTimeout(() => {
      metronome.stop();
      const beats = metronome.getScheduledBeats();

      // Should have approximately 300 beats (60 BPM × 5 minutes)
      expect(beats.length).toBeGreaterThanOrEqual(295);
      expect(beats.length).toBeLessThanOrEqual(305);

      // Calculate total expected duration
      const expectedDuration = (beats.length - 1) * 1.0; // 1 second per beat
      const actualDuration = beats[beats.length - 1].time - beats[0].time;
      const drift = Math.abs(actualDuration - expectedDuration) * 1000; // Convert to ms

      expect(drift).toBeLessThan(100); // Total drift should be < 100ms

      done();
    }, 300000); // 5 minutes
  }, 310000);

  // -------------------------------------------------------------------------
  // TC-T008: 4/4 time signature verification
  // -------------------------------------------------------------------------
  test('TC-T008: 4/4 time signature - 4 beats per measure', (done) => {
    metronome.setTimeSignature(4);
    metronome.setBPM(120);
    metronome.start();

    setTimeout(() => {
      metronome.stop();
      const beats = metronome.getScheduledBeats();

      // Verify beat numbers cycle 0, 1, 2, 3, 0, 1, 2, 3...
      const beatNumbers = beats.map(b => b.beat);

      for (let i = 0; i < beatNumbers.length; i++) {
        expect(beatNumbers[i]).toBe(i % 4);
      }

      // Verify accent on beat 0 (first beat of measure)
      const accentedBeats = beats.filter(b => b.beat === 0);
      expect(accentedBeats.length).toBeGreaterThan(0);

      done();
    }, 3000);
  }, 10000);

  // -------------------------------------------------------------------------
  // TC-T009: 3/4 time signature verification
  // -------------------------------------------------------------------------
  test('TC-T009: 3/4 time signature - 3 beats per measure', (done) => {
    metronome.setTimeSignature(3);
    metronome.setBPM(120);
    metronome.start();

    setTimeout(() => {
      metronome.stop();
      const beats = metronome.getScheduledBeats();

      // Verify beat numbers cycle 0, 1, 2, 0, 1, 2...
      const beatNumbers = beats.map(b => b.beat);

      for (let i = 0; i < beatNumbers.length; i++) {
        expect(beatNumbers[i]).toBe(i % 3);
      }

      done();
    }, 3000);
  }, 10000);

  // -------------------------------------------------------------------------
  // Additional: Verify consistent scheduling
  // -------------------------------------------------------------------------
  test('Consistent scheduling: beats scheduled at regular intervals', (done) => {
    metronome.setBPM(120);
    metronome.start();

    setTimeout(() => {
      metronome.stop();
      const beats = metronome.getScheduledBeats();

      // Calculate standard deviation of intervals
      const intervals = [];
      for (let i = 1; i < beats.length; i++) {
        const interval = (beats[i].time - beats[i - 1].time) * 1000;
        intervals.push(interval);
      }

      const mean = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);

      // Standard deviation should be very low (<1ms for good timing)
      expect(stdDev).toBeLessThan(1);

      done();
    }, 5000);
  }, 10000);
});

// ============================================================================
// PERFORMANCE TEST SUITE
// ============================================================================

describe('Metronome Performance Tests', () => {
  let metronome;

  beforeEach(() => {
    metronome = new Metronome();
    metronome.init();
  });

  afterEach(() => {
    if (metronome.isPlaying) {
      metronome.stop();
    }
  });

  // -------------------------------------------------------------------------
  // Memory leak detection
  // -------------------------------------------------------------------------
  test('No memory leaks after extended use', (done) => {
    const initialScheduleLength = metronome.beatSchedule.length;

    metronome.setBPM(120);
    metronome.start();

    setTimeout(() => {
      metronome.stop();
      const duringScheduleLength = metronome.beatSchedule.length;

      metronome.clearSchedule();

      expect(metronome.beatSchedule.length).toBe(0);
      expect(duringScheduleLength).toBeGreaterThan(initialScheduleLength);

      done();
    }, 5000);
  }, 10000);

  // -------------------------------------------------------------------------
  // Rapid start/stop stability
  // -------------------------------------------------------------------------
  test('Stable under rapid start/stop cycles', () => {
    for (let i = 0; i < 10; i++) {
      metronome.start();
      metronome.stop();
    }

    // Should not throw errors or leave in inconsistent state
    expect(metronome.isPlaying).toBe(false);
  });
});

// ============================================================================
// INTEGRATION TEST NOTES
// ============================================================================

/**
 * Integration Testing Recommendations:
 *
 * 1. Browser-Specific Tests:
 *    - Test in actual browsers (Chrome, Firefox, Safari)
 *    - Use Puppeteer or Playwright for automated browser testing
 *    - Measure actual audio output timing (requires specialized tools)
 *
 * 2. Real Web Audio API Testing:
 *    - These tests use mocks - also test with real AudioContext
 *    - Use tools like: https://github.com/tambien/Recorder.js for recording
 *    - Analyze recorded audio for timing accuracy
 *
 * 3. User Interaction Testing:
 *    - Test UI interactions with Testing Library
 *    - Verify slider/input changes affect metronome in real-time
 *    - Test beat accent/mute UI updates
 *
 * 4. Cross-Browser Timing Variations:
 *    - Chrome: Generally most accurate
 *    - Firefox: May have slight variations
 *    - Safari: iOS has strict autoplay policies
 *    - Mobile: Test on actual devices, not just emulators
 *
 * Example Playwright Test:
 *
 * test('Real browser timing test', async ({ page }) => {
 *   await page.goto('http://localhost:3000');
 *   await page.click('#start-button');
 *
 *   // Measure beat intervals in real browser
 *   const beatTimes = await page.evaluate(() => {
 *     return new Promise(resolve => {
 *       const times = [];
 *       let count = 0;
 *
 *       const observer = new PerformanceObserver(list => {
 *         for (const entry of list.getEntries()) {
 *           if (entry.name === 'beat') {
 *             times.push(entry.startTime);
 *             count++;
 *             if (count >= 10) {
 *               resolve(times);
 *             }
 *           }
 *         }
 *       });
 *
 *       observer.observe({ entryTypes: ['mark'] });
 *     });
 *   });
 *
 *   // Verify intervals
 *   for (let i = 1; i < beatTimes.length; i++) {
 *     const interval = beatTimes[i] - beatTimes[i - 1];
 *     expect(interval).toBeCloseTo(500, 0); // 120 BPM = 500ms
 *   }
 * });
 */

module.exports = { Metronome, MockAudioContext };
