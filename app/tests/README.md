# Metronome Loop Pattern - Test Suite

## Overview

This directory contains comprehensive test coverage for the Loop Pattern feature, including both automated unit tests and manual validation procedures.

## Test Files

### `loop-pattern.test.js`
Automated unit tests covering:
- Basic loop functionality
- Sound/mute phase logic
- Bar progression and cycling
- Bar counter display
- Edge cases (minimal/maximal patterns, zero values)
- Time signature compatibility
- Timing accuracy calculations
- Performance under load (1000+ beats)

**Run Tests:**
```bash
npm test loop-pattern.test.js
```

**Coverage Goal:** >90% code coverage

### `loop-pattern-validation.md`
Manual test validation checklist covering:
- Real-world user scenarios
- Audio quality assessment
- Visual animation smoothness
- Cross-platform compatibility
- Timing accuracy with external tools
- Performance monitoring
- User experience evaluation

**Execute Manual Tests:**
1. Print or open `loop-pattern-validation.md`
2. Follow each test case sequentially
3. Record results and observations
4. Complete sign-off section

## Test Strategy

### 1. Unit Tests (Automated)
- **Purpose:** Verify logic correctness
- **Scope:** All calculation methods, state transitions, edge cases
- **Execution:** Run before every commit
- **Pass Criteria:** 100% passing, >90% coverage

### 2. Integration Tests (Manual)
- **Purpose:** Verify audio/visual coordination
- **Scope:** Real playback, timing accuracy, user interactions
- **Execution:** Run before releases
- **Pass Criteria:** All critical tests passing, <500ms timing drift

### 3. Performance Tests
- **Purpose:** Ensure resource efficiency
- **Scope:** CPU/memory usage, long-running stability
- **Execution:** Run weekly during development
- **Pass Criteria:** <5% CPU, <50MB memory, no leaks

## Test Coverage Matrix

| Feature | Unit Tests | Manual Tests | Performance Tests |
|---------|-----------|--------------|-------------------|
| Sound/Mute Phases | ✅ | ✅ | ✅ |
| Bar Progression | ✅ | ✅ | ✅ |
| Loop Cycling | ✅ | ✅ | ✅ |
| Bar Counter | ✅ | ✅ | - |
| Individual Beat Muting | ✅ | ✅ | - |
| Time Signature Changes | ✅ | ✅ | - |
| Timing Accuracy | ✅ | ✅ | ✅ |
| Edge Cases | ✅ | ✅ | - |
| UI Responsiveness | - | ✅ | ✅ |
| Cross-Platform | - | ✅ | - |

## Running Tests

### Automated Tests

```bash
# Run all tests
npm test

# Run loop pattern tests only
npm test loop-pattern

# Run with coverage
npm test -- --coverage

# Watch mode during development
npm test -- --watch
```

### Manual Tests

1. **Preparation:**
   ```bash
   npm run build
   npm start
   ```

2. **Equipment Needed:**
   - External stopwatch/timer
   - Activity Monitor (Mac) or Task Manager (Windows)
   - Headphones or speakers
   - Test checklist printed or on second screen

3. **Execution:**
   - Follow test cases in `loop-pattern-validation.md`
   - Record results for each test
   - Note any anomalies or unexpected behavior

4. **Reporting:**
   - Complete test summary section
   - Document bugs found
   - Sign off on results

## Test Results

### Latest Test Run
- **Date:** [To be filled by tester]
- **Automated Tests:** [ ] PASS [ ] FAIL
- **Manual Tests:** [ ] PASS [ ] FAIL
- **Performance Tests:** [ ] PASS [ ] FAIL

### Known Issues
1. [Issue description and tracking number]

## Timing Accuracy Validation

### Expected Timing (60 BPM, 4/4 Time)
- **1 beat:** 1000ms
- **1 bar:** 4000ms
- **4 bars (sound phase):** 16000ms
- **2 bars (mute phase):** 8000ms
- **Full cycle (6 bars):** 24000ms

### Acceptance Criteria
- **Short-term (4 bars):** ±50ms deviation
- **Medium-term (1 minute):** ±200ms deviation
- **Long-term (5 minutes):** ±500ms deviation

## Contributing to Tests

### Adding New Test Cases

1. **Automated Tests:**
   ```javascript
   describe('New Feature', () => {
     let metronome;

     beforeEach(() => {
       metronome = new MetronomeLoopPatternTest();
     });

     it('should behave correctly', () => {
       // Arrange
       // Act
       // Assert
     });
   });
   ```

2. **Manual Tests:**
   - Add to appropriate section in `loop-pattern-validation.md`
   - Include clear setup, steps, and expected results
   - Assign severity level

### Test Documentation Standards

- **Clear descriptions:** What is being tested and why
- **Prerequisites:** Required setup or dependencies
- **Steps:** Numbered, sequential actions
- **Expected results:** Specific, measurable outcomes
- **Acceptance criteria:** Pass/fail conditions

## Continuous Integration

### Pre-Commit Checks
```bash
npm run lint
npm test
```

### Pre-Release Checklist
- [ ] All automated tests passing
- [ ] Manual test validation completed
- [ ] Performance benchmarks met
- [ ] Cross-platform testing done
- [ ] Documentation updated
- [ ] Known issues documented

## Support

For questions about testing:
- Review test documentation
- Check existing test cases for examples
- Consult team lead for complex scenarios

---

**Last Updated:** 2025-10-30
**Test Coverage:** 90%+ (automated), 34 manual test cases
**Maintainer:** Testing Team
