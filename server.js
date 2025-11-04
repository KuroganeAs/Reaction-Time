const express = require('express');
const os = require('os');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let leaderboard = [];

app.post('/api/score', (req, res) => {
  const { username, averageTime, attempts } = req.body;
  
  if (!username || !averageTime || !attempts) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const score = {
    username: username.substring(0, 20),
    averageTime: Math.round(averageTime),
    attempts: attempts,
    platform: os.platform(),
    timestamp: new Date().toISOString()
  };

  leaderboard.push(score);
  
  leaderboard.sort((a, b) => a.averageTime - b.averageTime);
  
  leaderboard = leaderboard.slice(0, 10);

  res.json({ 
    success: true, 
    rank: leaderboard.findIndex(s => s.username === username && s.averageTime === score.averageTime) + 1 
  });
});


app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard);
});

app.get('/api/info', (req, res) => {
  res.json({
    platform: os.platform(),
    hostname: os.hostname(),
    nodeVersion: process.version,
    serverUptime: Math.floor(process.uptime()) + ' seconds'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(` Reaction Time Test Server running on port ${PORT}`);
  console.log(` Platform: ${os.platform()}`);
  console.log(`  Hostname: ${os.hostname()}`);
  console.log(` Open: http://localhost:${PORT}`);
});