import React, { useState, useEffect, useCallback } from "react";

import "./App.css";

const initialPlayerStats = {
  active: true,
  cards: [],
  points: 0,
  draws: 0,
  playerLost: false,
  playerWon: false,
};

function App() {
  const [gameStatus, setGameStatus] = useState(false);
  const [deckId, setDeckId] = useState("");
  const [player, setPlayer] = useState({...initialPlayerStats});

  const changeValue = (obj) => {
    let newObj = {};

    switch (obj.value) {
      case "JACK":
        newObj = { ...obj, value: 2 };
        break;
      case "QUEEN":
        newObj = { ...obj, value: 3 };
        break;
      case "KING":
        newObj = { ...obj, value: 4 };
        break;
      case "ACE":
        newObj = { ...obj, value: 11 };
        break;
      default:
        newObj = obj;
    }

    return newObj;
  };

  const shuffleCards = () => {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((response) => response.json())
      .then((data) => setDeckId(data.deck_id));
  };

  const drawCards = (num) => {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`)
      .then((response) => response.json())
      .then((data) => {
        const currDraw = data.cards;
        const currPoints = currDraw
          .map((e) => changeValue(e))
          .map((e) => parseInt(e.value))
          .reduce((total,curr) => {return total += curr},0);
        setPlayer({
          ...player,
          cards: [...player.cards, ...currDraw],
          points: player.points + parseInt(currPoints),
        });
      });
  };

  const startGame = () => {
    shuffleCards();
    setPlayer({...initialPlayerStats});
    setGameStatus(true);
  };

  const drawPair = () => {
    drawCards(2);
    setPlayer({ ...player, draws: player.draws++ });
  };

  const drawCard = () => {
    drawCards(1);
    setPlayer({ ...player, draws: player.draws++ });
  };

  const fold = () => {
    setPlayer({ ...player, active: false });
  };

  const updateGame = useCallback(() => {
    if (player.points >= 22 && player.draws >= 2) {
      setPlayer({
        active: player.active,
        cards: player.cards,
        playerWon: player.playerWon,
        points: player.points,
        draws: player.draws,
        playerLost: true,
      });
    }
    if (player.points === 21 || (player.points === 22 && player.draws === 1)) {
      setPlayer({
        active: player.active,
        cards: player.cards,
        playerWon: true,
        points: player.points,
        draws: player.draws,
        playerLost: player.playerLost,
      });
    }
  }, [
    player.active,
    player.playerWon,
    player.points,
    player.cards,
    player.draws,
    player.playerLost,
  ]);

  useEffect(() => {
    updateGame();
  }, [updateGame]);

  return (
    <div className="App">
      {gameStatus ? (
        <>
          {!player.active ? (
            <>
              <p>Game over.</p>
              <button onClick={startGame}>Start new game</button>
            </>
          ) : player.playerWon ? (
            <>
              <p>You won.</p>
              <button onClick={startGame}>Start new game</button>
            </>
          ) : player.playerLost ? (
            <>
              <p>Game over. You lost.</p>
              <button onClick={startGame}>Start new game</button>
            </>
          ) : player.draws === 0 ? (
            <button onClick={drawPair}>Draw pair</button>
          ) : (
            <>
              <button onClick={drawCard}>Draw</button>
              <button onClick={fold}>Fold</button>
            </>
          )}
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
      ) : (
        <button onClick={startGame}>Start game</button>
      )}
    </div>
  );
}

export default App;
