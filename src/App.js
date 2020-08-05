import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const initialPlayerStats = {
  id: 1,
  cards: [],
  points: 0,
  draws: 0,
  playerLost: false,
};

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

function App() {
  const [playerNum, setPlayerNum] = useState(1);
  const [remainingPlayers, setRemainingPlayers] = useState(1);
  const [gameStatus, setGameStatus] = useState("initial");
  const [deckId, setDeckId] = useState("");
  const [player, setPlayer] = useState({ ...initialPlayerStats });
  const [playerArr, setPlayerArr] = useState([]);
  const [winner, setWinner] = useState(0);

  const drawCards = (num) => {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`)
      .then((response) => response.json())
      .then((data) => {
        const currDraw = data.cards;
        const currPoints = currDraw
          .map((e) => changeValue(e))
          .map((e) => parseInt(e.value))
          .reduce((total, curr) => {
            return (total += curr);
          }, 0);
        setPlayer({
          ...player,
          cards: [...player.cards, ...currDraw],
          points: player.points + parseInt(currPoints),
        });
      });
  };

  const clearGame = () => {
    setPlayer({ ...initialPlayerStats });
    setRemainingPlayers(playerNum);
    setPlayerArr([]);
    setWinner(0);
  };

  const startGame = () => {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((response) => response.json())
      .then((data) => setDeckId(data.deck_id));
    clearGame();
    setGameStatus("pending");
  };

  const resetGame = () => {
    clearGame();
    setGameStatus("initial");
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
    setRemainingPlayers(remainingPlayers - 1);
    setPlayerArr([...playerArr, player]);
    if (remainingPlayers >= 2) {
      setPlayerArr([...playerArr, { ...player, playerLost: true }]);
      setPlayer({ ...initialPlayerStats, id: player.id + 1 });
    }
  };

  const endGame = useCallback(() => {
    if (remainingPlayers === 0) {
      setGameStatus("ended");
      const filteredPlayerArr = playerArr.filter((e) => e.playerLost !== true);
      if (filteredPlayerArr.length === 1) {
        setWinner(playerArr[0].id);
      }
      if (filteredPlayerArr.length > 1) {
        setWinner(
          filteredPlayerArr
            .map((e) => ({ points: 21 - e.points, id: e.id }))
            .sort((a, b) => a.points - b.points)[0].id
        );
      }
    }
    if (player.points === 21 || (player.points === 22 && player.draws === 1)) {
      setGameStatus("won");
      setWinner(player.id);
    }
    if (remainingPlayers > 0 && player.points >= 22 && player.draws >= 2) {
      setRemainingPlayers(remainingPlayers - 1);
      if (remainingPlayers >= 2) {
        setPlayerArr([...playerArr, { ...player, playerLost: true }]);
        setPlayer({ ...initialPlayerStats, id: player.id + 1 });
      }
    }
  }, [remainingPlayers, player, playerArr]);

  useEffect(() => {
    endGame();
  }, [endGame]);

  return (
    <div className="App">
      {gameStatus !== "initial" ? (
        <>
          {gameStatus === "ended" ? (
            <>
              <p>Game over.</p>
              {winner !== 0 ? <p>Player {winner} won.</p> : null}
              <button onClick={startGame}>Start new game</button>
              <button onClick={resetGame}>Main menu</button>
            </>
          ) : gameStatus === "won" ? (
            <>
              <p>Player {winner} won.</p>
              <button onClick={startGame}>Start new game</button>
              <button onClick={resetGame}>Main menu</button>
            </>
          ) : player.draws === 0 ? (
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
      ) : (
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
              onChange={(event) => setPlayerNum(event.target.value)}
            />
          </label>
        </>
      )}
    </div>
  );
}

export default App;
