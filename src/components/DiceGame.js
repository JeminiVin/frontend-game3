import { useState, useEffect } from "react";
import axios from "axios";

export default function DiceGame() {
  const [username, setUsername] = useState("player1");
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(0);
  const [rollResult, setRollResult] = useState(null);
  const [message, setMessage] = useState("");
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    fetchBalance();
  }, [username]);

  const fetchBalance = async () => {
    const res = await axios.get(`http://localhost:5000/api/auth/balance/${username}`);
    setBalance(res.data.balance);
  };

  const rollDice = async () => {
    if (betAmount <= 0 || betAmount > balance) {
      setMessage("Invalid bet amount.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/roll-dice", { username, betAmount });
      setRollResult(res.data.roll);
      setBalance(res.data.newBalance);
      setMessage(res.data.win ? "You won!" : "You lost!");
      
      setGameHistory(prevHistory => [
        { roll: res.data.roll, win: res.data.win, bet: betAmount },
        ...prevHistory.slice(0, 4) // Keep only the last 5 rolls
      ]);
    } catch (error) {
      setMessage("Error: " + error.response.data.error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", background: "#121212", color: "white", minHeight: "100vh" }}>
      <h1>Provably Fair Dice Game</h1>
      
      <label>Username: </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        style={{ padding: "10px", margin: "10px", fontSize: "18px" }}
      />
      
      <h2>Balance: ${balance}</h2>
      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        placeholder="Enter bet amount"
        style={{ padding: "10px", margin: "10px", fontSize: "18px" }}
      />
      <button onClick={rollDice} style={{ padding: "10px 20px", fontSize: "18px", background: "green", color: "white", border: "none", cursor: "pointer" }}>
        Roll Dice
      </button>
      <h2>{rollResult !== null ? `Dice Rolled: ${rollResult}` : "Roll the dice to play!"}</h2>
      <h3>{message}</h3>
      
      <h2>Game History</h2>
      <ul>
        {gameHistory.map((entry, index) => (
          <li key={index} style={{ color: entry.win ? "#4caf50" : "#f44336" }}>
            Bet: ${entry.bet} | Roll: {entry.roll} | {entry.win ? "Win" : "Lose"}
          </li>
        ))}
      </ul>
    </div>
  );  
}
