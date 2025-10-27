// src/components/Leaderboard.js
import React, { useState, useEffect } from 'react';

const Leaderboard = ({ contract }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (contract) {
      fetchLeaderboard();
    }
  }, [contract]);

  const fetchLeaderboard = async () => {
    try {
      const data = await contract.getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  return (
    <div className="leaderboard" style={{ textAlign: 'center', margin: '20px', color: '#ff7518' }}>
      <h2 style={{ fontFamily: 'Creepster, cursive' }}>Leaderboard</h2>
      <table style={{ margin: '0 auto', borderCollapse: 'collapse', color: '#fff' }}>
        <thead>
          <tr>
            <th style={{ border: '2px solid #ff7518', padding: '10px' }}>Rank</th>
            <th style={{ border: '2px solid #ff7518', padding: '10px' }}>Player</th>
            <th style={{ border: '2px solid #ff7518', padding: '10px' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td style={{ border: '2px solid #ff7518', padding: '10px' }}>{index + 1}</td>
              <td style={{ border: '2px solid #ff7518', padding: '10px' }}>
                {entry.player.slice(0, 6)}...{entry.player.slice(-4)}
              </td>
              <td style={{ border: '2px solid #ff7518', padding: '10px' }}>{entry.score.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;