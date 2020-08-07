import React, { useState, useEffect, useCallback } from "react";
import Menu from "./components/menu";
import PlayerHand from "./components/playerHand";
import PlayerLose from "./components/playerLose";
import PlayerWin from "./components/playerWin";
import "./App.css";

const initialPlayerState = {
  id: 1,
  cards: [],
  points: 0,
  draws: 0,
  lost: false,
};

export const changeValue = (obj) => {
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
  const [players, setPlayers] = useState([]);
  const [playerNum, setPlayerNum] = useState(1);
  const [gameStatus, setGameStatus] = useState("initial");
  const [deckId, setDeckId] = useState("");
  const [currPlayerId, setCurrPlayerId] = useState(1);
  const [winner, setWinner] = useState([0]); // winner is an array because players can tie

  const startGame = () => {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((response) => response.json())
      .then((data) => setDeckId(data.deck_id));

    const newPlayers = [];
    for (let i = 1; i < playerNum + 1; i++) {
      newPlayers.push({ ...initialPlayerState, id: i });
    }
    setPlayers([...newPlayers]);
    setCurrPlayerId(1);
    setWinner([0]);
    setGameStatus("pending");
  };

  const resetGame = () => {
    setPlayers([]);
    setPlayerNum(1);
    setGameStatus("initial");
    setDeckId("");
    setCurrPlayerId(1);
    setWinner([0]);
  };

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

        const playersTemp = [...players];
        const currPlayerIdx = playersTemp.findIndex(
          (e) => e.id === currPlayerId
        );

        updatePlayerStats({
          cards: [...playersTemp[currPlayerIdx].cards, ...currDraw],
          points: playersTemp[currPlayerIdx].points + parseInt(currPoints),
          draws: playersTemp[currPlayerIdx].draws + 1,
        });
      });
  };

  const updatePlayerStats = useCallback(
    (obj) => {
      const playersTemp = [...players];
      const currPlayerIdx = playersTemp.findIndex((e) => e.id === currPlayerId);

      playersTemp[currPlayerIdx] = {
        ...playersTemp[currPlayerIdx],
        ...obj,
      };

      setPlayers([...playersTemp]);
    },
    [players, currPlayerId]
  );

  const nextPlayer = () => {
    if (currPlayerId === players.length) {
      setGameStatus("win");
      const playerMaxPoints = players
        .filter((e) => e.lost === false)
        .sort((a, b) => b.points - a.points)[0];
      setWinner(
        players
          .filter((e) => e.points === playerMaxPoints.points)
          .map((e) => e.id)
      );
    } else if (
      players.filter((e) => e.lost === false).length === 1 &&
      playerNum > 1
    ) {
      setGameStatus("win");
      setWinner([currPlayerId + 1]);
    } else {
      setGameStatus("pending");
      setCurrPlayerId(currPlayerId + 1);
    }
  };

  const updateGame = useCallback(() => {
    const currPlayer = players.find((e) => e.id === currPlayerId);

    if (players.length > 0) {
      if (
        currPlayer.points === 21 ||
        (currPlayer.points === 22 && currPlayer.draws === 1)
      ) {
        setGameStatus("win");
        setWinner([currPlayerId]);
      }

      if (!currPlayer.lost && currPlayer.points > 21 && currPlayer.draws > 1) {
        setGameStatus("lose");
        updatePlayerStats({ lost: true });
      }
    }
  }, [players, currPlayerId, updatePlayerStats]);

  useEffect(() => {
    updateGame();
  }, [updateGame]);

  return (
    <main className="app">
      {gameStatus === "initial" ? (
        <Menu
          startGame={startGame}
          playerNum={playerNum}
          setPlayerNum={setPlayerNum}
        />
      ) : (
        <>
          <PlayerHand
            player={players.find((e) => e.id === currPlayerId)}
            drawCards={drawCards}
            nextPlayer={nextPlayer}
            gameStatus={gameStatus}
          />
          {gameStatus === "win" ? (
            <PlayerWin
              winner={winner}
              startGame={startGame}
              resetGame={resetGame}
            />
          ) : null}
          {gameStatus === "lose" ? (
            <PlayerLose
              currPlayerId={currPlayerId}
              nextPlayer={nextPlayer}
              playerNum={playerNum}
              startGame={startGame}
              resetGame={resetGame}
            />
          ) : null}
        </>
      )}
    </main>
  );
}

export default App;
