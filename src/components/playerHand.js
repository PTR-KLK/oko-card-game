import React from "react";

const PlayerHand = ( {player, drawPair, drawCard, fold} ) => {
    return (
        <>
        {player.draws === 0 ? (
            <button onClick={drawPair}>Draw pair</button>
          ) : (
            <>
              <button onClick={drawCard}>Draw</button>
              <button onClick={fold}>Fold</button>
            </>
          )}
          <h2>Player {player.id}</h2>
          <p>Points: {player.points}</p>
          <p>Draws: {player.draws}</p>
          <ul className="cardList">
            {player.cards.map((e) => {
              return (
                <li key={e.code}>
                  <img src={e.image} alt={`${e.suit} ${e.value}`} />
                </li>
              );
            })}
          </ul>
        </> 
    );
}

export default PlayerHand;