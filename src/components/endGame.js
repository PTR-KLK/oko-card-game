import React from "react";

const EndGame = ({ winner, startGame, resetGame }) => {
  return (
    <>
      <p>Game over.</p>
      {winner[0] === 0 ? null : winner.length > 1 ? (
        <p>Players {winner.join(", ")} tied.</p>
      ) : (
        <p>Player {winner[0]} won.</p>
      )}
      <button onClick={startGame}>Start new game</button>
      <button onClick={resetGame}>Main menu</button>
    </>
  );
};

export default EndGame;
