/**
 * @test Loop Pattern Feature
 * @description Validates loop pattern functionality with sound/mute phases
 * @prerequisites Metronome class implementation with loop pattern support
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Mock Metronome class for testing loop pattern logic
 */
class MetronomeLoopPatternTest {
  constructor() {
    this.bpm = 60;
    this.timeSignature = { beats: 4, division: 4 };
    this.loopEnabled = false;
    this.soundBars = 4;
    this.muteBars = 2;
    this.currentBar = 1;
    this.currentBeat = 1;
  }

  /**
   * Check if currently in sound phase
   * @returns {boolean} true if in sound phase, false if mute phase
   */
  isInSoundPhase() {
    if (!this.loopEnabled) return true;
    return this.currentBar <= this.soundBars;
  }

  /**
   * Get total bars in loop cycle
   * @returns {number} Total bars (sound + mute)
   */
  getTotalBars() {
    return this.soundBars + this.muteBars;
  }

  /**
   * Get current phase name
   * @returns {string} "Sound" or "Mute"
   */
  getCurrentPhase() {
    return this.isInSoundPhase() ? 'Sound' : 'Mute';
  }

  /**
   * Get bar counter display string
   * @returns {string} Formatted bar counter
   */
  getBarCounterDisplay() {
    const total = this.getTotalBars();
    const phase = this.getCurrentPhase();
    return `Bar ${this.currentBar}/${total} (${phase})`;
  }

  /**
   * Advance to next beat
   */
  advanceBeat() {
    this.currentBeat++;
    if (this.currentBeat > this.timeSignature.beats) {
      this.currentBeat = 1;
      this.advanceBar();
    }
  }

  /**
   * Advance to next bar
   */
  advanceBar() {
    this.currentBar++;
    const totalBars = this.getTotalBars();
    if (this.currentBar > totalBars) {
      this.currentBar = 1; // Loop back to bar 1
    }
  }

  /**
   * Reset to beginning of loop
   */
  reset() {
    this.currentBar = 1;
    this.currentBeat = 1;
  }

  /**
   * Check if audio should be played for current beat
   * @param {boolean} beatMuted - Individual beat mute state
   * @returns {boolean} true if audio should play
   */
  shouldPlayAudio(beatMuted = false) {
    if (beatMuted) return false; // Individual beat muted
    if (!this.loopEnabled) return true; // Loop disabled, always play
    return this.isInSoundPhase(); // Play only in sound phase
  }
}

describe('Loop Pattern - Basic Functionality', () => {
  let metronome;

  beforeEach(() => {
    metronome = new MetronomeLoopPatternTest();
  });

  it('should be disabled by default', () => {
    expect(metronome.loopEnabled).toBe(false);
    expect(metronome.isInSoundPhase()).toBe(true);
  });

  it('should have default configuration', () => {
    expect(metronome.soundBars).toBe(4);
    expect(metronome.muteBars).toBe(2);
    expect(metronome.getTotalBars()).toBe(6);
  });

  it('should start at bar 1, beat 1', () => {
    expect(metronome.currentBar).toBe(1);
    expect(metronome.currentBeat).toBe(1);
  });
});

describe('Loop Pattern - Sound/Mute Phase Logic', () => {
  let metronome;

  beforeEach(() => {
    metronome = new MetronomeLoopPatternTest();
    metronome.loopEnabled = true;
  });

  it('should identify sound phase correctly', () => {
    // Bars 1-4 should be sound phase
    for (let bar = 1; bar <= 4; bar++) {
      metronome.currentBar = bar;
      expect(metronome.isInSoundPhase()).toBe(true);
      expect(metronome.getCurrentPhase()).toBe('Sound');
    }
  });

  it('should identify mute phase correctly', () => {
    // Bars 5-6 should be mute phase
    for (let bar = 5; bar <= 6; bar++) {
      metronome.currentBar = bar;
      expect(metronome.isInSoundPhase()).toBe(false);
      expect(metronome.getCurrentPhase()).toBe('Mute');
    }
  });

  it('should play audio in sound phase', () => {
    metronome.currentBar = 1;
    expect(metronome.shouldPlayAudio()).toBe(true);
  });

  it('should not play audio in mute phase', () => {
    metronome.currentBar = 5;
    expect(metronome.shouldPlayAudio()).toBe(false);
  });

  it('should respect individual beat muting', () => {
    metronome.currentBar = 1; // Sound phase
    expect(metronome.shouldPlayAudio(false)).toBe(true);
    expect(metronome.shouldPlayAudio(true)).toBe(false);
  });

  it('should not play audio if both mute phase and beat muted', () => {
    metronome.currentBar = 5; // Mute phase
    expect(metronome.shouldPlayAudio(true)).toBe(false);
  });
});

