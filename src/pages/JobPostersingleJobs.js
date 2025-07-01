import React, { useState } from 'react';
import { Container,TextField, Typography, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';

function JobPostersingleJobs() {
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);  // To show selected freelancer details
  const [openJobModal, setOpenJobModal] = useState(false);
  const [showChat, setShowChat] = useState(false);  // To control chat window visibility
  const [bids, setBids] = useState([
    {
      id: 1,
      freelancerName: 'Freelancer 1',
      bidAmount: 500,
      coverLetter: 'This is my cover letter. I am passionate about web development...',
      profile: 'Web Developer with 5 years of experience...',
      milestones: [
        { title: 'Initial Design', completed: 100 },
        { title: 'Development', completed: 60 },
      ]
    },
    {
      id: 2,
      freelancerName: 'Freelancer 2',
      bidAmount: 600,
      coverLetter: 'I have worked on several large projects and have a solid understanding of...',
      profile: 'Senior Developer with expertise in React and Node.js...',
      milestones: [
        { title: 'UI Design', completed: 90 },
        { title: 'Backend Integration', completed: 70 },
      ]
    }
  ]);

  // Handle opening and closing of the freelancer details modal
  const handleViewFreelancer = (freelancer) => {
    setSelectedFreelancer(freelancer);
  };

  // Toggle chat window visibility
  const handleChatToggle = () => {
    setShowChat(!showChat);
  };

  // Freelancer Details Popup
  const handleCloseModal = () => {
    setSelectedFreelancer(null); // Close the modal
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Job Details - Job 1
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Bids for Job 1</Typography>
        {bids.map((bid) => (
          <Card key={bid.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="body1">{bid.freelancerName}</Typography>
              <Typography variant="body2">Bid: ${bid.bidAmount}</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleViewFreelancer(bid)}
                sx={{ marginTop: 1 }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Freelancer Details Popup */}
      {selectedFreelancer && (
        <Dialog open={Boolean(selectedFreelancer)} onClose={handleCloseModal}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            backgroundColor: 'white', padding: 4, boxShadow: 24, borderRadius: 2, width: 400
          }}>
            <Typography variant="h6" gutterBottom>
              Freelancer: {selectedFreelancer.freelancerName}
            </Typography>

            <Typography variant="h6">Milestones</Typography>
            <List>
              {selectedFreelancer.milestones.map((milestone, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${milestone.title}: ${milestone.completed}% Completed`} />
                </ListItem>
              ))}
            </List>

            <Box sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleChatToggle}
              >
                {showChat ? 'Close Chat' : 'Chat with Freelancer'}
              </Button>
            </Box>

            <DialogActions>
              <Button onClick={handleCloseModal}>Close</Button>
            </DialogActions>
          </Box>
        </Dialog>
      )}

      {/* Chat Window */}
      {showChat && (
        <Box sx={{
          position: 'fixed', bottom: 20, right: 20, width: 300, backgroundColor: 'white',
          boxShadow: 3, borderRadius: 2, padding: 2, zIndex: 1000
        }}>
          <Typography variant="h6" gutterBottom>
            Chat with {selectedFreelancer.freelancerName}
          </Typography>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body2">Hello, how can I help you with this job?</Typography>
          </Box>
          <TextField
            label="Type a message"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth>
            Send
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default JobPostersingleJobs;
