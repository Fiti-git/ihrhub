import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

function Home() {
  const handleLogin = () => {
    // Logic for login can go here
    console.log("Login button clicked!");
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
