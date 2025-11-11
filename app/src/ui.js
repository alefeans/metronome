/**
 * UI Controller for Metronome
 * Manages user interactions and visual feedback
 */

class MetronomeUI {
    constructor() {
        this.metronome = new Metronome();

        // DOM Elements
        this.bpmSlider = document.getElementById('bpm-slider');
        this.bpmInput = document.getElementById('bpm-input');
        this.timeSignatureSelect = document.getElementById('time-signature');
        this.soundSelector = document.getElementById('sound-selector');
        this.beatGrid = document.getElementById('beat-grid');
        this.playStopBtn = document.getElementById('play-stop-btn');
        this.loopToggle = document.getElementById('loop-toggle');
        this.soundBarsInput = document.getElementById('sound-bars');
        this.muteBarsInput = document.getElementById('mute-bars');
        this.barCounter = document.getElementById('bar-counter');
        this.themeToggle = document.getElementById('theme-toggle');
        this.sunIcon = document.getElementById('sun-icon');
        this.moonIcon = document.getElementById('moon-icon');

        // State
        this.visualBeatTimeout = null;

        // Initialize
        this.initTheme();
        this.initEventListeners();
        this.renderBeatGrid();
        this.setupBeatCallback();
        this.setupLoopControls();
    }

    /**
     * Initialize theme on page load
     */
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    /**
     * Update theme icon based on current theme
     */
    updateThemeIcon(theme) {
        if (theme === 'dark') {
            this.moonIcon.style.display = 'none';
            this.sunIcon.style.display = 'block';
        } else {
            this.moonIcon.style.display = 'block';
            this.sunIcon.style.display = 'none';
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    /**
     * Initialize all event listeners
     */
    initEventListeners() {
        // Theme Toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        // BPM Controls
        this.bpmSlider.addEventListener('input', (e) => {
            this.updateBPM(parseInt(e.target.value));
        });

        this.bpmInput.addEventListener('input', (e) => {
            this.updateBPM(parseInt(e.target.value));
        });

        // Time Signature
        this.timeSignatureSelect.addEventListener('change', (e) => {
            this.updateTimeSignature(e.target.value);
        });

        // Sound Selector
        this.soundSelector.addEventListener('change', (e) => {
            this.metronome.setSoundType(e.target.value);
        });

        // Play/Stop Button
        this.playStopBtn.addEventListener('click', () => {
            this.togglePlayStop();
        });
    }

    /**
     * Update BPM value
     */
    updateBPM(bpm) {
        if (isNaN(bpm)) return;

        bpm = Math.max(20, Math.min(240, bpm));

        this.bpmSlider.value = bpm;
        this.bpmInput.value = bpm;
        this.metronome.setBPM(bpm);
    }

    /**
     * Update time signature
     */
    updateTimeSignature(timeSignature) {
        this.metronome.setTimeSignature(timeSignature);
        this.renderBeatGrid();
    }

    /**
     * Render beat grid based on time signature
     */
    renderBeatGrid() {
        this.beatGrid.innerHTML = '';
        const beatStates = this.metronome.getBeatStates();

        beatStates.forEach((state, index) => {
            // Create beat container
            const beatBox = document.createElement('div');
            beatBox.className = `beat beat-${state}`;
            beatBox.dataset.beatIndex = index;

            // Create stack container
            const beatStack = document.createElement('div');
            beatStack.className = 'beat-stack';

            // Create 2 vertical bars (displayed bottom to top)
            for (let i = 0; i < 2; i++) {
                const bar = document.createElement('div');
                bar.className = 'beat-bar';
                beatStack.appendChild(bar);
            }

            // Create beat number label
            const beatLabel = document.createElement('div');
            beatLabel.className = 'beat-label';
            beatLabel.textContent = index + 1;

            beatBox.appendChild(beatStack);
            beatBox.appendChild(beatLabel);

            // Click to cycle through states
            beatBox.addEventListener('click', () => {
                this.cycleBeatState(index);
            });

            this.beatGrid.appendChild(beatBox);
        });
    }

    /**
     * Cycle beat state: normal → accent → mute → normal
     */
    cycleBeatState(beatIndex) {
        const currentState = this.metronome.beatStates[beatIndex];
        let newState;

        switch (currentState) {
            case 'normal':
                newState = 'accent';
                break;
            case 'accent':
                newState = 'mute';
                break;
            case 'mute':
                newState = 'normal';
                break;
            default:
                newState = 'normal';
        }

        this.metronome.setBeatState(beatIndex, newState);
        this.updateBeatBox(beatIndex, newState);
    }

    /**
     * Update visual state of a beat box
     */
    updateBeatBox(beatIndex, state) {
        const beatBox = this.beatGrid.querySelector(`[data-beat-index="${beatIndex}"]`);
        if (beatBox) {
            // Update beat class while preserving active state if present
            const isActive = beatBox.classList.contains('active');
            beatBox.className = `beat beat-${state}`;
            if (isActive) {
                beatBox.classList.add('active');
            }
        }
    }

    /**
     * Setup callback for beat events
     */
    setupBeatCallback() {
        this.metronome.setOnBeatCallback((beatIndex, time) => {
            // Calculate when to trigger visual feedback
            const currentTime = this.metronome.audioContext.currentTime;
            const delay = (time - currentTime) * 1000; // Convert to milliseconds

            setTimeout(() => {
                this.visualizeBeat(beatIndex);
            }, Math.max(0, delay));
        });
    }

    /**
     * Visual feedback for active beat
     */
    visualizeBeat(beatIndex) {
        // Remove active class from all beats
        const allBeats = this.beatGrid.querySelectorAll('.beat');
        allBeats.forEach(beat => beat.classList.remove('active'));

        // Add active class to current beat
        const currentBeat = this.beatGrid.querySelector(`[data-beat-index="${beatIndex}"]`);
        if (currentBeat) {
            currentBeat.classList.add('active');

            // Remove active class after animation
            if (this.visualBeatTimeout) {
                clearTimeout(this.visualBeatTimeout);
            }

            this.visualBeatTimeout = setTimeout(() => {
                currentBeat.classList.remove('active');
            }, 150);
        }

        // Update loop display
        this.updateLoopDisplay();
    }

    /**
     * Toggle play/stop state
     */
    togglePlayStop() {
        if (this.metronome.getIsPlaying()) {
            this.stop();
        } else {
            this.play();
        }
    }

    /**
     * Start playback
     */
    play() {
        this.metronome.start();
        this.updatePlayStopButton(true);
    }

    /**
     * Stop playback
     */
    stop() {
        this.metronome.stop();
        this.updatePlayStopButton(false);

        // Clear visual feedback
        const allBeats = this.beatGrid.querySelectorAll('.beat');
        allBeats.forEach(beat => beat.classList.remove('active'));
    }

    /**
     * Update play/stop button appearance
     */
    updatePlayStopButton(isPlaying) {
        const playIcon = this.playStopBtn.querySelector('.play-icon');
        const stopIcon = this.playStopBtn.querySelector('.stop-icon');

        if (isPlaying) {
            playIcon.style.display = 'none';
            stopIcon.style.display = 'inline';
            this.playStopBtn.classList.add('playing');
        } else {
            playIcon.style.display = 'inline';
            stopIcon.style.display = 'none';
            this.playStopBtn.classList.remove('playing');
        }
    }

    /**
     * Setup loop pattern controls
     */
    setupLoopControls() {
        // Loop toggle
        this.loopToggle.addEventListener('change', (e) => {
            this.metronome.setLoopPattern(
                this.metronome.soundBars,
                this.metronome.muteBars,
                e.target.checked
            );
            this.updateLoopDisplay();
        });

        // Sound bars input
        this.soundBarsInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0) {
                this.metronome.setLoopPattern(
                    value,
                    this.metronome.muteBars,
                    this.metronome.loopEnabled
                );
                this.updateLoopDisplay();
            }
        });

        // Mute bars input
        this.muteBarsInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0) {
                this.metronome.setLoopPattern(
                    this.metronome.soundBars,
                    value,
                    this.metronome.loopEnabled
                );
                this.updateLoopDisplay();
            }
        });

        // Initial display
        this.updateLoopDisplay();
    }

    /**
     * Update loop pattern display
     */
    updateLoopDisplay() {
        if (this.metronome.loopEnabled) {
            const totalBars = this.metronome.soundBars + this.metronome.muteBars;
            const barInCycle = (this.metronome.currentBar % totalBars) + 1;
            const phase = this.metronome.isInSoundPhase() ? 'Sound' : 'Mute';
            this.barCounter.textContent = `Bar ${barInCycle}/${totalBars} (${phase})`;
            this.barCounter.style.display = 'block';
        } else {
            // Hide bar counter when loop is disabled
            this.barCounter.style.display = 'none';
        }
    }
}

// Initialize UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.metronomeUI = new MetronomeUI();
});
