import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate(); // Use the navigate hook from react-router-dom

  const handleLogin = () => {
    // Logic for login can go here (e.g., checking credentials)
    console.log("Login button clicked!");
    
    // After successful login, navigate to Dashboard
    navigate('/login');
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to the Home Page
        </Typography>
        <Typography variant="body1">
          Please click below to log in.
        </Typography>
      </Box>

      <Button variant="contained" color="primary" onClick={handleLogin} sx={{ padding: '10px 20px', fontSize: '16px' }}>
        Login
      </Button>
    </Container>
  );
}

export default Home;
