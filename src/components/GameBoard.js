// src/components/GameBoard.js
import React, { useState, useEffect } from 'react';
import pumpkinImg from '../../public/assets/pumpkin.png';
import ghostImg from '../../public/assets/ghost.png';

const GameBoard = ({ account, contract }) => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [pumpkinCount, setPumpkinCount] = useState(0);

  // Initialize 5x5 grid
  useEffect(() => {
    const initialGrid = Array(5)
      .fill()
      .map(() => Array(5).fill(null));
    setGrid(initialGrid);
    if (account && contract) {
      fetchPlayerData();
    }
  }, [account, contract]);

  // Fetch player data from contract
  const fetchPlayerData = async () => {
    try {
      const data = await contract.getPlayerData(account);
      setScore(data.score.toString());
      setPumpkinCount(data.pumpkinCount.toString());
    } catch (err) {
      console.error('Error fetching player data:', err);
    }
  };

  // Handle grid click
  const handleCellClick = async (row, col) => {
    if (!account || !contract) {
      alert('Please connect your wallet!');
      return;
    }

    // Randomly decide if it's a pumpkin or ghost (70% pumpkin, 30% ghost)
    const isPumpkin = Math.random() < 0.7;
    const newGrid = [...grid];
    newGrid[row][col] = isPumpkin ? 'pumpkin' : 'ghost';
    setGrid(newGrid);

    try {
      if (isPumpkin) {
        const pumpkinId = Date.now(); // Unique ID for pumpkin
        const tx = await contract.collectPumpkin(pumpkinId);
        await tx.wait();
      } else {
        const deduction = 5; // Deduct 5 points for ghost
        const tx = await contract.encounterGhost(deduction);
        await tx.wait();
      }
      await fetchPlayerData();
    } catch (err) {
      console.error('Error interacting with contract:', err);
    }

    // Reset cell after 1 second
    setTimeout(() => {
      newGrid[row][col] = null;
      setGrid([...newGrid]);
    }, 1000);
  };

  return (
    <div className="game-board" style={{ textAlign: 'center', margin: '20px' }}>
      <h2 style={{ fontFamily: 'Creepster, cursive', color: '#ff7518' }}>
        Pumpkin Patch Panic
      </h2>
      <p style={{ color: '#fff' }}>
        Score: {score} | Pumpkins: {pumpkinCount}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 60px)',
          gap: '5px',
          justifyContent: 'center',
          backgroundColor: '#333',
          padding: '10px',
          borderRadius: '10px',
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#444',
                border: '2px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {cell === 'pumpkin' && (
                <img src={pumpkinImg} alt="Pumpkin" style={{ width: '50px' }} />
              )}
              {cell === 'ghost' && (
                <img src={ghostImg} alt="Ghost" style={{ width: '50px' }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
