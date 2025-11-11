/**
 * Audio Playback Validation Tests
 * Tests continuous audio playback and beat state handling
 *
 * Run with: npm test audio-playback.test.js
 */

describe('Audio Playback - Continuous Operation', () => {
    let metronome;

    beforeEach(() => {
        // Setup fresh metronome instance
        metronome = new Metronome();
        metronome.initAudioContext();
    });

    afterEach(() => {
        if (metronome.isPlaying) {
            metronome.stop();
        }
    });

    // -------------------------------------------------------------------------
    // CRITICAL: Verify audio plays on ALL beats, not just first
    // -------------------------------------------------------------------------
    test('TC-AUDIO-001: Audio plays on ALL beats for 10+ cycles', (done) => {
        const beatTimes = [];
        metronome.setBPM(120); // 500ms per beat
        metronome.setTimeSignature('4/4');

        // Capture beat events
        metronome.setOnBeatCallback((beatIndex, time) => {
            beatTimes.push({ index: beatIndex, time });
        });

        metronome.start();

        // Run for 10 complete measures (40 beats)
        setTimeout(() => {
            metronome.stop();

            // Should have at least 40 beats (10 measures × 4 beats)
            expect(beatTimes.length).toBeGreaterThanOrEqual(40);

            // Verify all beat indices appear (0, 1, 2, 3)
            const indices = new Set(beatTimes.map(b => b.index));
            expect(indices.has(0)).toBe(true);
            expect(indices.has(1)).toBe(true);
            expect(indices.has(2)).toBe(true);
            expect(indices.has(3)).toBe(true);

            // Verify continuous progression (no gaps)
            for (let i = 1; i < beatTimes.length; i++) {
                const prevIndex = beatTimes[i - 1].index;
                const currIndex = beatTimes[i].index;
                const expectedNext = (prevIndex + 1) % 4;
                expect(currIndex).toBe(expectedNext);
            }

            done();
        }, 20500); // 20 seconds = ~40 beats at 120 BPM
    }, 25000);

    // -------------------------------------------------------------------------
    // Test different BPMs
    // -------------------------------------------------------------------------
    test('TC-AUDIO-002: Accurate timing at 60 BPM', (done) => {
        metronome.setBPM(60);
        const beatTimes = [];

        metronome.setOnBeatCallback((beatIndex, time) => {
            beatTimes.push(time);
        });

        metronome.start();

        setTimeout(() => {
            metronome.stop();

            // Calculate intervals
            const intervals = [];
            for (let i = 1; i < beatTimes.length; i++) {
                intervals.push((beatTimes[i] - beatTimes[i - 1]) * 1000);
            }

            // 60 BPM = 1000ms per beat
            intervals.forEach(interval => {
                expect(interval).toBeGreaterThanOrEqual(995);
                expect(interval).toBeLessThanOrEqual(1005);
            });

            done();
        }, 5000);
    }, 10000);

    test('TC-AUDIO-003: Accurate timing at 180 BPM', (done) => {
        metronome.setBPM(180);
        const beatTimes = [];

        metronome.setOnBeatCallback((beatIndex, time) => {
            beatTimes.push(time);
        });

        metronome.start();

        setTimeout(() => {
            metronome.stop();

            const intervals = [];
            for (let i = 1; i < beatTimes.length; i++) {
                intervals.push((beatTimes[i] - beatTimes[i - 1]) * 1000);
            }

            // 180 BPM = 333.33ms per beat
            intervals.forEach(interval => {
                expect(interval).toBeGreaterThanOrEqual(328);
                expect(interval).toBeLessThanOrEqual(338);
            });

            done();
        }, 3000);
    }, 10000);

    // -------------------------------------------------------------------------
    // Test different time signatures
    // -------------------------------------------------------------------------
    test('TC-AUDIO-004: 3/4 time signature cycles correctly', (done) => {
        metronome.setTimeSignature('3/4');
        const beatIndices = [];

        metronome.setOnBeatCallback((beatIndex) => {
            beatIndices.push(beatIndex);
        });

        metronome.start();

        setTimeout(() => {
            metronome.stop();

            // Should cycle 0, 1, 2, 0, 1, 2...
            for (let i = 0; i < beatIndices.length; i++) {
                expect(beatIndices[i]).toBe(i % 3);
            }

            done();
        }, 3000);
    }, 10000);

    test('TC-AUDIO-005: 6/8 time signature cycles correctly', (done) => {
        metronome.setTimeSignature('6/8');
        const beatIndices = [];

        metronome.setOnBeatCallback((beatIndex) => {
            beatIndices.push(beatIndex);
        });

        metronome.start();

        setTimeout(() => {
            metronome.stop();

            // Should cycle 0-5
            for (let i = 0; i < beatIndices.length; i++) {
                expect(beatIndices[i]).toBe(i % 6);
            }

            done();
        }, 3000);
    }, 10000);

    // -------------------------------------------------------------------------
    // Test accent beats are differentiated
    // -------------------------------------------------------------------------
    test('TC-AUDIO-006: Accent beats have higher frequency', () => {
        const normalFreq = 800;
        const accentFreq = 1200;

        // Mock oscillator to capture frequency
        let capturedFrequency = null;
        const originalCreateOscillator = metronome.audioContext.createOscillator;
        metronome.audioContext.createOscillator = function() {
            const osc = originalCreateOscillator.call(this);
            const originalFreqSetter = Object.getOwnPropertyDescriptor(
                Object.getPrototypeOf(osc.frequency), 'value'
            ).set;
            Object.defineProperty(osc.frequency, 'value', {
                set: function(val) {
                    capturedFrequency = val;
                    originalFreqSetter.call(this, val);
                }
            });
            return osc;
        };

        // Play normal beat
        metronome.playBeat(0, false);
        expect(capturedFrequency).toBe(normalFreq);

        // Play accent beat
        metronome.playBeat(0, true);
        expect(capturedFrequency).toBe(accentFreq);
    });

    test('TC-AUDIO-007: Accent beats have higher volume', () => {
        const normalGain = 0.5;
        const accentGain = 0.8;

        // Mock gain node
        let capturedGain = null;
        const originalCreateGain = metronome.audioContext.createGain;
        metronome.audioContext.createGain = function() {
            const gain = originalCreateGain.call(this);
            const originalGainSetter = Object.getOwnPropertyDescriptor(
                Object.getPrototypeOf(gain.gain), 'value'
            ).set;
            Object.defineProperty(gain.gain, 'value', {
                set: function(val) {
                    capturedGain = val;
                    originalGainSetter.call(this, val);
                }
            });
            return gain;
        };

        // Play normal beat
        metronome.playBeat(0, false);
        expect(capturedGain).toBe(normalGain);

        // Play accent beat
        metronome.playBeat(0, true);
        expect(capturedGain).toBe(accentGain);
    });

    // -------------------------------------------------------------------------
    // Test muted beats have no sound
    // -------------------------------------------------------------------------
    test('TC-AUDIO-008: Muted beats do not produce sound', () => {
        let audioPlayed = false;

        // Mock playBeat to detect if called
        const originalPlayBeat = metronome.playBeat;
        metronome.playBeat = function() {
            audioPlayed = true;
            originalPlayBeat.apply(this, arguments);
        };

        // Set beat 1 to mute
        metronome.setBeatState(1, 'mute');

        // Schedule beat 1
        metronome.scheduleBeat(1, metronome.audioContext.currentTime);

        // playBeat should not have been called
        expect(audioPlayed).toBe(false);
    });

    test('TC-AUDIO-009: Muted beats still trigger visual callback', () => {
        let callbackTriggered = false;

        metronome.setOnBeatCallback((beatIndex) => {
            if (beatIndex === 1) {
                callbackTriggered = true;
            }
        });

        metronome.setBeatState(1, 'mute');
        metronome.scheduleBeat(1, metronome.audioContext.currentTime);

        expect(callbackTriggered).toBe(true);
    });

    // -------------------------------------------------------------------------
    // Test stop and restart behavior
    // -------------------------------------------------------------------------
    test('TC-AUDIO-010: Stop and restart resumes correctly', (done) => {
        const beatIndices = [];

        metronome.setOnBeatCallback((beatIndex) => {
            beatIndices.push(beatIndex);
        });

        metronome.setBPM(120);
        metronome.start();

        // Run for 2 seconds
        setTimeout(() => {
            metronome.stop();
            const beatsBeforeStop = beatIndices.length;

            // Wait 1 second
            setTimeout(() => {
                beatIndices.length = 0; // Clear array
                metronome.start();

                // Run for 2 more seconds
                setTimeout(() => {
                    metronome.stop();

                    // Should have beats after restart
                    expect(beatIndices.length).toBeGreaterThan(0);

                    // Should start from beat 0
                    expect(beatIndices[0]).toBe(0);

                    done();
                }, 2000);
            }, 1000);
        }, 2000);
    }, 10000);

    // -------------------------------------------------------------------------
    // Test rapid start/stop
    // -------------------------------------------------------------------------
    test('TC-AUDIO-011: Rapid start/stop does not crash', () => {
        // Rapidly toggle 10 times
        for (let i = 0; i < 10; i++) {
            metronome.start();
            metronome.stop();
        }

        // Should be stopped
        expect(metronome.isPlaying).toBe(false);

        // Should still be functional
        metronome.start();
        expect(metronome.isPlaying).toBe(true);
        metronome.stop();
    });

    // -------------------------------------------------------------------------
    // Test long-running stability
    // -------------------------------------------------------------------------
    test('TC-AUDIO-012: No drift over 30 seconds at 120 BPM', (done) => {
        metronome.setBPM(120);
        const beatTimes = [];

        metronome.setOnBeatCallback((beatIndex, time) => {
            beatTimes.push(time);
        });

        metronome.start();

        setTimeout(() => {
            metronome.stop();

            // Should have ~60 beats (120 BPM × 0.5 minutes)
            expect(beatTimes.length).toBeGreaterThanOrEqual(58);
            expect(beatTimes.length).toBeLessThanOrEqual(62);

            // Calculate expected vs actual duration
            const expectedDuration = (beatTimes.length - 1) * 0.5; // 0.5s per beat
            const actualDuration = beatTimes[beatTimes.length - 1] - beatTimes[0];
            const drift = Math.abs(actualDuration - expectedDuration) * 1000;

            // Total drift should be < 50ms over 30 seconds
            expect(drift).toBeLessThan(50);

            done();
        }, 30000);
    }, 35000);
});

