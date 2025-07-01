import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Grid, TextareaAutosize, Paper, Input } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

function ProjectApplication() {
  const { projectId } = useParams(); // Get the projectId from URL
  const navigate = useNavigate(); // Hook to navigate to other pages
  const [coverLetter, setCoverLetter] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneAmount, setMilestoneAmount] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');
  const [file, setFile] = useState(null); // State for file upload

  // Handle cover letter change
  const handleCoverLetterChange = (e) => setCoverLetter(e.target.value);

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  // Handle adding milestones
  const handleAddMilestone = () => {
    if (milestoneName && milestoneAmount && milestoneDate) {
      const newMilestone = { name: milestoneName, amount: milestoneAmount, date: milestoneDate };
      setMilestones([...milestones, newMilestone]);
      setMilestoneName('');
      setMilestoneAmount('');
      setMilestoneDate('');
    }
  };

  // Handle application submission
  const handleSubmitApplication = () => {
    // In a real-world scenario, you would send the data to a backend API to store the cover letter, file, and milestones.
    setApplicationStatus('Your application has been successfully submitted!');
    console.log('File Uploaded: ', file);
    console.log('Cover Letter: ', coverLetter);
    console.log('Milestones: ', milestones);

    // After submission, navigate to the "Thank You" page
    navigate('/freelancer');
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Typography variant="h5" gutterBottom>Apply for Project {projectId}</Typography>

      {/* Cover Letter */}
      <Typography variant="body1" sx={{ marginTop: '10px' }}>Cover Letter</Typography>
      <TextareaAutosize
        minRows={5}
        placeholder="Write your cover letter here..."
        required
        value={coverLetter}
        onChange={handleCoverLetterChange}
        style={{ width: '100%', padding: '10px', marginTop: '10px', marginBottom: '20px' }}
      />

      {/* File Upload for Cover Letter Document */}
      <Typography variant="body1" sx={{ marginTop: '10px' }}>Upload Cover Letter (Document)</Typography>
      <Input
        type="file"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        sx={{ marginBottom: '20px' }}
      />

      {/* Milestone Form */}
      <Typography variant="body1" sx={{ marginTop: '20px' }}>Add Milestone</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Milestone Name"
            fullWidth
            required
            value={milestoneName}
            onChange={(e) => setMilestoneName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Amount"
            fullWidth
            required
            value={milestoneAmount}
            onChange={(e) => setMilestoneAmount(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            required
            value={milestoneDate}
            onChange={(e) => setMilestoneDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddMilestone}>
            Add Milestone
          </Button>
        </Grid>
      </Grid>

      {/* List of Milestones */}
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body1">Milestones</Typography>
        {milestones.map((milestone, index) => (
          <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="body1">{milestone.name}</Typography>
            <Typography variant="body1">Amount: {milestone.amount}</Typography>
            <Typography variant="body1">Due Date: {milestone.date}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Submit Application Button */}
      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleSubmitApplication}>
          Submit Application
        </Button>
      </Box>

      {/* Application Status */}
      {applicationStatus && (
        <Typography variant="body1" color="success.main" sx={{ marginTop: '20px' }}>
          {applicationStatus}
        </Typography>
      )}
    </Container>
  );
}

export default ProjectApplication;
