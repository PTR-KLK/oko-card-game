import React from "react";
import backImage from "../back.png";

const DrawButton = ({ draw }) => {
  return (
    <figure>
      <button className="playerHand__drawCard" onClick={draw}>
        <img src={backImage} alt="Card's back" />
      </button>
    </figure>
  );
};

const PlayerHand = ({ player, drawPair, drawCard, fold }) => {
  return (
    <section className="playerHand">
      <h1>Player {player.id}</h1>
      {player.draws === 0 ? (
        <DrawButton draw={drawPair} />
      ) : (
        <DrawButton draw={drawCard} />
      )}

      <ul className="cardList">
        {player.cards.map((e) => {
          return (
            <li key={e.code}>
              <img src={e.image} alt={`${e.suit} ${e.value}`} />
            </li>
          );
        })}
      </ul>
      <nav>
        <section className="playerHand__playerStats">
          <p>Points: {player.points}</p>
          <p>Draws: {player.draws}</p>
        </section>
        <button
          className={"actionButton"}
          onClick={fold}
          disabled={player.draws === 0}
        >
          Fold
        </button>
      </nav>
    </section>
  );
};

export default PlayerHand;
