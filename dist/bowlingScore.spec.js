"use strict";
function flatten(array) {
    return array.reduce((acc, val) => acc.concat(val), []);
}
function sum(array) {
    return array.reduce((accu, currentValue) => accu + currentValue);
}
function scoreGame(inputRolls) {
    const rolls = flatten(inputRolls);
    const scores = [];
    let previousScore = 0;
    let rollIndex = 0;
    while (rollIndex < rolls.length) {
        const { frameScore, numberOfRollsInFrame } = scoreFrame(rolls, rollIndex);
        const score = frameScore + previousScore;
        scores.push(score);
        previousScore = score;
        rollIndex += numberOfRollsInFrame;
    }
    return scores[scores.length - 1];
}
function scoreFrame(rolls, rollIndex) {
    if (isStrike(rolls, rollIndex)) {
        return scoreStrike(rolls, rollIndex);
    }
    else if (isSpare(rolls, rollIndex)) {
        return scoreSpare(rollIndex, rolls);
    }
    else {
        // Basic frame
        return scoreBasicFrame(rolls, rollIndex);
    }
}
function scoreBasicFrame(rolls, rollIndex) {
    const frameScore = sumOfNRolls(rolls, rollIndex, 2);
    return { frameScore, numberOfRollsInFrame: 2 };
}
function scoreSpare(rollIndex, rolls) {
    let numberOfRollsInFrame;
    const lastFrame = rollIndex + 3 === rolls.length;
    if (lastFrame) {
        numberOfRollsInFrame = 3;
    }
    else {
        numberOfRollsInFrame = 2;
    }
    const frameScore = 10 + sumOfNRolls(rolls, rollIndex + 2, 1);
    return { frameScore, numberOfRollsInFrame };
}
function scoreStrike(rolls, rollIndex) {
    let frameScore;
    const lastFrame = rollIndex + 3 === rolls.length;
    let numberOfRollsInFrame;
    if (lastFrame) {
        numberOfRollsInFrame = 3;
    }
    else {
        numberOfRollsInFrame = 1;
    }
    frameScore = sumOfNRolls(rolls, rollIndex, 3);
    return { frameScore, numberOfRollsInFrame };
}
function sumOfNRolls(rolls, from, n) {
    const nRolls = getNRolls(rolls, from, n);
    return sum(nRolls);
}
function getNRolls(rolls, from, n) {
    const to = from + n;
    return rolls.slice(from, to);
}
function isSpare(rolls, rollIndex) {
    return rolls[rollIndex] + rolls[rollIndex + 1] === 10;
}
function isStrike(rolls, rollIndex) {
    return rolls[rollIndex] === 10;
}
describe("scoreGame()", () => {
    it("handles the acceptance test example", () => {
        const frames = [
            [1, 4],
            [4, 5],
            [6, 4],
            [5, 5],
            [10],
            [0, 1],
            [7, 3],
            [6, 4],
            [10],
            [2, 8, 6]
        ];
        const expected = 133;
        expect(scoreGame(frames)).toEqual(expected);
    });
    describe("with a basic frame", () => {
        it("adds the rolls", () => {
            const frames = [[1, 4], [2, 4]];
            const expected = 11;
            expect(scoreGame(frames)).toEqual(expected);
        });
    });
    describe("with a gutter game", () => {
        it("scores all frames 0", () => {
            const frames = [[0, 0], [0, 0]];
            const expected = 0;
            expect(scoreGame(frames)).toEqual(expected);
        });
    });
    describe("with a spare", () => {
        it("adds the rolls plus the first roll from the next frame", () => {
            const game = [[1, 9], [2, 4]];
            const expected = 18;
            expect(scoreGame(game)).toEqual(expected);
        });
    });
    describe("with a spare in the last frame", () => {
        it("adds the rolls plus the third roll from the current frame", () => {
            const game = [[1, 8], [3, 7, 2]];
            const expected = 21;
            expect(scoreGame(game)).toEqual(expected);
        });
    });
    describe("with a strike", () => {
        it("adds the rolls plus the first two rolls from the next frame", () => {
            const game = [[10], [2, 3], [1, 0]];
            const expected = 21;
            expect(scoreGame(game)).toEqual(expected);
        });
    });
    describe("with a strike in the last frame", () => {
        it("adds the 3 rolls in the current frame", () => {
            const game = [[4, 5], [10, 2, 3]];
            const expected = 24;
            expect(scoreGame(game)).toEqual(expected);
        });
    });
    describe("with a perfect game", () => {
        it("handles the acceptance test example", () => {
            const frames = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
            const expected = 300;
            expect(scoreGame(frames)).toEqual(expected);
        });
    });
});
describe("sum()", () => {
    it("returns the sum of the given array elements", () => {
        expect(sum([1, 2, 3])).toBe(6);
    });
});
//# sourceMappingURL=bowlingScore.spec.js.map