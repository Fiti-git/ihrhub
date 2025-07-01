import React, { useState } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, FormControlLabel, Checkbox } from '@mui/material';

const ChatWindow = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Client', text: 'Hello, how can I help you with the project?' },
    { sender: 'Freelancer', text: 'I have some questions about the design.' },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { sender: 'Freelancer', text: message }]);
      setMessage('');
    }
  };

  return (
    <Box sx={{
      position: 'fixed', bottom: 20, right: 20, width: 300, backgroundColor: 'white',
      boxShadow: 3, borderRadius: 2, padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
    }}>
      <Typography variant="h6" align="center">Chat with Client</Typography>

      {/* Chat messages display */}
      <Box sx={{ maxHeight: 200, overflowY: 'auto', marginBottom: 2 }}>
        <List>
          {chatMessages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={msg.sender}
                secondary={msg.text}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Message input */}
      <TextField
        label="Type a message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleSendMessage}>Send</Button>
      </Box>
    </Box>
  );
};

export default ChatWindow;
