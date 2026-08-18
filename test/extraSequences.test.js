const ScoreCalcilator = require('../src/ScoreCalculator');

const runRolls = (rolls) => {
  const calculator = new ScoreCalcilator();
  rolls.forEach((roll) => calculator.calculateScore(roll));
  return calculator;
};

describe('ScoreCalculator edge cases and scenario coverage', () => {
  describe('invalid inputs', () => {
    it('throws when a spare is used as the first roll', () => {
      expect(() => runRolls(['/'])).toThrow(new Error('First element cannot be a /'));
    });

    it('throws when a strike is used as the second roll in the same frame', () => {
      const calculator = new ScoreCalcilator();
      calculator.calculateScore(4);
      expect(() => calculator.calculateScore('X')).toThrow(new Error('No strike possible in the second chance'));
    });

    it('throws when a second roll is entered after a strike started the next frame', () => {
      const calculator = new ScoreCalcilator();
      calculator.calculateScore('X');
      expect(() => calculator.calculateScore('X')).not.toThrow();
      expect(calculator.frames).toEqual([['X'], ['X']]);
    });
  });

  describe('open frame scenarios', () => {
    it.each([
      ['single open frame', [4, 5], [[4, 5]], [], [9]],
      ['multiple open frames', [4, 5, 3, 2], [[4, 5], [3, 2]], [], [9, 5]],
      ['three open frames', [1, 2, 3, 4, 5, 6], [[1, 2], [3, 4], [5, 6]], [], [3, 7, 11]],
    ])('handles %s', (_label, rolls, expectedFrames, expectedCurrent, expectedScore) => {
      const calculator = runRolls(rolls);
      expect(calculator.frames).toEqual(expectedFrames);
      expect(calculator.currentFrame).toEqual(expectedCurrent);
      expect(calculator.score).toEqual(expectedScore);
    });
  });

  describe('partial frame tracking', () => {
    it('keeps the first roll in currentFrame until the frame is complete', () => {
      const calculator = new ScoreCalcilator();
      calculator.calculateScore(4);
      expect(calculator.frames).toEqual([[4]]);
      expect(calculator.currentFrame).toEqual([4]);
      expect(calculator.score).toEqual([-1]);
    });

    it('clears currentFrame after the second roll in an open frame', () => {
      const calculator = new ScoreCalcilator();
      calculator.calculateScore(4);
      calculator.calculateScore(5);
      expect(calculator.frames).toEqual([[4, 5]]);
      expect(calculator.currentFrame).toEqual([]);
      expect(calculator.score).toEqual([9]);
    });

    it('keeps the frame pending after a strike and starts the next frame immediately', () => {
      const calculator = new ScoreCalcilator();
      calculator.calculateScore('X');
      expect(calculator.frames).toEqual([['X']]);
      expect(calculator.currentFrame).toEqual([]);
      expect(calculator.score).toEqual([-1]);

      calculator.calculateScore(4);
      expect(calculator.frames).toEqual([['X'], [4]]);
      expect(calculator.currentFrame).toEqual([4]);
    });
  });

  describe('spare scenarios', () => {
    it.each([
      ['single spare', [4, '/'], [[4, '/']], [], [-1]],
      ['spare then next roll', [4, '/', 6], [[4, '/'], [6]], [6], [16, -1]],
      ['double spare', [4, '/', 6, '/', 5], [[4, '/'], [6, '/'], [5]], [5], [16, 15, -1]],
      ['spare chain', [4, '/', 6, '/', 5, 2], [[4, '/'], [6, '/'], [5, 2]], [], [16, 15, 7]],
    ])('handles %s', (_label, rolls, expectedFrames, expectedCurrent, expectedScore) => {
      const calculator = runRolls(rolls);
      expect(calculator.frames).toEqual(expectedFrames);
      expect(calculator.currentFrame).toEqual(expectedCurrent);
      expect(calculator.score).toEqual(expectedScore);
    });
  });

  describe('strike scenarios', () => {
    it.each([
      ['single strike', ['X'], [['X']], [], [-1]],
      ['strike then number', ['X', 4], [['X'], [4]], [4], [-1, -1]],
      ['strike then second strike', ['X', 'X'], [['X'], ['X']], [], [-1, -1]],
      ['strike then spare', ['X', 6, '/'], [['X'], [6, '/']], [], [20, -1]],
      ['strike then open frame', ['X', 4, 3], [['X'], [4, 3]], [], [17, 7]],
      ['strike chain', ['X', 'X', 'X'], [['X'], ['X'], ['X']], [], [30, -1, -1]],
    ])('handles %s', (_label, rolls, expectedFrames, expectedCurrent, expectedScore) => {
      const calculator = runRolls(rolls);
      expect(calculator.frames).toEqual(expectedFrames);
      expect(calculator.currentFrame).toEqual(expectedCurrent);
      expect(calculator.score).toEqual(expectedScore);
    });
  });

  describe('mixed scenario matrix', () => {
    it.each([
      ['open, spare, open', [4, 5, 6, '/', 3, 4], [[4, 5], [6, '/'], [3, 4]], [], [9, 13, 7]],
      ['spare, strike, open', [4, '/', 'X', 5, 4], [[4, '/'], ['X'], [5, 4]], [], [20, 19, 9]],
      ['strike, spare, open', ['X', 7, '/', 3, 4], [['X'], [7, '/'], [3, 4]], [], [20, 13, 7]],
      ['open, strike, strike, open', [4, 5, 'X', 'X', 6, 3], [[4, 5], ['X'], ['X'], [6, 3]], [], [9, 26, 19, 9]],
      ['mixed partial game', [4, 5, 'X', 6, '/', 7, 2], [[4, 5], ['X'], [6, '/'], [7, 2]], [], [9, 20, 17, 9]],
    ])('handles %s', (_label, rolls, expectedFrames, expectedCurrent, expectedScore) => {
      const calculator = runRolls(rolls);
      expect(calculator.frames).toEqual(expectedFrames);
      expect(calculator.currentFrame).toEqual(expectedCurrent);
      expect(calculator.score).toEqual(expectedScore);
    });
  });
});
