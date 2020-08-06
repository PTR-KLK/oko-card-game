import React, { useState, useEffect, useCallback } from "react";
import EndGame from "./components/endGame";
import Menu from "./components/menu";
import PlayerHand from "./components/playerHand";
import "./App.css";

const initialPlayerState = {
  id: 1,
  cards: [],
  points: 0,
  draws: 0,
  lost: false,
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
  const [gameStatus, setGameStatus] = useState("initial");
  const [deckId, setDeckId] = useState("");
  const [players, setPlayers] = useState([{ ...initialPlayerState },{ ...initialPlayerState }]);
  const [currPlayerId, setCurrPlayerId] = useState(1);
  const [winner, setWinner] = useState(0);

  const startGame = () => {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((response) => response.json())
      .then((data) => setDeckId(data.deck_id));
    clearGame();
    setGameStatus("pending");
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

        playersTemp[currPlayerIdx] = {
          ...playersTemp[currPlayerIdx],
          cards: [...playersTemp[currPlayerIdx].cards, ...currDraw],
          points: playersTemp[currPlayerIdx].points + parseInt(currPoints),
          draws: playersTemp[currPlayerIdx].draws + 1,
        };

        setPlayers([...playersTemp]);
      });
  };

  const clearGame = () => {
    const newPlayers = [];
    for (let i = 1; i < playerNum + 1; i++) {
      newPlayers.push({ ...initialPlayerState, id: i });
    }
    setPlayers([...newPlayers]);
    setCurrPlayerId(1);
    setWinner(0);
  };

  const resetGame = () => {
    clearGame();
    setGameStatus("initial");
  };

  const drawPair = () => {
    drawCards(2);
  };

  const drawCard = () => {
    drawCards(1);
  };

  const goToNextPlayer = useCallback((playerIdx) => {
    if (playerIdx < players.length - 1) {
      setCurrPlayerId(players[playerIdx + 1].id);
    } else {
      setCurrPlayerId(1); // reset current player id to prevent infinite loop
      setGameStatus("ended");
    }
  },[players]);

  const fold = () => {
    const currPlayerIdx = players.findIndex((e) => e.id === currPlayerId);

    // game logic part here, because you can end game with last plalyer folding game
    goToNextPlayer(currPlayerIdx);
  };

  const updateGame = useCallback(() => {
    const playersCopy = [...players];
    const alivePlayers = players.filter((e) => e.lost === false);
    const currPlayer = players.find((e) => e.id === currPlayerId);
    const currPlayerIdx = players.findIndex((e) => e.id === currPlayerId);

    if (
      currPlayer.points === 21 ||
      (currPlayer.points === 22 && currPlayer.draws === 1)
    ) {
      setGameStatus("ended");
      setWinner(currPlayerId);
    }

    // Singleplayer specific game logic - number of players is equal 1

    if (playerNum === 1) {
      if (currPlayer.points > 21 && currPlayer.draws > 1) {
        setGameStatus("ended");
      }
    }

    // Multiplayer specific game logic - number of players is greater than 1

    if (playerNum > 1) {
      if (alivePlayers.length === 1) {
        setGameStatus("ended");
        setWinner(currPlayerId);
      }

      if (currPlayer.points > 21 && currPlayer.draws > 1) {
        playersCopy[currPlayerIdx] = {
          ...playersCopy[currPlayerIdx],
          lost: true,
        };

        setPlayers([...playersCopy]);

        goToNextPlayer(currPlayerIdx);
      
      }
    }
  }, [players, currPlayerId, playerNum, goToNextPlayer]);

  useEffect(() => {
    updateGame();
  }, [updateGame]);

  return (
    <div className="App">
      {gameStatus === "initial" ? (
        <Menu
          startGame={startGame}
          playerNum={playerNum}
          setPlayerNum={setPlayerNum}
        />
      ) : gameStatus === "ended" ? (
        <EndGame winner={winner} startGame={startGame} resetGame={resetGame} />
      ) : (
        <PlayerHand
          player={players.find((e) => e.id === currPlayerId)}
          drawPair={drawPair}
          drawCard={drawCard}
          fold={fold}
        />
      )}
    </div>
  );
}

export default App;