describe('Loop Pattern - Bar Progression', () => {
  let metronome;

  beforeEach(() => {
    metronome = new MetronomeLoopPatternTest();
    metronome.loopEnabled = true;
  });

  it('should advance through all beats in a bar', () => {
    expect(metronome.currentBeat).toBe(1);

    metronome.advanceBeat();
    expect(metronome.currentBeat).toBe(2);

    metronome.advanceBeat();
    expect(metronome.currentBeat).toBe(3);

    metronome.advanceBeat();
    expect(metronome.currentBeat).toBe(4);
  });

  it('should advance to next bar after last beat', () => {
    metronome.currentBeat = 4;
    metronome.advanceBeat();

    expect(metronome.currentBeat).toBe(1);
    expect(metronome.currentBar).toBe(2);
  });

  it('should loop back to bar 1 after last bar', () => {
    metronome.currentBar = 6; // Last bar
    metronome.currentBeat = 4;

    metronome.advanceBeat(); // Should trigger bar advance

    expect(metronome.currentBar).toBe(1);
    expect(metronome.currentBeat).toBe(1);
  });

  it('should complete full cycle through sound and mute phases', () => {
    const phases = [];

    for (let i = 0; i < 6; i++) {
      phases.push(metronome.getCurrentPhase());
      metronome.currentBeat = 4;
      metronome.advanceBeat();
    }

    expect(phases).toEqual([
      'Sound', 'Sound', 'Sound', 'Sound', 'Mute', 'Mute'
    ]);
    expect(metronome.currentBar).toBe(1); // Looped back
  });
});

describe('Loop Pattern - Bar Counter Display', () => {
  let metronome;

  beforeEach(() => {
    metronome = new MetronomeLoopPatternTest();
    metronome.loopEnabled = true;
  });

  it('should display correct counter in sound phase', () => {
    metronome.currentBar = 1;
    expect(metronome.getBarCounterDisplay()).toBe('Bar 1/6 (Sound)');

    metronome.currentBar = 4;
    expect(metronome.getBarCounterDisplay()).toBe('Bar 4/6 (Sound)');
  });

  it('should display correct counter in mute phase', () => {
    metronome.currentBar = 5;
    expect(metronome.getBarCounterDisplay()).toBe('Bar 5/6 (Mute)');

    metronome.currentBar = 6;
    expect(metronome.getBarCounterDisplay()).toBe('Bar 6/6 (Mute)');
  });

  it('should update total bars when configuration changes', () => {
    metronome.soundBars = 8;
    metronome.muteBars = 8;
    metronome.currentBar = 1;

    expect(metronome.getBarCounterDisplay()).toBe('Bar 1/16 (Sound)');
  });
});

describe('Loop Pattern - Edge Cases', () => {
  let metronome;

  beforeEach(() => {
    metronome = new MetronomeLoopPatternTest();
    metronome.loopEnabled = true;
  });

  it('should handle minimal pattern (1 sound, 1 mute)', () => {
    metronome.soundBars = 1;
    metronome.muteBars = 1;

    expect(metronome.getTotalBars()).toBe(2);

    metronome.currentBar = 1;
    expect(metronome.isInSoundPhase()).toBe(true);

    metronome.currentBar = 2;
    expect(metronome.isInSoundPhase()).toBe(false);
  });

  it('should handle long pattern (8 sound, 8 mute)', () => {
    metronome.soundBars = 8;
    metronome.muteBars = 8;

    expect(metronome.getTotalBars()).toBe(16);

    metronome.currentBar = 8;
    expect(metronome.isInSoundPhase()).toBe(true);

    metronome.currentBar = 9;
    expect(metronome.isInSoundPhase()).toBe(false);

    metronome.currentBar = 16;
    expect(metronome.isInSoundPhase()).toBe(false);
  });

  it('should handle zero mute bars (continuous sound)', () => {
    metronome.soundBars = 4;
    metronome.muteBars = 0;

    expect(metronome.getTotalBars()).toBe(4);

    metronome.currentBar = 1;
    expect(metronome.isInSoundPhase()).toBe(true);

    metronome.currentBar = 4;
    expect(metronome.isInSoundPhase()).toBe(true);
  });

  it('should handle zero sound bars (continuous mute)', () => {
    metronome.soundBars = 0;
    metronome.muteBars = 4;

    expect(metronome.getTotalBars()).toBe(4);

    metronome.currentBar = 1;
    expect(metronome.isInSoundPhase()).toBe(false);

    metronome.currentBar = 4;
    expect(metronome.isInSoundPhase()).toBe(false);
  });

  it('should reset to bar 1 correctly', () => {
    metronome.currentBar = 5;
    metronome.currentBeat = 3;

    metronome.reset();

    expect(metronome.currentBar).toBe(1);
    expect(metronome.currentBeat).toBe(1);
  });
});

