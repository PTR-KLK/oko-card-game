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
  bot: false,
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
  const [currPlayer, setCurrPlayer] = useState({ ...initialPlayerState });
  const [winner, setWinner] = useState([0]); // winner is an array because players can tie
  const [isError, setError] = useState(false);

  const startGame = () => {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((response) => response.json())
      .then((data) => {
        setError(false);
        setDeckId(data.deck_id);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(true);
        setGameStatus("initial");
      });

    const newPlayers = [];
    for (let i = 1; i < playerNum + 1; i++) {
      newPlayers.push({ ...initialPlayerState, id: i });
    }

    if (newPlayers.length === 1) {
      newPlayers.push({ ...initialPlayerState, id: 2, bot: true });
    }

    setPlayers([...newPlayers]);
    setCurrPlayer({ ...initialPlayerState });
    setWinner([0]);
    setGameStatus("pending");
  };

  const resetGame = () => {
    setPlayers([]);
    setPlayerNum(1);
    setGameStatus("initial");
    setDeckId("");
    setCurrPlayer({ ...initialPlayerState });
    setWinner([0]);
  };

  const drawCards = useCallback(
    (player, num) => {
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

          updatePlayer(player, currDraw, currPoints);
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(true);
          resetGame();
        });
    },
    [deckId]
  );

  const updatePlayer = (player, draw, points) => {
    setCurrPlayer({
      ...player,
      cards: [...player.cards, ...draw],
      points: player.points + parseInt(points),
      draws: player.draws + 1,
    });
  };

  const updatePlayers = useCallback((arr, obj) => {
    const arrTemp = [...arr];
    const objIdx = arrTemp.findIndex((e) => e.id === obj.id);

    arrTemp[objIdx] = { ...obj };

    setPlayers([...arrTemp]);
  }, []);

  const nextPlayer = useCallback(() => {
    if (winner[0] === 0 && currPlayer.id === players.length) {
      setGameStatus("win");
      const playerMaxPoints = players
        .filter((e) => e.lost === false)
        .sort((a, b) => b.points - a.points)[0];
      setWinner(
        players
          .filter((e) => e.points === playerMaxPoints.points)
          .map((e) => e.id)
      );
    } else if (players.filter((e) => e.lost === false).length === 1) {
      setGameStatus("win");
      setWinner([players.find((e) => e.lost === false).id]);
    } else {
      setGameStatus("pending");
      setCurrPlayer(
        players[players.findIndex((e) => e.id === currPlayer.id) + 1]
      );
    }
  }, [players, currPlayer.id, winner]);

  const updateGame = useCallback(() => {
    if (players.length > 0) {
      if (
        (currPlayer.id !== winner[0] && currPlayer.points === 21) ||
        (currPlayer.id !== winner[0] &&
          currPlayer.points === 22 &&
          currPlayer.draws === 1)
      ) {
        setGameStatus("win");
        setWinner([currPlayer.id]);
      }

      if (!currPlayer.lost && currPlayer.points > 21 && currPlayer.draws > 1) {
        setGameStatus("lose");
        setCurrPlayer({ ...currPlayer, lost: true });
      }

      const currPlayerIdx = players.findIndex((e) => e.id === currPlayer.id);

      if (
        currPlayer.points !== players[currPlayerIdx].points ||
        currPlayer.lost !== players[currPlayerIdx].lost
      ) {
        updatePlayers(players, currPlayer);
      }
    }
  }, [players, currPlayer, updatePlayers, winner]);

  useEffect(() => {
    updateGame();

    // bot logic
    if (players.length > 0) {
      if (currPlayer.bot === true) {
        if (currPlayer.draws === 0) {
          drawCards(currPlayer, 2);
        }
        if (
          currPlayer.points !== 22 &&
          currPlayer.points !== 21 &&
          currPlayer.points < 20
        ) {
          const myVar = setTimeout(() => drawCards(currPlayer, 1), 1500);
          return () => clearTimeout(myVar);
        }

        if (winner[0] === 0 && currPlayer.points === 20) {
          nextPlayer();
        }
      }
    }
  }, [updateGame, players, currPlayer, drawCards, winner, nextPlayer]);

  return (
    <main className="app">
      {gameStatus === "initial" ? (
        <Menu
          startGame={startGame}
          playerNum={playerNum}
          setPlayerNum={setPlayerNum}
          isError={isError}
        />
      ) : (
        <>
          <PlayerHand
            player={currPlayer}
            drawCards={(num) => drawCards(currPlayer, num)}
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
              currPlayerId={currPlayer.id}
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
