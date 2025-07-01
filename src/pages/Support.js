import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Box, Grid, MenuItem, Select, InputLabel, FormControl, FormHelperText } from '@mui/material';

function SupportPage() {
  const [supportType, setSupportType] = useState('');
  const [project, setProject] = useState('');
  const [file, setFile] = useState(null);

  const handleSupportTypeChange = (event) => setSupportType(event.target.value);
  const handleProjectChange = (event) => setProject(event.target.value);
  const handleFileChange = (event) => setFile(event.target.files[0]);

  return (
    <Container maxWidth="md" sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Customer Support
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body1">
          Please provide details about your issue, select your support type, and attach any relevant files.
        </Typography>
      </Box>

      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Support Type</InputLabel>
              <Select
                value={supportType}
                onChange={handleSupportTypeChange}
                label="Support Type"
                required
              >
                <MenuItem value="technical">Technical Support</MenuItem>
                <MenuItem value="business">Business Support</MenuItem>
              </Select>
              <FormHelperText>Select the type of support you need</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={project}
                onChange={handleProjectChange}
                label="Project"
                required
              >
                <MenuItem value="project1">Project 1</MenuItem>
                <MenuItem value="project2">Project 2</MenuItem>
                <MenuItem value="project3">Project 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Subject"
              variant="outlined"
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description of Issue"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: 'block', width: '100%' }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Button variant="contained" color="primary" fullWidth>
              Email Support
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" color="secondary" fullWidth>
              Live Chat Support
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" color="success" fullWidth>
              Meeting Support
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth>
              Submit Ticket
            </Button>
          </Grid>
        </Grid>
      </form>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="body2" color="textSecondary">
          If this is an urgent issue, please call us at (123) 456-7890.
        </Typography>
      </Box>
    </Container>
  );
}

export default SupportPage;