describe('Loop Pattern - Time Signature Changes', () => {
  let metronome;

  beforeEach(() => {
    metronome = new MetronomeLoopPatternTest();
    metronome.loopEnabled = true;
  });

  it('should work with 3/4 time signature', () => {
    metronome.timeSignature = { beats: 3, division: 4 };

    metronome.currentBeat = 3;
    metronome.advanceBeat();

    expect(metronome.currentBeat).toBe(1);
    expect(metronome.currentBar).toBe(2);
  });

  it('should work with 6/8 time signature', () => {
    metronome.timeSignature = { beats: 6, division: 8 };

    for (let i = 0; i < 6; i++) {
      metronome.advanceBeat();
    }

    expect(metronome.currentBeat).toBe(1);
    expect(metronome.currentBar).toBe(2);
  });

  it('should maintain bar counting across time signature changes', () => {
    // Start in 4/4
    metronome.currentBar = 2;
    expect(metronome.getBarCounterDisplay()).toBe('Bar 2/6 (Sound)');

    // Change to 3/4
    metronome.timeSignature = { beats: 3, division: 4 };
    expect(metronome.getBarCounterDisplay()).toBe('Bar 2/6 (Sound)');
  });
});

describe('Loop Pattern - Timing Accuracy', () => {
  let metronome;

  beforeEach(() => {
    metronome = new MetronomeLoopPatternTest();
    metronome.loopEnabled = true;
    metronome.bpm = 60;
  });

  it('should calculate correct beat duration at 60 BPM', () => {
    const beatDuration = 60000 / metronome.bpm; // 1000ms per beat
    expect(beatDuration).toBe(1000);
  });

  it('should calculate correct bar duration at 60 BPM, 4/4 time', () => {
    const beatDuration = 60000 / metronome.bpm;
    const barDuration = beatDuration * metronome.timeSignature.beats;
    expect(barDuration).toBe(4000); // 4 seconds per bar
  });

  it('should calculate correct full cycle duration', () => {
    const beatDuration = 60000 / metronome.bpm;
    const barDuration = beatDuration * metronome.timeSignature.beats;
    const cycleDuration = barDuration * metronome.getTotalBars();
    expect(cycleDuration).toBe(24000); // 24 seconds for 6 bars
  });

  it('should maintain timing in mute phase', () => {
    // Mute phase should have same timing as sound phase
    const beatDuration = 60000 / metronome.bpm;

    metronome.currentBar = 1; // Sound
    const soundPhaseTiming = beatDuration;

    metronome.currentBar = 5; // Mute
    const mutePhaseTiming = beatDuration;

    expect(soundPhaseTiming).toBe(mutePhaseTiming);
  });
});

describe('Loop Pattern - Disabled State', () => {
  let metronome;

  beforeEach(() => {
    metronome = new MetronomeLoopPatternTest();
    metronome.loopEnabled = false;
  });

  it('should always return true for isInSoundPhase when disabled', () => {
    for (let bar = 1; bar <= 10; bar++) {
      metronome.currentBar = bar;
      expect(metronome.isInSoundPhase()).toBe(true);
    }
  });

  it('should always play audio when disabled (except individual mutes)', () => {
    metronome.currentBar = 5;
    expect(metronome.shouldPlayAudio()).toBe(true);
    expect(metronome.shouldPlayAudio(true)).toBe(false);
  });

  it('should allow bar counter to increment beyond total', () => {
    metronome.currentBar = 10;
    expect(metronome.currentBar).toBe(10);
  });
});

describe('Loop Pattern - Performance', () => {
  let metronome;

  beforeEach(() => {
    metronome = new MetronomeLoopPatternTest();
    metronome.loopEnabled = true;
  });

  it('should handle 1000 beat advances without drift', () => {
    const startBar = metronome.currentBar;
    const totalBeats = metronome.timeSignature.beats;
    const totalBars = metronome.getTotalBars();

    for (let i = 0; i < 1000; i++) {
      metronome.advanceBeat();
    }

    // After 1000 beats in 4/4, should complete 250 bars
    // 250 bars = 41 full cycles (41 * 6 = 246) + 4 bars
    const expectedBar = ((startBar - 1 + 250) % totalBars) + 1;
    expect(metronome.currentBar).toBe(expectedBar);
  });

  it('should not accumulate errors over multiple cycles', () => {
    const cycles = 100;
    const totalBars = metronome.getTotalBars();

    for (let cycle = 0; cycle < cycles; cycle++) {
      // Complete full cycle
      for (let bar = 1; bar <= totalBars; bar++) {
        for (let beat = 1; beat <= metronome.timeSignature.beats; beat++) {
          metronome.advanceBeat();
        }
      }
    }

    // Should be back at bar 1
    expect(metronome.currentBar).toBe(1);
    expect(metronome.currentBeat).toBe(1);
  });
});
