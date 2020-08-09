import React from "react";

const PlayerLose = ({
  currPlayerId,
  nextPlayer
}) => {
  return (
    <section className="menu menu--end">
      <h1>Lose</h1>
      <h3>Player {currPlayerId} Lost</h3>
      <nav>
        <button className={"actionButton"} onClick={nextPlayer}>
          Next
        </button>
      </nav>
    </section>
  );
};

export default PlayerLose;
