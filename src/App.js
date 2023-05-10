import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './App.css';

// Add these imports to the top of the file
import Register from './components/Register';
import Login from './components/Login';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Hi William's dear friend",
      sender: 'chatbot',
    },
  ]);
  
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMessage = async (e) => {
    e.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    };

    try {
      const res = await fetch('https://chat-back-end-blush.vercel.app/chatbot/message', requestOptions);
      const data = await res.json();
      setMessages([...messages, { text: input, sender: 'user' }]);

      // Simulate Hikari typing by waiting for a short delay
      await sleep(600); // Adjust this value for the desired typing delay

      setMessages([...messages, { text: input, sender: 'user' }, { text: data.response, sender: 'chatbot' }]);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Conditionally render components based on the token
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div>
        <Register />
        <Login />
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <img src="https://www.kindpng.com/picc/m/24-241830_mq-girl-pokemon-chibi-pikachu-cute-chibi-anime.png" alt="Cute anime character" style={{ width: '100px', height: '100px' }}></img>
        <h1 className="chatbot-title">Magic Shop with Hikari</h1>
      </div>
      <div className="chatbot-body">
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((message, index) => (
            <div className={`chat-message ${message.sender}`} key={index}>
              {message.sender === 'chatbot' && (
                <img
                  src="https://www.kindpng.com/picc/m/24-241830_mq-girl-pokemon-chibi-pikachu-cute-chibi-anime.png"
                  alt="Cute anime character"
                  className="chatbot-avatar"
                />
              )}
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleMessage} className="chatbot-form">
          <TextField
            label="Your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              style: {
                background: '#fff',
                borderRadius: '24px',
              },
            }}
          />
          <Button variant="contained" color="primary" type="submit" disableElevation>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

export default App;
