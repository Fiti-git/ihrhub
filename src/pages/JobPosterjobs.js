import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add'; // Add Icon for creating a new job

function JobPosterJobBoard() {
  // State for storing job details
  const [postedJobs, setPostedJobs] = useState([
    { id: 1, title: "Web Developer for E-commerce", description: "Need a web developer to build an e-commerce platform.", status: "Waiting for Freelancer", budget: "$1000", deadline: "2023-08-30" },
    { id: 2, title: "Graphic Designer for Logo", description: "Looking for a creative graphic designer for a logo.", status: "Ongoing", budget: "$500", deadline: "2023-08-25" },
    { id: 3, title: "Mobile App Developer", description: "App development for a social media platform.", status: "Done", budget: "$2000", deadline: "2023-09-15" }
  ]);

  // State for the new job form and modal open state
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    status: 'Waiting for Freelancer',
    category: ''
  });
  const [open, setOpen] = useState(false); // To toggle the modal

  // Handle input change for new job form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({
      ...newJob,
      [name]: value
    });
  };

  // Handle adding a new job
  const handleAddJob = () => {
    if (newJob.title && newJob.description && newJob.budget && newJob.deadline && newJob.category) {
      const newJobWithId = { ...newJob, id: postedJobs.length + 1 };
      setPostedJobs([...postedJobs, newJobWithId]);
      setNewJob({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        status: 'Waiting for Freelancer',
        category: ''
      });
      setOpen(false); // Close the modal after posting the job
    } else {
      alert('Please fill in all the fields');
    }
  };

  // Handle opening and closing the modal
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Columns for DataGrid
  const columns = [
    { field: 'title', headerName: 'Job Title', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'status', headerName: 'Status', width: 180 },
    { field: 'budget', headerName: 'Budget', width: 150 },
    { field: 'deadline', headerName: 'Deadline', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => alert(`View bids for job with ID: ${params.row.id}`)}
        >
          View Bids
        </Button>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Job Poster Job Board
      </Typography>

      {/* Button to Open Job Posting Form */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <IconButton color="primary" onClick={handleClickOpen}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* DataGrid displaying posted jobs */}
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={postedJobs}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>

      {/* Job Posting Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Post a New Job</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <TextField
                label="Job Title"
                name="title"
                value={newJob.title}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Job Description"
                name="description"
                value={newJob.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Budget"
                name="budget"
                value={newJob.budget}
                onChange={handleInputChange}
                fullWidth
                type="number"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Deadline"
                name="deadline"
                value={newJob.deadline}
                onChange={handleInputChange}
                fullWidth
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={newJob.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  <MenuItem value="Web Development">Web Development</MenuItem>
                  <MenuItem value="Graphic Design">Graphic Design</MenuItem>
                  <MenuItem value="Mobile App Development">Mobile App Development</MenuItem>
                  <MenuItem value="Writing">Writing</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddJob} color="primary">
            Post Job
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default JobPosterJobBoard;
