import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Button, LinearProgress, List, ListItem, ListItemText, Modal, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';

function JobPosterDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showChat, setShowChat] = useState(false);  // To control chat window visibility

  useEffect(() => {
    const fetchedJob = {
      id: jobId,
      title: `Job ${jobId}`,
      description: `Detailed description of Job ${jobId}. This job requires a web developer to create a custom website.`,
      progress: 60,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      applicants: [
        { name: 'Freelancer 1', status: 'Applied' },
        { name: 'Freelancer 2', status: 'Applied' },
        { name: 'Freelancer 3', status: 'Shortlisted' }
      ],
      tasks: [
        { title: 'Initial Design', completed: 100, paymentStatus: 'Paid', amount: 500 },
        { title: 'Backend Development', completed: 60, paymentStatus: 'In Process', amount: 600 },
        { title: 'Frontend Development', completed: 50, paymentStatus: 'Pending', amount: 400 },
      ],
      paymentHistory: [
        { amount: 500, date: '2025-01-15' },
        { amount: 600, date: '2025-03-01' },
      ],
    };

    setJob(fetchedJob);
  }, [jobId]);

  const handleOpenPaymentModal = () => setOpenPaymentModal(true);
  const handleClosePaymentModal = () => setOpenPaymentModal(false);

  const handleTaskSelection = (taskTitle) => {
    setSelectedTasks(prevState =>
      prevState.includes(taskTitle)
        ? prevState.filter(item => item !== taskTitle)
        : [...prevState, taskTitle]
    );
  };

  const handleMakePayment = () => {
    alert(`Making payment for selected tasks: ${selectedTasks.join(', ')}`);
    handleClosePaymentModal();
  };

  const handleChatToggle = () => setShowChat(!showChat);  // Toggle the chat window

  if (!job) {
    return <Typography>Loading job details...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginTop: 4 }}>
        <Button onClick={() => navigate('/jobposter/jobs')}>Back to Jobs</Button>
        <Typography variant="h4" gutterBottom>
          {job.title}
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body1">{job.description}</Typography>

            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Progress</Typography>
              <LinearProgress variant="determinate" value={job.progress} sx={{ marginBottom: 2 }} />
              <Typography variant="caption">{job.progress}% Completed</Typography>
            </Box>

            {/* Applicants Section */}
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Applicants</Typography>
              <Box sx={{ display: 'flex', overflowX: 'auto', paddingBottom: 2 }}>
                {job.applicants.map((applicant, index) => (
                  <Card key={index} sx={{ minWidth: 200, marginRight: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{applicant.name}</Typography>
                      <Typography variant="body2">Status: {applicant.status}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Tasks Section */}
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Tasks</Typography>
              <Box sx={{ display: 'flex', overflowX: 'auto', paddingBottom: 2 }}>
                {job.tasks.map((task, index) => (
                  <Card key={index} sx={{ minWidth: 200, marginRight: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography variant="body2">Completion: {task.completed}%</Typography>
                      <Typography variant="body2">Amount: ${task.amount}</Typography>
                      <Typography variant="body2">Status: {task.paymentStatus}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Total Payment History */}
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Total Payment History</Typography>
              <List>
                {job.paymentHistory.map((payment, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Amount: $${payment.amount}`}
                      secondary={`Date: ${payment.date}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="body2">Total Payments: ${job.paymentHistory.reduce((total, payment) => total + payment.amount, 0)}</Typography>
            </Box>

            {/* Chat Option */}
            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" color="primary" onClick={handleChatToggle}>
                {showChat ? 'Close Chat' : 'Chat with Freelancer'}
              </Button>
            </Box>

            {/* Make Payment Button */}
            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" color="secondary" onClick={handleOpenPaymentModal}>
                Make Payment
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Payment Modal */}
      <Modal open={openPaymentModal} onClose={handleClosePaymentModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          backgroundColor: 'white', padding: 4, boxShadow: 24, borderRadius: 2, width: 400
        }}>
          <Typography variant="h6" gutterBottom>
            Make Payment
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            Select the tasks for which you want to make payment:
          </Typography>

          {/* List of selectable tasks */}
          {job.tasks.map((task, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              {task.paymentStatus === 'Pending' || task.paymentStatus === 'In Process' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTasks.includes(task.title)}
                      onChange={() => handleTaskSelection(task.title)}
                    />
                  }
                  label={`${task.title} - Status: ${task.paymentStatus}`}
                />
              ) : (
                <Typography variant="body2">{`${task.title} - Status: ${task.paymentStatus} (No payment request available)`}</Typography>
              )}
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleClosePaymentModal}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleMakePayment}>Make Payment</Button>
          </Box>
        </Box>
      </Modal>

      {/* Display Chat Window */}
      {showChat && <ChatWindow onClose={handleChatToggle} />}
    </Container>
  );
}

export default JobPosterDetails;
