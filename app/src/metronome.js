/**
 * Metronome Core Engine
 * Uses Web Audio API for precise timing
 */

class Metronome {
    constructor() {
        // Audio Context
        this.audioContext = null;
        this.nextBeatTime = 0;
        this.isPlaying = false;
        this.currentBeatIndex = 0;

        // Timing Configuration
        this.bpm = 120;
        this.beatsPerMeasure = 4;
        this.noteValue = 4; // quarter note
        this.lookAhead = 25; // milliseconds to schedule ahead
        this.scheduleAheadTime = 0.1; // seconds to schedule audio

        // Beat States: 'normal', 'accent', 'mute'
        this.beatStates = [];
        this.initializeBeatStates();

        // Loop pattern configuration
        this.loopEnabled = false;
        this.soundBars = 4;
        this.muteBars = 2;
        this.currentBar = 0;  // Current bar in the pattern (0-indexed)

        // Sound type configuration
        this.soundType = 'classic'; // default sound

        // Scheduling
        this.timerID = null;

        // Callbacks
        this.onBeatCallback = null;
    }

    /**
     * Initialize Web Audio Context
     */
    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    /**
     * Initialize beat states array based on time signature
     */
    initializeBeatStates() {
        this.beatStates = Array(this.beatsPerMeasure).fill('normal');
        // First beat is typically accented by default
        this.beatStates[0] = 'accent';
    }

    /**
     * Set BPM (Beats Per Minute)
     */
    setBPM(bpm) {
        this.bpm = Math.max(20, Math.min(240, bpm));
    }

    /**
     * Set Time Signature
     */
    setTimeSignature(timeSignature) {
        const [beats, noteValue] = timeSignature.split('/').map(Number);
        this.beatsPerMeasure = beats;
        this.noteValue = noteValue;
        this.initializeBeatStates();
        this.currentBeatIndex = 0;
    }

    /**
     * Get beat states
     */
    getBeatStates() {
        return this.beatStates;
    }

    /**
     * Set state for a specific beat
     */
    setBeatState(beatIndex, state) {
        if (beatIndex >= 0 && beatIndex < this.beatStates.length) {
            this.beatStates[beatIndex] = state;
        }
    }

    /**
     * Calculate beat interval in seconds
     */
    getBeatInterval() {
        return 60.0 / this.bpm;
    }

    /**
     * Set sound type
     */
    setSoundType(soundType) {
        this.soundType = soundType;
    }

    /**
     * Get sound type
     */
    getSoundType() {
        return this.soundType;
    }

