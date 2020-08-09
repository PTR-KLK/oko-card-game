import React from "react";
import "../App.css";

const Menu = ({ startGame, playerNum, setPlayerNum, isError }) => {
  return (
    <section className="menu">
      <h1>Oko Card Game</h1>
      {isError ? (
        <p className="menu__errorMessage">
          Error with fetching data. <br /> Try again later.
        </p>
      ) : null}
      <label>Number of players: {playerNum}</label>
      <input
        type="range"
        min={1}
        max={4}
        step={1}
        value={playerNum}
        onChange={(event) => setPlayerNum(parseInt(event.target.value))}
      />
      <button className={"actionButton"} onClick={startGame}>
        Start game
      </button>
    </section>
  );
};

export default Menu;
