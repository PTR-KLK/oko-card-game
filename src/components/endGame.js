import React from "react";

const EndGame = ({ winner, startGame, resetGame }) => {
  return (
    <>
      <p>Game over.</p>
      {winner === 0 ? null : <p>Player {winner} won.</p>}
      <button onClick={startGame}>Start new game</button>
      <button onClick={resetGame}>Main menu</button>
    </>
  );
};

export default EndGame;
