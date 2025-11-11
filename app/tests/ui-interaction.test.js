/**
 * UI Interaction Tests
 * Tests user interface interactions and visual feedback
 *
 * Requires: jsdom or browser environment
 * Run with: npm test ui-interaction.test.js
 */

// Setup DOM environment for testing
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('UI Interaction Tests', () => {
    let dom;
    let document;
    let window;
    let metronomeUI;

    beforeEach(() => {
        // Load HTML
        const html = fs.readFileSync(
            path.join(__dirname, '../src/index.html'),
            'utf8'
        );

        // Create DOM
        dom = new JSDOM(html, {
            runScripts: 'dangerously',
            resources: 'usable'
        });

        document = dom.window.document;
        window = dom.window;

        // Load scripts
        const metronomeJS = fs.readFileSync(
            path.join(__dirname, '../src/metronome.js'),
            'utf8'
        );
        const uiJS = fs.readFileSync(
            path.join(__dirname, '../src/ui.js'),
            'utf8'
        );

        // Execute scripts in DOM context
        const script1 = document.createElement('script');
        script1.textContent = metronomeJS;
        document.body.appendChild(script1);

        const script2 = document.createElement('script');
        script2.textContent = uiJS;
        document.body.appendChild(script2);

        // Initialize UI
        metronomeUI = new window.MetronomeUI();
    });

    afterEach(() => {
        if (metronomeUI && metronomeUI.metronome.isPlaying) {
            metronomeUI.stop();
        }
        dom.window.close();
    });

    // -------------------------------------------------------------------------
    // Beat State Cycling Tests
    // -------------------------------------------------------------------------
    test('TC-UI-001: Click cycles beat state Normal → Accent → Mute → Normal', () => {
        const beatBox = document.querySelector('[data-beat-index="1"]');

        // Initial state: normal
        expect(beatBox.classList.contains('normal')).toBe(true);
        expect(metronomeUI.metronome.beatStates[1]).toBe('normal');

        // First click: normal → accent
        beatBox.click();
        expect(beatBox.classList.contains('accent')).toBe(true);
        expect(metronomeUI.metronome.beatStates[1]).toBe('accent');

        // Second click: accent → mute
        beatBox.click();
        expect(beatBox.classList.contains('mute')).toBe(true);
        expect(metronomeUI.metronome.beatStates[1]).toBe('mute');

        // Third click: mute → normal
        beatBox.click();
        expect(beatBox.classList.contains('normal')).toBe(true);
        expect(metronomeUI.metronome.beatStates[1]).toBe('normal');
    });

    test('TC-UI-002: Multiple beats can have different states', () => {
        const beat0 = document.querySelector('[data-beat-index="0"]');
        const beat1 = document.querySelector('[data-beat-index="1"]');
        const beat2 = document.querySelector('[data-beat-index="2"]');

        // Set different states
        beat0.click(); // accent → mute
        beat1.click(); // normal → accent
        // beat2 stays normal

        expect(metronomeUI.metronome.beatStates[0]).toBe('mute');
        expect(metronomeUI.metronome.beatStates[1]).toBe('accent');
        expect(metronomeUI.metronome.beatStates[2]).toBe('normal');
    });

    // -------------------------------------------------------------------------
    // BPM Control Tests
    // -------------------------------------------------------------------------
    test('TC-UI-003: BPM slider updates BPM input', () => {
        const slider = document.getElementById('bpm-slider');
        const input = document.getElementById('bpm-input');

        slider.value = 140;
        slider.dispatchEvent(new window.Event('input'));

        expect(input.value).toBe('140');
        expect(metronomeUI.metronome.bpm).toBe(140);
    });

    test('TC-UI-004: BPM input updates BPM slider', () => {
        const slider = document.getElementById('bpm-slider');
        const input = document.getElementById('bpm-input');

        input.value = 180;
        input.dispatchEvent(new window.Event('input'));

        expect(slider.value).toBe('180');
        expect(metronomeUI.metronome.bpm).toBe(180);
    });

    test('TC-UI-005: BPM clamped to valid range', () => {
        const input = document.getElementById('bpm-input');

        // Test below minimum
        input.value = 20;
        input.dispatchEvent(new window.Event('input'));
        expect(metronomeUI.metronome.bpm).toBe(40);

        // Test above maximum
        input.value = 300;
        input.dispatchEvent(new window.Event('input'));
        expect(metronomeUI.metronome.bpm).toBe(240);
    });

    // -------------------------------------------------------------------------
    // Time Signature Tests
    // -------------------------------------------------------------------------
    test('TC-UI-006: Changing time signature updates beat grid', () => {
        const select = document.getElementById('time-signature');
        const beatGrid = document.getElementById('beat-grid');

        // Start with 4/4
        expect(beatGrid.children.length).toBe(4);

        // Change to 3/4
        select.value = '3/4';
        select.dispatchEvent(new window.Event('change'));

        expect(beatGrid.children.length).toBe(3);
        expect(metronomeUI.metronome.beatsPerMeasure).toBe(3);

        // Change to 6/8
        select.value = '6/8';
        select.dispatchEvent(new window.Event('change'));

        expect(beatGrid.children.length).toBe(6);
        expect(metronomeUI.metronome.beatsPerMeasure).toBe(6);
    });

    test('TC-UI-007: Beat grid displays correct beat numbers', () => {
        const select = document.getElementById('time-signature');
        select.value = '5/4';
        select.dispatchEvent(new window.Event('change'));

        const beatBoxes = document.querySelectorAll('.beat');

        expect(beatBoxes.length).toBe(5);
        expect(beatBoxes[0].textContent).toBe('1');
        expect(beatBoxes[1].textContent).toBe('2');
        expect(beatBoxes[2].textContent).toBe('3');
        expect(beatBoxes[3].textContent).toBe('4');
        expect(beatBoxes[4].textContent).toBe('5');
    });

    // -------------------------------------------------------------------------
    // Play/Stop Button Tests
    // -------------------------------------------------------------------------
    test('TC-UI-008: Play button starts metronome', () => {
        const playBtn = document.getElementById('play-stop-btn');

        expect(metronomeUI.metronome.isPlaying).toBe(false);

        playBtn.click();

        expect(metronomeUI.metronome.isPlaying).toBe(true);
        expect(playBtn.classList.contains('playing')).toBe(true);
    });

    test('TC-UI-009: Stop button stops metronome', () => {
        const playBtn = document.getElementById('play-stop-btn');

        // Start
        playBtn.click();
        expect(metronomeUI.metronome.isPlaying).toBe(true);

        // Stop
        playBtn.click();
        expect(metronomeUI.metronome.isPlaying).toBe(false);
        expect(playBtn.classList.contains('playing')).toBe(false);
    });

    test('TC-UI-010: Play/Stop button shows correct icon', () => {
        const playBtn = document.getElementById('play-stop-btn');
        const playIcon = playBtn.querySelector('.play-icon');
        const stopIcon = playBtn.querySelector('.stop-icon');

        // Initially shows play icon
        expect(playIcon.style.display).not.toBe('none');
        expect(stopIcon.style.display).toBe('none');

        // After click, shows stop icon
        playBtn.click();
        expect(playIcon.style.display).toBe('none');
        expect(stopIcon.style.display).toBe('inline');

        // After stop, shows play icon again
        playBtn.click();
        expect(playIcon.style.display).toBe('inline');
        expect(stopIcon.style.display).toBe('none');
    });

    // -------------------------------------------------------------------------
    // Visual Feedback Tests
    // -------------------------------------------------------------------------
    test('TC-UI-011: Current beat gets active class', (done) => {
        const beatBoxes = document.querySelectorAll('.beat');

        metronomeUI.metronome.setOnBeatCallback((beatIndex) => {
            const activeBeat = document.querySelector(`[data-beat-index="${beatIndex}"]`);
            expect(activeBeat.classList.contains('active')).toBe(true);

            // Stop after first beat
            metronomeUI.stop();
            done();
        });

        metronomeUI.play();
    }, 5000);

    test('TC-UI-012: Active class removed after beat', (done) => {
        metronomeUI.metronome.setOnBeatCallback((beatIndex) => {
            const activeBeat = document.querySelector(`[data-beat-index="${beatIndex}"]`);

            // Should have active class immediately
            expect(activeBeat.classList.contains('active')).toBe(true);

            // After 200ms, active class should be removed
            setTimeout(() => {
                expect(activeBeat.classList.contains('active')).toBe(false);
                metronomeUI.stop();
                done();
            }, 200);
        });

        metronomeUI.play();
    }, 5000);

    test('TC-UI-013: Only one beat has active class at a time', (done) => {
        let beatCount = 0;

        metronomeUI.metronome.setOnBeatCallback(() => {
            const activeBeats = document.querySelectorAll('.beat.active');
            expect(activeBeats.length).toBeLessThanOrEqual(1);

            beatCount++;
            if (beatCount >= 5) {
                metronomeUI.stop();
                done();
            }
        });

        metronomeUI.play();
    }, 10000);

    // -------------------------------------------------------------------------
    // State Persistence Tests
    // -------------------------------------------------------------------------
    test('TC-UI-014: Beat states persist when changing BPM', () => {
        const beat1 = document.querySelector('[data-beat-index="1"]');
        const beat2 = document.querySelector('[data-beat-index="2"]');

        // Set custom states
        beat1.click(); // normal → accent
        beat2.click(); // normal → accent
        beat2.click(); // accent → mute

        // Change BPM
        const input = document.getElementById('bpm-input');
        input.value = 180;
        input.dispatchEvent(new window.Event('input'));

        // States should persist
        expect(metronomeUI.metronome.beatStates[1]).toBe('accent');
        expect(metronomeUI.metronome.beatStates[2]).toBe('mute');
    });

    test('TC-UI-015: Beat states reset when changing time signature (KNOWN ISSUE)', () => {
        const beat1 = document.querySelector('[data-beat-index="1"]');
        beat1.click(); // normal → accent

        // Change time signature
        const select = document.getElementById('time-signature');
        select.value = '3/4';
        select.dispatchEvent(new window.Event('change'));

        // States are reset (this is current behavior, may want to fix)
        expect(metronomeUI.metronome.beatStates[1]).toBe('normal');
        expect(metronomeUI.metronome.beatStates[0]).toBe('accent'); // First beat always accent
    });

    // -------------------------------------------------------------------------
    // Accessibility Tests
    // -------------------------------------------------------------------------
    test('TC-UI-016: All interactive elements are keyboard accessible', () => {
        const slider = document.getElementById('bpm-slider');
        const input = document.getElementById('bpm-input');
        const select = document.getElementById('time-signature');
        const playBtn = document.getElementById('play-stop-btn');

        // Should all be focusable
        expect(slider.tabIndex).toBeGreaterThanOrEqual(0);
        expect(input.tabIndex).toBeGreaterThanOrEqual(0);
        expect(select.tabIndex).toBeGreaterThanOrEqual(0);
        expect(playBtn.tabIndex).toBeGreaterThanOrEqual(0);
    });
});

