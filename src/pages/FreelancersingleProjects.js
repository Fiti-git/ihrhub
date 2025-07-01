import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Button, LinearProgress, List, ListItem, ListItemText, Modal, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedMilestones, setSelectedMilestones] = useState([]);
  const [showChat, setShowChat] = useState(false);  // To control chat window visibility

  useEffect(() => {
    const fetchedProject = {
      id: projectId,
      title: `Project ${projectId}`,
      description: `Detailed description of Project ${projectId}. This project is a really interesting project.`,
      progress: 70,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      milestones: [
        { title: 'Design', completed: 100, date: '2025-02-15', paymentStatus: 'Paid', amount: 500 },
        { title: 'Development', completed: 60, date: '2025-05-20', paymentStatus: 'In Process', amount: 400 },
        { title: 'Testing', completed: 50, date: '2025-10-01', paymentStatus: 'Pending', amount: 300 },
      ],
      paymentHistory: [
        { amount: 500, date: '2025-01-15' },
        { amount: 400, date: '2025-03-01' },
        { amount: 300, date: '2025-04-01' },
      ],
    };

    setProject(fetchedProject);
  }, [projectId]);

  const handleOpenPaymentModal = () => setOpenPaymentModal(true);
  const handleClosePaymentModal = () => setOpenPaymentModal(false);

  const handleMilestoneSelection = (milestoneTitle) => {
    setSelectedMilestones(prevState =>
      prevState.includes(milestoneTitle)
        ? prevState.filter(item => item !== milestoneTitle)
        : [...prevState, milestoneTitle]
    );
  };

  const handleRequestPayment = () => {
    alert(`Requesting payment for selected milestones: ${selectedMilestones.join(', ')}`);
    handleClosePaymentModal();
  };

  const handleChatToggle = () => setShowChat(!showChat);  // Toggle the chat window

  if (!project) {
    return <Typography>Loading project details...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginTop: 4 }}>
        <Button onClick={() => navigate('/freelancer/projects')}>Back to Projects</Button>
        <Typography variant="h4" gutterBottom>
          {project.title}
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body1">{project.description}</Typography>

            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Progress</Typography>
              <LinearProgress variant="determinate" value={project.progress} sx={{ marginBottom: 2 }} />
              <Typography variant="caption">{project.progress}% Completed</Typography>
            </Box>

            {/* Milestones Section */}
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Milestones</Typography>
              <Box sx={{ display: 'flex', overflowX: 'auto', paddingBottom: 2 }}>
                {project.milestones.map((milestone, index) => (
                  <Card key={index} sx={{ minWidth: 200, marginRight: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{milestone.title}</Typography>
                      <Typography variant="body2">Completion: {milestone.completed}%</Typography>
                      <Typography variant="body2">Due Date: {milestone.date}</Typography>
                      <Typography variant="body2">Status: {milestone.paymentStatus}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Total Payment History */}
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Total Payment History</Typography>
              <List>
                {project.paymentHistory.map((payment, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Amount: $${payment.amount}`}
                      secondary={`Date: ${payment.date}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="body2">Total Payments: ${project.paymentHistory.reduce((total, payment) => total + payment.amount, 0)}</Typography>
            </Box>

            {/* Chat Option */}
            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" color="primary" onClick={handleChatToggle}>
                {showChat ? 'Close Chat' : 'Chat with Client'}
              </Button>
            </Box>

            {/* Request Payment Button */}
            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" color="secondary" onClick={handleOpenPaymentModal}>
                Request Payment
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Payment Request Modal */}
      <Modal open={openPaymentModal} onClose={handleClosePaymentModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          backgroundColor: 'white', padding: 4, boxShadow: 24, borderRadius: 2, width: 400
        }}>
          <Typography variant="h6" gutterBottom>
            Request Payment
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            Select the milestones for which you want to request payment:
          </Typography>

          {/* List of selectable milestones */}
          {project.milestones.map((milestone, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              {milestone.paymentStatus === 'Pending' || milestone.paymentStatus === 'In Process' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedMilestones.includes(milestone.title)}
                      onChange={() => handleMilestoneSelection(milestone.title)}
                    />
                  }
                  label={`${milestone.title} - Status: ${milestone.paymentStatus}`}
                />
              ) : (
                <Typography variant="body2">{`${milestone.title} - Status: ${milestone.paymentStatus} (No payment request available)`}</Typography>
              )}
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleClosePaymentModal}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleRequestPayment}>Request Payment</Button>
          </Box>
        </Box>
      </Modal>

      {/* Display Chat Window */}
      {showChat && <ChatWindow onClose={handleChatToggle} />}
    </Container>
  );
}

export default ProjectDetails;
