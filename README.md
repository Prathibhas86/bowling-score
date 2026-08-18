# bowling-score
**Overview**
- **Problem:** Implement a frame-by-frame bowling scoring calculator that accepts an array of rolls (`0–9`, `/`, `X`) and returns an array of per-frame scores for all frames that can be evaluated at that point in the game.
- **Goal:** Compare two approaches in the repo: the efficient incremental updater (`src/ScoreCalculator.js`) and a simpler brute-force scanner (`src/ScoreCalculatorBasic.js`). See implementation: [src/ScoreCalculator.js](src/ScoreCalculator.js) and [src/ScoreCalculatorBasic.js](src/ScoreCalculatorBasic.js).

**Example Behavior**
- Input: `[4, 5, "X", 8]` → Output: `[9, -1, -1]` (use `-1` or `nil` to indicate frames not yet resolvable).
- When input extends to `[4, 5, "X", 8, 1]` → Output: `[9, 19, 9]`.

**Assumption**
The 10th frame rule is out of scope for this implementation. The use case is when the tenth frame ends with a spare or a strike, the implementation returns -1 as the score.

**Tools Used**
Github Co-pilot used to generate test cases and documentation

**Approach A — Brute-force (array-at-once scanner)**
- **File:** [src/ScoreCalculatorBasic.js](src/ScoreCalculatorBasic.js)
- **Idea:** Accept the entire array of rolls for a snapshot and scan it left-to-right building frame scores using lookahead logic. For each frame, examine the next one or two rolls to determine whether the frame can be scored now or should be marked unresolved (`-1`).
- **Key behaviors:**
  - Processes the input array in a single pass using index arithmetic and helper functions.
  - Evaluates direct numeric frames, spares, strikes, and marks unresolved frames when not enough future rolls are available.
- **Time complexity:** O(N) for N input rolls per invocation — the entire input is rescanned on each call.
- **Space complexity:** O(F) to store frame results.
- **Pros:**
  - Simpler, easier-to-read implementation.
  - Good for batch scoring (e.g., post-game totals) or when the full roll history is always available.
- **Cons:**
  - Inefficient for interactive use if you call it on every new roll (reprocesses all prior rolls each time).
  - More likely to be used as a pure function (stateless), which may be either a pro or con depending on application.

**Approach B — Optimal (incremental stateful updater)**
- **File:** [src/ScoreCalculator.js](src/ScoreCalculator.js)
- **Idea:** Maintain internal state as rolls arrive: a `frames` list, a `currentFrame`, `score` array (where unresolved frames are marked `-1`), and an index pointer (`idxOfNilStart`) into the first unresolved frame. On each new roll, update the current frame and then attempt to resolve any previously unresolved frames by inspecting subsequent frame data. Scores are updated only for frames that can now be computed.
- **Key behaviors:**
  - Incrementally fills `frames` and resolves `score` entries as soon as sufficient follow-up rolls are available.
  - Correctly handles strikes (`X`) and spares (`/`) by waiting for needed next rolls.
  - Keeps partial state so it can be used to render a running scorecard mid-game.
- **Time complexity:** Amortized O(1) per new roll in common cases. When resolving, you may scan unresolved indices forward; worst-case per-roll cost can be O(F) where F is number of unresolved frames, but typically small.
- **Space complexity:** O(F) where F is number of frames bowled so far (bounded by 10 in a full game).
- **Pros:**
  - Efficient for interactive/live scoring where rolls arrive one at a time.
  - Small updates; avoids re-parsing the whole roll array each time.
  - Easier to wire into an event-driven system (pinsetter events).
- **Cons / Caveats:**
  - Slightly more complex to implement and reason about (mutable state, careful indexing).
  - Need careful unit tests for edge-cases of partial frames and index management.

**Tests and validation**
- Tests added in this workspace include per-roll incremental tests for `ScoreCalculator` and array-input tests for `ScoreCalculatorBasic`.
  - See: [test/ScoreCalculator.test.js](test/ScoreCalculator.test.js) and [test/ScoreCalculatorBasic.test.js](test/ScoreCalculatorBasic.test.js) and the comprehensive scenario suite at [test/extraSequences.test.js](test/extraSequences.test.js).
- Implemented test cases includes(but not limited to):
  - Single open frame, multiple open frames.
  - Single spare and spare chain.
  - Single strike and strike chains (`X, X, X`).
  - Mixed partial games (e.g. `[4,5,'X',8]`).
  - Invalid inputs (e.g. leading `/`, secondary `X`).

**Which to use and when**
- **Use `ScoreCalculator.js` (optimal)** when:
  - The calculator will be used live as rolls stream from hardware (pinsetter events).
  - You need fast per-roll updates and minimal rework.
  - You want to maintain player state across events in memory.
- **Use `ScoreCalculatorBasic.js` (brute force)** when:
  - You always receive the entire list of rolls at once (batch processing, logs, post-game analysis).
  - You want a simpler, easier-to-audit function with fewer mutable invariants.

**Improvements & next steps**
- Add input validation and a clear error model (throw vs return error code).
- Consider converting to TypeScript for stronger typing of roll/frame types.
- Implement the tenth frame rule - The current implementation can be improved to provide the player another chance to complete the score calculation.

**References**
- Implementations: [src/ScoreCalculator.js](src/ScoreCalculator.js), [src/ScoreCalculatorBasic.js](src/ScoreCalculatorBasic.js)
- Tests: [test/ScoreCalculator.test.js](test/ScoreCalculator.test.js), [test/ScoreCalculatorBasic.test.js](test/ScoreCalculatorBasic.test.js), [test/extraSequences.test.js](test/extraSequences.test.js)

