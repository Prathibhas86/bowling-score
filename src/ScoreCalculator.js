class ScoreCalculator {

    frames = [];
    currentFrame = [];
    score = [];
    idxOfNilStart = -1;

    calculateScore(s) {
        if (this.currentFrame.length === 0) {
            if (s === '/') {
                throw new Error('First element cannot be a /');
            }
            if (s === 'X') {
                this.currentFrame = [];
            } else {
                this.currentFrame.push(s);
            }
            this.frames.push([s]);
            this.score.push(-1);
            if (this.idxOfNilStart === -1) {
                this.idxOfNilStart = this.score.length - 1;
            }
        } else {
            if (s === 'X') {
                throw new Error('No strike possible in the second chance');
            }

            this.currentFrame.push(s);
            this.frames[this.frames.length - 1].push(s);

            // compute frame sum before clearing currentFrame
            if (s !== '/') { //[9, -1, 9, -1]
                const lastFrame = this.frames[this.frames.length - 1];
                const frameSum = lastFrame[0] + lastFrame[1];
                this.score[this.score.length - 1] = frameSum;
            }

            this.currentFrame = [];
        }

        // Resolve any previously nil scores (stored starting at idxOfNilStart)
        if (this.idxOfNilStart !== -1) {
            for (let idx = this.idxOfNilStart; idx < this.score.length; idx++) {
                const frameCorrespondingToNil = this.frames[idx];
                if (frameCorrespondingToNil[0] === 'X') {
                    if (this.frames[idx + 1] !== undefined && this.frames[idx + 1][1] !== undefined) {
                        if (this.frames[idx + 1][1] !== '/') {
                            this.score[idx] = 10 + this.frames[idx + 1][0] + this.frames[idx + 1][1];
                        } else {
                            this.score[idx] = 20;
                        }
                    } else if (this.frames[idx + 1] !== undefined && this.frames[idx + 2] !== undefined) {
                        if (this.frames[idx + 2][0] !== 'X') {
                            this.score[idx] = 20 + this.frames[idx + 2][0];
                        } else {
                            this.score[idx] = 30;
                        }
                    }
                    else {
                        this.idxOfNilStart = idx;
                        break;
                    }
                }
                else if (frameCorrespondingToNil[1] === '/') {
                    if (this.frames[idx + 1] !== undefined) {
                        if (this.frames[idx + 1][0] !== 'X') {
                            this.score[idx] = 10 + this.frames[idx + 1][0];
                        }
                        else {
                            this.score[idx] = 20;
                        }
                    }
                    else {
                        this.idxOfNilStart = idx;
                        break;
                    }
                }
            }
        }

        return this.score;
    }
}

module.exports = ScoreCalculator;