import React from "react";
import backImage from "../back.png";

const DrawButton = ({ draw, isDisabled }) => {
  return (
    <figure>
      <button
        className="playerHand__drawCard"
        onClick={draw}
        disabled={isDisabled}
      >
        <img src={backImage} alt="Card's back" />
      </button>
    </figure>
  );
};

const PlayerHand = ({ player, drawCards, nextPlayer, gameStatus }) => {
  return (
    <section className="playerHand">
      <h1>
        Player {player.id} {player.bot ? "(Bot)" : null}
      </h1>
      {player.draws === 0 ? (
        <DrawButton draw={() => drawCards(2)} />
      ) : (
        <DrawButton
          draw={() => drawCards(1)}
          isDisabled={
            gameStatus === "lose" || gameStatus === "win" || player.bot
          }
        />
      )}

      <section className="playerHand__cardListContainer">
        {player.cards.length === 0 ? null : (
          <ul className="playerHand__cardList">
            {player.cards.map((e) => {
              return (
                <li key={e.code}>
                  <img src={e.image} alt={`${e.suit} ${e.value}`} />
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <nav>
        <section className="playerHand__playerStats">
          <p>Points: {player.points}</p>
          <p>Draws: {player.draws}</p>
        </section>
        <button
          className={"actionButton"}
          onClick={nextPlayer}
          disabled={
            gameStatus === "lose" ||
            gameStatus === "win" ||
            player.draws === 0 ||
            player.bot
          }
        >
          Fold
        </button>
      </nav>
    </section>
  );
};

export default PlayerHand;
