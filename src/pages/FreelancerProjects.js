import React, { useState } from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

function FreelancerProjects() {
  const [projectsList] = useState([
    { id: 1, title: 'Project 1', time: '3 weeks', budget: '$500' },
    { id: 2, title: 'Project 2', time: '1 month', budget: '$1000' },
    { id: 3, title: 'Project 3', time: '2 weeks', budget: '$300' },
  ]);

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Available Projects
      </Typography>

      {/* List of Projects */}
      <Box sx={{ width: '100%' }}>
        {projectsList.map((project) => (
          <Paper key={project.id} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">{project.title}</Typography>
            <Typography variant="body1">Time: {project.time}</Typography>
            <Typography variant="body1">Budget: {project.budget}</Typography>
            <Link to={`/apply/${project.id}`}>
              <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                Apply
              </Button>
            </Link>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}

export default FreelancerProjects;
