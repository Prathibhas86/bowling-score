class ScoreCalculatorBasic {

    scores = [];

    handleNumbersInFrame(s, idx) {
        if (idx + 1 < s.length && Number.isInteger(s[idx + 1])) {
            this.scores.push(s[idx] + s[idx + 1]);
            idx += 2;
        }
        else if (idx + 1 < s.length && s[idx + 1] === 'X') {
            throw new Error('No strike possible in the second chance');
        }
        else if (idx + 1 < s.length && s[idx + 1] === '/') { //[4,/,X]
            if (idx + 2 < s.length && Number.isInteger(s[idx + 2])) {
                this.scores.push(10 + s[idx + 2]);
                idx += 2;
            }
            else if (idx + 2 < s.length && s[idx + 2] === 'X') {
                this.scores.push(20);
                idx += 2;
            } else {
                this.scores.push(-1);
                idx += 2;
            }

        } else {
            this.scores.push(-1);
            idx += 1;
        }
        return idx;
    }

    calculateScore(s) {
        let idx = 0;
        this.scores = [];
        while (idx < s.length) {
            if (Number.isInteger(s[idx])) {
                idx = this.handleNumbersInFrame(s, idx);
            }
            else if (s[idx] === 'X') {
                if (idx + 1 < s.length && s[idx + 1] === '/') {
                    throw new Error('No spare possible in a new frame');
                }
                else if (idx + 1 < s.length && idx+2 < s.length) {
                    if(Number.isInteger(s[idx+1]) && Number.isInteger(s[idx+2])) {
                        this.scores.push(10 + s[idx+1] + s[idx+2]);
                        idx += 1;
                    } else if(Number.isInteger(s[idx+1]) && s[idx+2] === '/') {
                        this.scores.push(20);
                        idx += 1;
                    } else if(s[idx+1] === 'X' && s[idx+2] === 'X') {
                        this.scores.push(30);
                        idx += 1;
                    } else if(s[idx+1] === 'X' && Number.isInteger(s[idx+2])) {
                        this.scores.push(20 + s[idx+2]);
                        idx += 1;
                    }
                } else{
                    this.scores.push(-1);
                    idx += 1;
                }
            }

        }
        return this.scores;
    }
}

module.exports = ScoreCalculatorBasic;