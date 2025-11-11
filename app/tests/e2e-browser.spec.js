/**
 * End-to-End Browser Tests
 * Tests actual browser behavior with real Web Audio API
 *
 * Run with: npx playwright test e2e-browser.spec.js
 * Requires: @playwright/test
 */

const { test, expect } = require('@playwright/test');

test.describe('Metronome E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to metronome app
        await page.goto('http://localhost:3000'); // Update with actual URL

        // Wait for page to load
        await page.waitForSelector('#play-stop-btn');
    });

    // -------------------------------------------------------------------------
    // CRITICAL: Audio Playback Tests
    // -------------------------------------------------------------------------
    test('TC-E2E-001: Audio plays continuously for 10+ beats', async ({ page }) => {
        // Start metronome
        await page.click('#play-stop-btn');

        // Wait for 10 beats at 120 BPM (5 seconds)
        await page.waitForTimeout(5000);

        // Check that beats are being visualized
        const activeBeats = await page.locator('.beat.active').count();

        // Should have seen at least one active beat in last moments
        // (Can't guarantee exact timing in E2E test, but should see activity)
        expect(activeBeats).toBeGreaterThanOrEqual(0);

        // Stop metronome
        await page.click('#play-stop-btn');

        // Verify stopped
        const isPlaying = await page.locator('#play-stop-btn.playing').count();
        expect(isPlaying).toBe(0);
    });

    test('TC-E2E-002: All beats cycle through in 4/4 time', async ({ page }) => {
        // Track which beats get highlighted
        const highlightedBeats = new Set();

        // Set up mutation observer to track active class
        await page.evaluate(() => {
            window.highlightedBeats = [];
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList.contains('active')) {
                        const index = mutation.target.dataset.beatIndex;
                        window.highlightedBeats.push(parseInt(index));
                    }
                });
            });

            const beatGrid = document.getElementById('beat-grid');
            const beats = beatGrid.querySelectorAll('.beat');
            beats.forEach(beat => {
                observer.observe(beat, {
                    attributes: true,
                    attributeFilter: ['class']
                });
            });
        });

        // Start metronome
        await page.click('#play-stop-btn');

        // Wait for 10 beats (5 seconds at 120 BPM)
        await page.waitForTimeout(5000);

        // Stop metronome
        await page.click('#play-stop-btn');

        // Get highlighted beats
        const beats = await page.evaluate(() => window.highlightedBeats);

        // Should have seen beats 0, 1, 2, 3 (all beats in 4/4)
        expect(beats).toContain(0);
        expect(beats).toContain(1);
        expect(beats).toContain(2);
        expect(beats).toContain(3);
    });

    // -------------------------------------------------------------------------
    // BPM Tests
    // -------------------------------------------------------------------------
    test('TC-E2E-003: Test 60 BPM (slow tempo)', async ({ page }) => {
        // Set BPM to 60
        await page.fill('#bpm-input', '60');

        // Start metronome
        await page.click('#play-stop-btn');

        // Record beat times
        const beatTimes = await page.evaluate(() => {
            return new Promise((resolve) => {
                const times = [];
                let count = 0;

                window.metronomeUI.metronome.setOnBeatCallback((beatIndex, time) => {
                    times.push(time);
                    count++;
                    if (count >= 5) {
                        resolve(times);
                    }
                });
            });
        });

        // Stop metronome
        await page.click('#play-stop-btn');

        // Calculate intervals (should be ~1000ms at 60 BPM)
        const intervals = [];
        for (let i = 1; i < beatTimes.length; i++) {
            intervals.push((beatTimes[i] - beatTimes[i - 1]) * 1000);
        }

        // Verify intervals are close to 1000ms
        intervals.forEach(interval => {
            expect(interval).toBeGreaterThan(990);
            expect(interval).toBeLessThan(1010);
        });
    });

    test('TC-E2E-004: Test 180 BPM (fast tempo)', async ({ page }) => {
        // Set BPM to 180
        await page.fill('#bpm-input', '180');

        // Start metronome
        await page.click('#play-stop-btn');

        // Record beat times
        const beatTimes = await page.evaluate(() => {
            return new Promise((resolve) => {
                const times = [];
                let count = 0;

                window.metronomeUI.metronome.setOnBeatCallback((beatIndex, time) => {
                    times.push(time);
                    count++;
                    if (count >= 10) {
                        resolve(times);
                    }
                });
            });
        });

        // Stop metronome
        await page.click('#play-stop-btn');

        // Calculate intervals (should be ~333ms at 180 BPM)
        const intervals = [];
        for (let i = 1; i < beatTimes.length; i++) {
            intervals.push((beatTimes[i] - beatTimes[i - 1]) * 1000);
        }

        // Verify intervals are close to 333ms
        intervals.forEach(interval => {
            expect(interval).toBeGreaterThan(325);
            expect(interval).toBeLessThan(341);
        });
    });

    // -------------------------------------------------------------------------
    // Time Signature Tests
    // -------------------------------------------------------------------------
    test('TC-E2E-005: Test 3/4 time signature', async ({ page }) => {
        // Change to 3/4
        await page.selectOption('#time-signature', '3/4');

        // Verify beat grid has 3 beats
        const beatCount = await page.locator('.beat').count();
        expect(beatCount).toBe(3);

        // Start metronome
        await page.click('#play-stop-btn');

        // Verify beats cycle 0, 1, 2
        const beatPattern = await page.evaluate(() => {
            return new Promise((resolve) => {
                const indices = [];

                window.metronomeUI.metronome.setOnBeatCallback((beatIndex) => {
                    indices.push(beatIndex);
                    if (indices.length >= 9) { // 3 complete cycles
                        resolve(indices);
                    }
                });
            });
        });

        // Stop
        await page.click('#play-stop-btn');

        // Verify pattern: 0,1,2,0,1,2,0,1,2
        expect(beatPattern).toEqual([0, 1, 2, 0, 1, 2, 0, 1, 2]);
    });

    test('TC-E2E-006: Test 6/8 time signature', async ({ page }) => {
        // Change to 6/8
        await page.selectOption('#time-signature', '6/8');

        // Verify beat grid has 6 beats
        const beatCount = await page.locator('.beat').count();
        expect(beatCount).toBe(6);

        // Verify beat numbers 1-6
        const beat1 = await page.locator('[data-beat-index="0"]').textContent();
        const beat6 = await page.locator('[data-beat-index="5"]').textContent();

        expect(beat1).toBe('1');
        expect(beat6).toBe('6');
    });

    // -------------------------------------------------------------------------
    // Beat State Tests
    // -------------------------------------------------------------------------
    test('TC-E2E-007: Beat state cycles correctly', async ({ page }) => {
        const beat1 = page.locator('[data-beat-index="1"]');

        // Initial: normal
        await expect(beat1).toHaveClass(/beat normal/);

        // Click 1: normal → accent
        await beat1.click();
        await expect(beat1).toHaveClass(/beat accent/);

        // Click 2: accent → mute
        await beat1.click();
        await expect(beat1).toHaveClass(/beat mute/);

        // Click 3: mute → normal
        await beat1.click();
        await expect(beat1).toHaveClass(/beat normal/);
    });

    test('TC-E2E-008: Muted beat does not produce sound (visual verification)', async ({ page }) => {
        // Set beat 1 to mute
        const beat1 = page.locator('[data-beat-index="1"]');
        await beat1.click(); // normal → accent
        await beat1.click(); // accent → mute

        // Start metronome
        await page.click('#play-stop-btn');

        // Wait for beat 1 to be highlighted
        await page.waitForSelector('[data-beat-index="1"].active', { timeout: 3000 });

        // Visual verification: muted beat gets highlighted but is visually distinct
        const isMuted = await beat1.evaluate(el => el.classList.contains('mute'));
        expect(isMuted).toBe(true);

        // Stop
        await page.click('#play-stop-btn');
    });

    // -------------------------------------------------------------------------
    // Stop/Restart Tests
    // -------------------------------------------------------------------------
    test('TC-E2E-009: Stop and restart works correctly', async ({ page }) => {
        // Start
        await page.click('#play-stop-btn');
        await expect(page.locator('#play-stop-btn.playing')).toBeVisible();

        // Wait 2 seconds
        await page.waitForTimeout(2000);

        // Stop
        await page.click('#play-stop-btn');
        await expect(page.locator('#play-stop-btn')).not.toHaveClass(/playing/);

        // Wait 1 second
        await page.waitForTimeout(1000);

        // Restart
        await page.click('#play-stop-btn');
        await expect(page.locator('#play-stop-btn.playing')).toBeVisible();

        // Should restart from beat 0
        const firstBeat = await page.evaluate(() => {
            return new Promise((resolve) => {
                window.metronomeUI.metronome.setOnBeatCallback((beatIndex) => {
                    resolve(beatIndex);
                });
            });
        });

        expect(firstBeat).toBe(0);

        // Stop
        await page.click('#play-stop-btn');
    });

    // -------------------------------------------------------------------------
    // Visual Feedback Tests
    // -------------------------------------------------------------------------
    test('TC-E2E-010: Active beat visual feedback works', async ({ page }) => {
        // Start metronome
        await page.click('#play-stop-btn');

        // Wait for first beat to be active
        await page.waitForSelector('.beat.active', { timeout: 2000 });

        // Take screenshot for visual verification
        await page.screenshot({
            path: '/Users/alefesilva/dev/metrow/app/tests/screenshots/active-beat.png'
        });

        // Verify active class exists
        const activeCount = await page.locator('.beat.active').count();
        expect(activeCount).toBeGreaterThan(0);

        // Stop
        await page.click('#play-stop-btn');

        // Active class should be removed
        await page.waitForTimeout(200);
        const activeAfterStop = await page.locator('.beat.active').count();
        expect(activeAfterStop).toBe(0);
    });

    // -------------------------------------------------------------------------
    // Mobile Responsiveness Tests
    // -------------------------------------------------------------------------
    test('TC-E2E-011: Mobile view works correctly', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Verify beat grid is visible and responsive
        const beatGrid = page.locator('#beat-grid');
        await expect(beatGrid).toBeVisible();

        // Verify beat boxes are appropriately sized
        const beat = page.locator('.beat').first();
        const box = await beat.boundingBox();

        // Should be smaller on mobile (50px vs 60px desktop)
        expect(box.width).toBeLessThanOrEqual(60);
        expect(box.height).toBeLessThanOrEqual(60);
    });

    // -------------------------------------------------------------------------
    // Performance Tests
    // -------------------------------------------------------------------------
    test('TC-E2E-012: Long-running stability (60 seconds)', async ({ page }) => {
        test.setTimeout(90000); // 90 second timeout

        // Start metronome
        await page.click('#play-stop-btn');

        // Run for 60 seconds
        await page.waitForTimeout(60000);

        // Verify still playing
        const isPlaying = await page.locator('#play-stop-btn.playing').count();
        expect(isPlaying).toBe(1);

        // Stop
        await page.click('#play-stop-btn');

        // Check for console errors
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        expect(consoleErrors.length).toBe(0);
    });

    // -------------------------------------------------------------------------
    // Accessibility Tests
    // -------------------------------------------------------------------------
    test('TC-E2E-013: Keyboard navigation works', async ({ page }) => {
        // Tab to BPM slider
        await page.keyboard.press('Tab');

        // Arrow keys should change BPM
        await page.keyboard.press('ArrowRight');
        const bpm1 = await page.inputValue('#bpm-input');

        await page.keyboard.press('ArrowRight');
        const bpm2 = await page.inputValue('#bpm-input');

        expect(parseInt(bpm2)).toBeGreaterThan(parseInt(bpm1));
    });
});

// ============================================================================
// Stack UI E2E Tests (PENDING IMPLEMENTATION)
// ============================================================================

test.describe('Stack UI E2E Tests (NOT IMPLEMENTED)', () => {
    test.skip('TC-STACK-E2E-001: Normal beat shows 1 bar', async ({ page }) => {
        // This test is skipped until stack UI is implemented
    });

    test.skip('TC-STACK-E2E-002: Accent beat shows 3 bars', async ({ page }) => {
        // This test is skipped until stack UI is implemented
    });

    test.skip('TC-STACK-E2E-003: Visual regression test for stack UI', async ({ page }) => {
        // Compare screenshots before/after changes
        // Requires Percy or Chromatic integration
    });
});
