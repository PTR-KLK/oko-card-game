import React from "react";

const EndGame = ({ winner, startGame, resetGame }) => {
  return (
    <section className="menu menu--end">
      <h1>Game Over</h1>
      {winner[0] === 0 ? null : winner.length > 1 ? (
        <h3>Players {winner.join(", ")} Tied</h3>
      ) : (
        <h3>Player {winner[0]} Won</h3>
      )}
      <nav>
        <button className={"actionButton"} onClick={startGame}>
          New Game
        </button>
        <button className={"actionButton"} onClick={resetGame}>
          Main Menu
        </button>
      </nav>
    </section>
  );
};

export default EndGame;
