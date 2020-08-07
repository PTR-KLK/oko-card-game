import React from "react";

const PlayerLose = ({
  currPlayerId,
  nextPlayer,
  playerNum,
  startGame,
  resetGame,
}) => {
  return (
    <section className="menu menu--end">
      <h1>Lose</h1>
      <h3>Player {currPlayerId} Lost</h3>
      <nav>
        {playerNum > 1 ? (
          <button className={"actionButton"} onClick={nextPlayer}>
            Next
          </button>
        ) : (
          <nav>
            <button className={"actionButton"} onClick={startGame}>
              New Game
            </button>
            <button className={"actionButton"} onClick={resetGame}>
              Main Menu
            </button>
          </nav>
        )}
      </nav>
    </section>
  );
};

export default PlayerLose;
