
function scoreGame(game) {
  const scoredGame = [];
  game.forEach((frame, index) => {
    const previousScore = index > 0 ? scoredGame[index - 1].score : 0;
    let score = 0;
    if (frame.roles[0] === 10) {
      // Strike
      const nextFrame = game[index + 1];
      score =
        sum(frame.roles) +
        nextFrame.roles[0] +
        nextFrame.roles[1] +
        previousScore;
    } else if (frame.roles[0] + frame.roles[1] === 10) {
      // Spare
      const nextFrame = game[index + 1];
      score = sum(frame.roles) + nextFrame.roles[0] + previousScore;
    } else {
      // Basic frame
      score = sum(frame.roles) + previousScore;
    }
    const scoredFrame = {
      roles: frame.roles,
      score
    };
    scoredGame.push(scoredFrame);
  });

  return scoredGame;
}

function sum(a) {
  return a.reduce((accu, currentValue) => accu + currentValue, 0);
}

describe("scoreGame()", () => {
  it("acceptance test", () => {
    const game = [
      {
        roles: [1, 4]
      },
      {
        roles: [4, 5]
      },
      {
        roles: [6, 4]
      },
      {
        roles: [5, 5]
      },
      {
        roles: [10]
      },
      {
        roles: [0, 1]
      },
      {
        roles: [7, 3]
      },
      {
        roles: [6, 4]
      },
      {
        roles: [10]
      },
      {
        roles: [2, 8, 6]
      }
    ];

    const expected = [
      {
        roles: [1, 4],
        score: 5
      },
      {
        roles: [4, 5],
        score: 14
      },
      {
        roles: [6, 4],
        score: 29
      },
      {
        roles: [5, 5],
        score: 49
      },
      {
        roles: [10],
        score: 60
      },
      {
        roles: [0, 1],
        score: 61
      },
      {
        roles: [7, 3],
        score: 77
      },
      {
        roles: [6, 4],
        score: 97
      },
      {
        roles: [10],
        score: 117
      },
      {
        roles: [2, 8, 6],
        score: 133
      }
    ];

    expect(scoreGame(game)).toEqual(expected);
  });

  describe("with a basic frame", () => {
    it("adds the roles", () => {
      const game = [
        {
          roles: [1, 4]
        },
        {
          roles: [2, 4]
        }
      ];
      const expected = [
        {
          roles: [1, 4],
          score: 5
        },
        {
          roles: [2, 4],
          score: 11
        }
      ];

      expect(scoreGame(game)).toEqual(expected);
    });
  });

  describe("with a spare", () => {
    it("adds the roles plus the first role from the next frame", () => {
      const game = [
        {
          roles: [1, 9]
        },
        {
          roles: [2, 4]
        }
      ];
      const expected = [
        {
          roles: [1, 9],
          score: 12
        },
        {
          roles: [2, 4],
          score: 18
        }
      ];

      expect(scoreGame(game)).toEqual(expected);
    });
  });

  describe("with a strike", () => {
    it("adds the roles plus the first two roles from the next frame", () => {
      const game = [
        {
          roles: [10]
        },
        {
          roles: [0, 1]
        }
      ];
      const expected = [
        {
          roles: [10],
          score: 11
        },
        {
          roles: [0, 1],
          score: 12
        }
      ];

      expect(scoreGame(game)).toEqual(expected);
    });
  });
});
