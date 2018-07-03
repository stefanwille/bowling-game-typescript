function scoreGame(frames) {
  const scoredFrames = [];
  frames.forEach((frame, index) => {
    const score = totalScoreForFrame(frame, index, scoredFrames, frames);
    const scoredFrame = {
      rolls: frame.rolls,
      score
    };
    scoredFrames.push(scoredFrame);
  });

  return scoredFrames;
}

function totalScoreForFrame(frame, index, scoredFrames, frames) {
  const score =
    previousScore(index, frames, scoredFrames) +
    frameScore(frame, index, scoredFrames, frames);
  return score;
}

function frameScore(frame, index, scoredFrames, frames) {
  if (isStrike(frame)) {
    return 10 + strikeBonus(frame, index, frames);
  } else if (isSpare(frame)) {
    return 10 + spareBonus(frame, index, frames);
  } else {
    // Basic frame
    return sum(frame.rolls);
  }
}

function previousScore(index, frame, scoredFrames) {
  return isFirstFrame(index) ? 0 : scoredFrames[index - 1].score;
}
function isFirstFrame(index) {
  return index === 0;
}

function isStrike(frame) {
  return frame.rolls[0] === 10;
}

function isSpare(frame) {
  return frame.rolls[0] + frame.rolls[1] === 10;
}

function strikeBonus(frame, index, frames) {
  const nextFrameRolls =
    index + 1 < frames.length ? frames[index + 1].rolls : [];
  return nextFrameRolls[0] + nextFrameRolls[1];
}

function spareBonus(frame, index, frames) {
  if (isLastFrame(index, frames)) {
    return frame.rolls[2];
  } else {
    const nextFrameRolls = frames[index + 1].rolls;
    return nextFrameRolls[0];
  }
}

function sum(a) {
  return a.reduce((accu, currentValue) => accu + currentValue, 0);
}

function isLastFrame(index, frames) {
  return index + 1 >= frames.length;
}

describe("scoreGame()", () => {
  it("handles the acceptance test example", () => {
    const frames = [
      {
        rolls: [1, 4]
      },
      {
        rolls: [4, 5]
      },
      {
        rolls: [6, 4]
      },
      {
        rolls: [5, 5]
      },
      {
        rolls: [10]
      },
      {
        rolls: [0, 1]
      },
      {
        rolls: [7, 3]
      },
      {
        rolls: [6, 4]
      },
      {
        rolls: [10]
      },
      {
        rolls: [2, 8, 6]
      }
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
      const frames = [
        {
          rolls: [1, 4]
        },
        {
          rolls: [2, 4]
        }
      ];
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

  describe("with a spare", () => {
    it("adds the rolls plus the first roll from the next frame", () => {
      const game = [
        {
          rolls: [1, 9]
        },
        {
          rolls: [2, 4]
        }
      ];
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

  describe("with a strike", () => {
    it("adds the rolls plus the first two rolls from the next frame", () => {
      const game = [
        {
          rolls: [10]
        },
        {
          rolls: [0, 1]
        }
      ];
      const expected = [
        {
          rolls: [10],
          score: 11
        },
        {
          rolls: [0, 1],
          score: 12
        }
      ];

      expect(scoreGame(game)).toEqual(expected);
    });
  });
});

describe("spareBonus()", () => {
  describe("when scoring the non-last frame", () => {
    it("returns the first roll of the next frame", () => {
      expect(
        spareBonus({ rolls: [2, 8] }, 0, [{ rolls: [2, 8] }, { rolls: [1, 2] }])
      ).toBe(1);
    });
  });

  describe("when scoring the non-last frame", () => {
    it("returns the last roll", () => {
      expect(spareBonus({ rolls: [2, 8, 6] }, 0, [{ rolls: [2, 8, 6] }])).toBe(
        6
      );
    });
  });
});
