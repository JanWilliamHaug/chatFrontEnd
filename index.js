const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateResponse } = require('./server/openai');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.post('/chatbot/message', async (req, res) => {
  const message = req.body.message;

  const response = await generateResponse(message);
  res.send({ response });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${server.address().port}`);
});

module.exports = server;
