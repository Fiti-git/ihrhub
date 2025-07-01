import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleFreelancer = () => {
    navigate('/freelancer'); // Navigate to Freelancer Home Page
  };

  const handleJobPoster = () => {
    navigate('/jobposter'); // Navigate to Job Poster Home Page
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">What would you like to do?</Typography>
      </Box>

      <Button variant="contained" color="primary" fullWidth sx={{ marginBottom: 2 }} onClick={handleFreelancer}>
        Freelancer Job Seeker
      </Button>

      <Button variant="contained" color="secondary" fullWidth onClick={handleJobPoster}>
        Job Poster
      </Button>
    </Container>
  );
}

export default Dashboard;
