import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

function FreelancerJobs() {
  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Browse Jobs
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Button variant="contained" color="primary" fullWidth>
          Apply for a Job
        </Button>
        <Button variant="contained" color="secondary" fullWidth sx={{ marginTop: 2 }}>
          Filter Jobs
        </Button>
      </Box>
    </Container>
  );
}

export default FreelancerJobs;
