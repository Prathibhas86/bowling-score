const ScoreCalcilator = require('../src/ScoreCalculator');

describe('ScoreCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new ScoreCalcilator();
  });

  describe('constructor', () => {
    it('should initialize with empty frames and currentFrame arrays', () => {
      expect(calculator.frames).toEqual([]);
      expect(calculator.currentFrame).toEqual([]);
      expect(calculator.score).toEqual([]);
    });
  });

  describe('calculateScore', () => {
    describe('first element of frame', () => {
      it('should add a number as the first element in a frame', () => {
        calculator.calculateScore(4);
        expect(calculator.frames).toEqual([[4]]);
        expect(calculator.currentFrame).toEqual([4]);
        expect(calculator.score).toEqual([-1]);
      });

      it('should add a strike (X) as the first element', () => {
        calculator.calculateScore('X');
        expect(calculator.frames).toEqual([['X']]);
        expect(calculator.score).toEqual([-1]);
      });

      it('should throw an error if first element is a spare (/)', () => {
        expect(() => {
          calculator.calculateScore('/');
        }).toThrow(new Error('First element cannot be a /'));
      });
    });

    describe('second element of frame', () => {
      beforeEach(() => {
        calculator.calculateScore(4);
      });

      it('should add a number as the second element', () => {
        calculator.calculateScore(5);
        expect(calculator.frames).toEqual([[4, 5]]);
        expect(calculator.currentFrame).toEqual([]);
      });

      it('should add a spare (/) as the second element', () => {
        calculator.calculateScore('/');
        expect(calculator.frames).toEqual([[4, '/']]);
        expect(calculator.currentFrame).toEqual([]);
      });

      it('should throw an error if second element is a strike', () => {
        expect(() => {
          calculator.calculateScore('X');
        }).toThrow(new Error('No strike possible in the second chance'));
      });

      it('should clear currentFrame after adding second element', () => {
        calculator.calculateScore(3);
        expect(calculator.currentFrame).toEqual([]);
      });
    });

    describe('after a strike', () => {
      beforeEach(() => {
        calculator.calculateScore('X');
      });

      it('should start a new frame after a strike', () => {
        calculator.calculateScore(4);
        expect(calculator.frames).toEqual([['X'], [4]]);
      });

      it('should reset currentFrame to start a new frame', () => {
        calculator.calculateScore(5);
        expect(calculator.currentFrame).toEqual([5]);
      });

      it('should allow strike in next frame', () => {
        calculator.calculateScore('X');
        expect(calculator.frames).toEqual([['X'], ['X']]);
      });
    });

    describe('multiple frames', () => {
      it('should build multiple frames correctly', () => {
        calculator.calculateScore(4);
        calculator.calculateScore(5);
        calculator.calculateScore('X');
        calculator.calculateScore(3);
        calculator.calculateScore(6);
        
        expect(calculator.frames).toEqual([[4, 5], ['X'], [3, 6]]);
      });

      it('step-by-step: should handle sequence [4,5,X,X,8] one at a time', () => {
        // roll 1
        calculator.calculateScore(4);
        expect(calculator.frames).toEqual([[4]]);
        expect(calculator.currentFrame).toEqual([4]);
        expect(calculator.score).toEqual([-1]);

        // roll 2
        calculator.calculateScore(5);
        expect(calculator.frames).toEqual([[4, 5]]);
        expect(calculator.currentFrame).toEqual([]);
        expect(calculator.score).toEqual([9]);

        // roll 3 (strike)
        calculator.calculateScore('X');
        expect(calculator.frames).toEqual([[4, 5], ['X']]);
        expect(calculator.currentFrame).toEqual([]);
        expect(calculator.score).toEqual([9, -1]);

        // roll 4 (strike)
        calculator.calculateScore('X');
        expect(calculator.frames).toEqual([[4, 5], ['X'], ['X']]);
        expect(calculator.currentFrame).toEqual([]);
        expect(calculator.score).toEqual([9, -1, -1]);

        // roll 5
        calculator.calculateScore(8);
        expect(calculator.frames).toEqual([[4, 5], ['X'], ['X'], [8]]);
        expect(calculator.currentFrame).toEqual([8]);
        expect(calculator.score).toEqual([9, 28, -1, -1]);
      });
    });
  });
});