    /**
     * Generate click sound for a beat
     */
    playBeat(time, isAccent) {
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Configure sound based on type
            switch (this.soundType) {
                case 'classic':
                    oscillator.type = 'sine';
                    oscillator.frequency.value = isAccent ? 1200 : 800;
                    gainNode.gain.setValueAtTime(isAccent ? 0.8 : 0.5, time);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
                    oscillator.start(time);
                    oscillator.stop(time + 0.05);
                    break;

                case 'woodblock':
                    oscillator.type = 'square';
                    oscillator.frequency.value = isAccent ? 1500 : 1000;
                    gainNode.gain.setValueAtTime(isAccent ? 0.6 : 0.4, time);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
                    oscillator.start(time);
                    oscillator.stop(time + 0.02);
                    break;

                case 'digital':
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.value = isAccent ? 900 : 600;
                    gainNode.gain.setValueAtTime(isAccent ? 0.7 : 0.4, time);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
                    oscillator.start(time);
                    oscillator.stop(time + 0.03);
                    break;

                case 'soft':
                    oscillator.type = 'sine';
                    oscillator.frequency.value = isAccent ? 660 : 440;
                    gainNode.gain.setValueAtTime(isAccent ? 0.5 : 0.3, time);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
                    oscillator.start(time);
                    oscillator.stop(time + 0.1);
                    break;

                case 'stick':
                    oscillator.type = 'triangle';
                    oscillator.frequency.value = isAccent ? 1200 : 800;
                    gainNode.gain.setValueAtTime(isAccent ? 0.6 : 0.4, time);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.015);
                    oscillator.start(time);
                    oscillator.stop(time + 0.015);
                    break;

                default:
                    // Fallback to classic
                    oscillator.type = 'sine';
                    oscillator.frequency.value = isAccent ? 1200 : 800;
                    gainNode.gain.setValueAtTime(isAccent ? 0.8 : 0.5, time);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
                    oscillator.start(time);
                    oscillator.stop(time + 0.05);
            }
        } catch (error) {
            console.error('Error playing beat:', error);
        }
    }

    /**
     * Schedule beats using Web Audio API timing
     */
    scheduler() {
        if (!this.isPlaying) return;

        // Schedule all beats that need to play before next interval
        while (this.nextBeatTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleBeat(this.currentBeatIndex, this.nextBeatTime);
            this.nextBeat();
        }
    }

    /**
     * Schedule a single beat
     */
    scheduleBeat(beatIndex, time) {
        const beatState = this.beatStates[beatIndex];

        // Calculate delay for visual callback (convert audio time to setTimeout delay)
        const currentTime = this.audioContext.currentTime;
        const delay = Math.max(0, (time - currentTime) * 1000);

        // Check if we're in muted phase of loop pattern
        const inMutePhase = this.loopEnabled && !this.isInSoundPhase();

        // Don't play if in mute phase OR beat is individually muted
        if (beatState === 'mute' || inMutePhase) {
            // Still trigger visual callback at the right time
            if (this.onBeatCallback) {
                setTimeout(() => {
                    this.onBeatCallback(beatIndex, time);
                }, delay);
            }
            return;
        }

        // Play sound based on state
        const isAccent = beatState === 'accent';
        this.playBeat(time, isAccent);

        // Trigger visual callback at the right time
        if (this.onBeatCallback) {
            setTimeout(() => {
                this.onBeatCallback(beatIndex, time);
            }, delay);
        }
    }

    /**
     * Advance to next beat
     */
    nextBeat() {
        const secondsPerBeat = this.getBeatInterval();
        this.nextBeatTime += secondsPerBeat;

        const previousBeatIndex = this.currentBeatIndex;
        this.currentBeatIndex++;
        if (this.currentBeatIndex >= this.beatsPerMeasure) {
            this.currentBeatIndex = 0;
            // Only advance bar counter when loop pattern is enabled
            if (this.loopEnabled) {
                this.advanceBar();
            }
        }
    }

    /**
     * Start the metronome
     */
    async start() {
        if (this.isPlaying) return;

        this.initAudioContext();

        // Resume audio context if suspended (important for browser autoplay policies)
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        // Reset timing - schedule first beat slightly in the future to avoid timing issues
        this.isPlaying = true;
        this.currentBeatIndex = 0;
        this.currentBar = 0; // Reset bar counter on start
        this.nextBeatTime = this.audioContext.currentTime + 0.005; // 5ms in the future

        // Start scheduler
        this.scheduler();
        this.timerID = setInterval(() => this.scheduler(), this.lookAhead);
    }

    /**
     * Stop the metronome
     */
    stop() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        clearInterval(this.timerID);
        this.currentBeatIndex = 0;
    }

    /**
     * Check if metronome is playing
     */
    getIsPlaying() {
        return this.isPlaying;
    }

    /**
     * Get current beat index
     */
    getCurrentBeatIndex() {
        return this.currentBeatIndex;
    }

    /**
     * Set callback for beat events
     */
    setOnBeatCallback(callback) {
        this.onBeatCallback = callback;
    }

    /**
     * Configure loop pattern (N bars sound, M bars mute)
     */
    setLoopPattern(soundBars, muteBars, enabled) {
        this.soundBars = soundBars;
        this.muteBars = muteBars;
        this.loopEnabled = enabled;
        // Reset bar counter when changing loop settings
        this.currentBar = 0;
    }

    /**
     * Check if currently in sound phase of loop pattern
     */
    isInSoundPhase() {
        if (!this.loopEnabled) return true;
        const totalBars = this.soundBars + this.muteBars;
        const barInCycle = this.currentBar % totalBars;
        return barInCycle < this.soundBars;
    }

    /**
     * Advance to next bar (called on beat 1)
     */
    advanceBar() {
        this.currentBar++;
    }

    /**
     * Get current bar number
     */
    getCurrentBar() {
        return this.currentBar;
    }
}

// Export for use in UI
window.Metronome = Metronome;
