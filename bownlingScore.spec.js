function scoreGame(game) {
  const scoredGame = [];
  game.forEach((frame, index) => {
    let frameBonus = 0;
    if (isStrike(frame)) {
      frameBonus = strikeBonus(frame, index, game);
    } else if (isSpare(frame)) {
      frameBonus = spareBonus(frame, index, game);
    } else {
      // Basic frame
      frameBonus = 0;
    }
    const previousScore = index > 0 ? scoredGame[index - 1].score : 0;
    const score = sum(frame.rolls) + frameBonus + previousScore;

    const scoredFrame = {
      rolls: frame.rolls,
      score
    };
    scoredGame.push(scoredFrame);
  });

  return scoredGame;
}

function isStrike(frame) {
  return frame.rolls[0] === 10;
}

function isSpare(frame) {
  return frame.rolls[0] + frame.rolls[1] === 10;
}

function strikeBonus(frame, index, game) {
  const nextFrameRolls = index + 1 < game.length ? game[index + 1].rolls : [];
  return nextFrameRolls[0] + nextFrameRolls[1];
}

function spareBonus(frame, index, game) {
  if (isLastFrame(index, game)) {
    return 0;
  } else {
    const nextFrameRolls = game[index + 1].rolls;
    return nextFrameRolls[0];
  }
}

function sum(a) {
  return a.reduce((accu, currentValue) => accu + currentValue, 0);
}

function isLastFrame(index, game) {
  return index + 1 >= game.length;
}

describe("scoreGame()", () => {
  it("handles the acceptance test example", () => {
    const game = [
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

    expect(scoreGame(game)).toEqual(expected);
  });

  describe("with a basic frame", () => {
    it("adds the rolls", () => {
      const game = [
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

      expect(scoreGame(game)).toEqual(expected);
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
        spareBonus([2, 8], 0, [{ rolls: [2, 8] }, { rolls: [1, 2] }])
      ).toBe(1);
    });
  });

  describe("when scoring the non-last frame", () => {
    it("returns 0, because the bonus was added before via sum()", () => {
      expect(spareBonus([2, 8, 6], 0, [{ rolls: [2, 8, 6] }])).toBe(0);
    });
  });

  // {
  //   rolls: [2, 8, 6]
  // }
});
