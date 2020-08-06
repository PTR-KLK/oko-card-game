import React from "react";

const Menu = ({ startGame, playerNum, setPlayerNum }) => {
  return (
    <>
      <button onClick={startGame}>Start game</button>
      <label>
        Number of players: {playerNum}
        <input
          type="range"
          min={1}
          max={4}
          step={1}
          value={playerNum}
          onChange={(event) => setPlayerNum(parseInt(event.target.value))}
        />
      </label>
    </>
  );
};

export default Menu;
