const ScoreCalculatorBasic = require('../src/ScoreCalculatorBasic');

describe('ScoreCalculatorBasic - array input mode', () => {
  it('handles [4,5,X,8] correctly', () => {
    const calc = new ScoreCalculatorBasic();
    const result = calc.calculateScore([4, 5, 'X', 8]);
    expect(result).toEqual([9, -1, -1]);
    expect(calc.scores).toEqual([9, -1, -1]);
  });

  it('handles [4,5,X,8,/] correctly', () => {
    const calc = new ScoreCalculatorBasic();
    const result = calc.calculateScore([4, 5, 'X', 8, '/']);
    expect(result).toEqual([9, 20, -1]);
    expect(calc.scores).toEqual([9, 20, -1]);
  });

  it('handles [4,5,X,X,X] correctly', () => {
    const calc = new ScoreCalculatorBasic();
    const result = calc.calculateScore([4, 5, 'X', 'X', 'X']);
    expect(result).toEqual([9, 30, -1, -1]);
    expect(calc.scores).toEqual([9, 30, -1, -1]);
  });
});