// ============================================================================
// Stack UI Visual Tests (CURRENTLY NOT IMPLEMENTED)
// ============================================================================

describe('Stack UI Visual Tests', () => {
    test('TC-STACK-001: Normal beat shows 1 bar (PENDING IMPLEMENTATION)', () => {
        // This test will fail until stack UI is implemented
        // Expected: .beat.normal should contain 1 vertical bar element
        // Actual: Uses 60x60px colored box
    });

    test('TC-STACK-002: Accent beat shows 3 bars (PENDING IMPLEMENTATION)', () => {
        // Expected: .beat.accent should contain 3 vertical bar elements
        // Actual: Uses 60x60px colored box with red background
    });

    test('TC-STACK-003: Mute beat shows 0 bars or very short (PENDING IMPLEMENTATION)', () => {
        // Expected: .beat.mute should show no bars or minimal height
        // Actual: Uses 60x60px colored box with gray background
    });

    test('TC-STACK-004: Bars aligned bottom to top (PENDING IMPLEMENTATION)', () => {
        // Expected: Bars should use flexbox with align-items: flex-end
        // Actual: No bar elements exist
    });

    test('TC-STACK-005: Stack colors match design spec (PENDING IMPLEMENTATION)', () => {
        // Expected: Bars should use blue color (#3498db)
        // Actual: Uses red (#e74c3c) for accent, gray for mute
    });
});

module.exports = { /* export tests if needed */ };
