function flatten(array) {
  return array.reduce((acc, val) => acc.concat(val), []);
}

function sum(array) {
  return array.reduce((accu, currentValue) => accu + currentValue);
}

function scoreGame(inputRolls) {
  const rolls = flatten(inputRolls);
  const scoredFrames = [];
  let rollIndex = 0;
  while (rollIndex < rolls.length) {
    const { frameScore, frameRolls } = scoreFrame(rolls, rollIndex);
    const score = frameScore + previousScore(scoredFrames);
    const scoredFrame = {
      rolls: frameRolls,
      score: score
    };
    scoredFrames.push(scoredFrame);
    rollIndex += frameRolls.length;
  }
  return scoredFrames;
}

function scoreFrame(rolls, rollIndex) {
  let frameRolls = null;
  let frameScore = 0;
  if (isStrike(rolls, rollIndex)) {
    const lastFrame = rollIndex + 3 === rolls.length;
    if (lastFrame) {
      frameRolls = getNRolls(rolls, rollIndex, 3);
      frameScore = sum(frameRolls);
    } else {
      frameRolls = getNRolls(rolls, rollIndex, 1);
      frameScore = 10 + sum(getNRolls(rolls, rollIndex + 1, 2));
    }
  } else if (isSpare(rolls, rollIndex)) {
    const lastFrame = rollIndex + 3 === rolls.length;
    if (lastFrame) {
      frameRolls = getNRolls(rolls, rollIndex, 3);
      frameScore = 10 + rolls[rollIndex + 2];
    } else {
      frameRolls = getNRolls(rolls, rollIndex, 2);
      frameScore = sum(frameRolls) + rolls[rollIndex + 2];
    }
  } else {
    // Basic frame
    frameRolls = getNRolls(rolls, rollIndex, 2);
    frameScore = sum(frameRolls);
  }
  return { frameScore, frameRolls };
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

function previousScore(scoredFrames) {
  if (scoredFrames.length === 0) {
    return 0;
  } else {
    return scoredFrames[scoredFrames.length - 1].score;
  }
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
    const expected = [
      {
        rolls: [1, 4],
        score: 5
      },
      {
        rolls: [4, 5],
        score: 14
      },
      {
        rolls: [6, 4],
        score: 29
      },
      {
        rolls: [5, 5],
        score: 49
      },
      {
        rolls: [10],
        score: 60
      },
      {
        rolls: [0, 1],
        score: 61
      },
      {
        rolls: [7, 3],
        score: 77
      },
      {
        rolls: [6, 4],
        score: 97
      },
      {
        rolls: [10],
        score: 117
      },
      {
        rolls: [2, 8, 6],
        score: 133
      }
    ];
    expect(scoreGame(frames)).toEqual(expected);
  });

  describe("with a basic frame", () => {
    it("adds the rolls", () => {
      const frames = [[1, 4], [2, 4]];
      const expected = [
        {
          rolls: [1, 4],
          score: 5
        },
        {
          rolls: [2, 4],
          score: 11
        }
      ];
      expect(scoreGame(frames)).toEqual(expected);
    });
  });

  describe("with a gutter game", () => {
    it("scores all frames 0", () => {
      const frames = [[0, 0], [0, 0]];
      const expected = [
        {
          rolls: [0, 0],
          score: 0
        },
        {
          rolls: [0, 0],
          score: 0
        }
      ];
      expect(scoreGame(frames)).toEqual(expected);
    });
  });

  describe("with a spare", () => {
    it("adds the rolls plus the first roll from the next frame", () => {
      const game = [[1, 9], [2, 4]];
      const expected = [
        {
          rolls: [1, 9],
          score: 12
        },
        {
          rolls: [2, 4],
          score: 18
        }
      ];
      expect(scoreGame(game)).toEqual(expected);
    });
  });

  describe("with a spare in the last frame", () => {
    it("adds the rolls plus the third roll from the current frame", () => {
      const game = [[1, 8], [3, 7, 2]];
      const expected = [
        {
          rolls: [1, 8],
          score: 9
        },
        {
          rolls: [3, 7, 2],
          score: 21
        }
      ];
      expect(scoreGame(game)).toEqual(expected);
    });
  });

  describe("with a strike", () => {
    it("adds the rolls plus the first two rolls from the next frame", () => {
      const game = [[10], [2, 3], [1, 0]];
      const expected = [
        {
          rolls: [10],
          score: 15
        },
        {
          rolls: [2, 3],
          score: 20
        },
        {
          rolls: [1, 0],
          score: 21
        }
      ];
      expect(scoreGame(game)).toEqual(expected);
    });
  });

  describe("with a strike in the last frame", () => {
    it("adds the 3 rolls in the current frame", () => {
      const game = [[4, 5], [10, 2, 3]];
      const expected = [
        {
          rolls: [4, 5],
          score: 9
        },
        {
          rolls: [10, 2, 3],
          score: 24
        }
      ];
      expect(scoreGame(game)).toEqual(expected);
    });
  });

  describe("with a perfect game", () => {
    it("handles the acceptance test example", () => {
      const frames = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
      const expected = [
        {
          rolls: [10],
          score: 30
        },
        {
          rolls: [10],
          score: 60
        },
        {
          rolls: [10],
          score: 90
        },
        {
          rolls: [10],
          score: 120
        },
        {
          rolls: [10],
          score: 150
        },
        {
          rolls: [10],
          score: 180
        },
        {
          rolls: [10],
          score: 210
        },
        {
          rolls: [10],
          score: 240
        },
        {
          rolls: [10],
          score: 270
        },
        {
          rolls: [10, 10, 10],
          score: 300
        }
      ];
      expect(scoreGame(frames)).toEqual(expected);
    });
  });
});

describe("sum()", () => {
  it("returns the sum of the given array elements", () => {
    expect(sum([1, 2, 3])).toBe(6);
  });
});

describe("previousScore()", () => {
  it("returns the score of the last frame in the given scored frames", () => {
    expect(previousScore([{ rolls: [1, 4], score: 5 }])).toBe(5);
  });

  it("returns 0 if there are no frames", () => {
    expect(previousScore([])).toBe(0);
  });
});