// ============================================================================
// Beat State Management Tests
// ============================================================================

describe('Beat State Management', () => {
    let metronome;

    beforeEach(() => {
        metronome = new Metronome();
        metronome.initAudioContext();
    });

    test('TC-STATE-001: Default state has first beat accented', () => {
        metronome.setTimeSignature('4/4');
        const states = metronome.getBeatStates();

        expect(states[0]).toBe('accent');
        expect(states[1]).toBe('normal');
        expect(states[2]).toBe('normal');
        expect(states[3]).toBe('normal');
    });

    test('TC-STATE-002: Can set custom beat states', () => {
        metronome.setTimeSignature('4/4');

        metronome.setBeatState(0, 'normal');
        metronome.setBeatState(1, 'accent');
        metronome.setBeatState(2, 'mute');

        const states = metronome.getBeatStates();

        expect(states[0]).toBe('normal');
        expect(states[1]).toBe('accent');
        expect(states[2]).toBe('mute');
        expect(states[3]).toBe('normal');
    });

    test('TC-STATE-003: Invalid beat index is ignored', () => {
        metronome.setTimeSignature('4/4');

        metronome.setBeatState(-1, 'accent');
        metronome.setBeatState(10, 'accent');

        const states = metronome.getBeatStates();
        expect(states.length).toBe(4);
    });

    test('TC-STATE-004: Changing time signature resets states', () => {
        metronome.setTimeSignature('4/4');
        metronome.setBeatState(1, 'accent');
        metronome.setBeatState(2, 'mute');

        metronome.setTimeSignature('3/4');

        const states = metronome.getBeatStates();
        expect(states.length).toBe(3);
        expect(states[0]).toBe('accent');
        expect(states[1]).toBe('normal');
        expect(states[2]).toBe('normal');
    });
});

module.exports = { /* export tests if needed */ };
