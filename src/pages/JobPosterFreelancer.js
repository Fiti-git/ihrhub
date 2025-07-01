import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, List, ListItem, ListItemText, Avatar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat'; // Chat Icon for the floating button
import CloseIcon from '@mui/icons-material/Close'; // Close Icon for the chat window
import PortfolioIcon from '@mui/icons-material/FolderOpen'; // Portfolio Icon
import ServicesIcon from '@mui/icons-material/Work'; // Services Icon

// Mock freelancer data
const freelancersData = [
  {
    id: 1,
    name: 'Jane Doe',
    title: 'Web Developer',
    bio: 'I am a passionate web developer with experience in creating dynamic and responsive websites.',
    portfolio: ['Project 1: E-commerce Website', 'Project 2: Portfolio Website', 'Project 3: Blogging Platform'],
    services: [
      { name: 'Website Development', description: 'Building responsive and dynamic websites.', pricePerHour: '$50/hr' },
      { name: 'E-commerce Development', description: 'Setting up e-commerce platforms with payment gateway integration.', pricePerHour: '$60/hr' },
      { name: 'SEO Optimization', description: 'Improving the SEO ranking of your website.', pricePerHour: '$40/hr' },
    ],
  },
  {
    id: 2,
    name: 'John Smith',
    title: 'Mobile App Developer',
    bio: 'Experienced in building mobile apps for both Android and iOS platforms.',
    portfolio: ['App 1: Social Media App', 'App 2: Fitness App', 'App 3: Food Delivery App'],
    services: [
      { name: 'Mobile App Development', description: 'Developing high-quality mobile applications.', pricePerHour: '$70/hr' },
      { name: 'App Maintenance', description: 'Providing app maintenance services.', pricePerHour: '$50/hr' },
    ],
  },
];

function FreelancerProfile() {
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openPortfolio, setOpenPortfolio] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Handle opening and closing of chat window
  const handleChatToggle = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setOpenChat(!openChat);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: 'Job Poster', text: newMessage }]);
      setNewMessage('');
    }
  };

  // Handle opening and closing the services dialog
  const handleServicesToggle = () => {
    setOpenServices(!openServices);
  };

  // Handle opening and closing the portfolio dialog
  const handlePortfolioToggle = () => {
    setOpenPortfolio(!openPortfolio);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Freelancers Available
      </Typography>

      {/* Freelancer Cards */}
      <Grid container spacing={4}>
        {freelancersData.map((freelancer) => (
          <Grid item xs={12} sm={6} md={4} key={freelancer.id}>
            <Card>
              <CardContent>
                <Avatar sx={{ width: 60, height: 60, marginBottom: 2 }} />
                <Typography variant="h5" gutterBottom>{freelancer.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">{freelancer.title}</Typography>
                <Typography variant="body2" paragraph>{freelancer.bio}</Typography>

                <Button variant="contained" color="primary" onClick={() => handleChatToggle(freelancer)}>
                  Chat with Freelancer
                </Button>
                <Button variant="outlined" color="secondary" sx={{ marginTop: 2 }} onClick={handlePortfolioToggle}>
                  View Portfolio
                </Button>
                <Button variant="outlined" color="primary" sx={{ marginTop: 2 }} onClick={handleServicesToggle}>
                  View Services
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chat Window */}
      {openChat && selectedFreelancer && (
        <Dialog open={openChat} onClose={() => setOpenChat(false)} fullWidth>
          <DialogTitle>Chat with {selectedFreelancer.name}</DialogTitle>
          <DialogContent>
            <Box sx={{ maxHeight: 300, overflowY: 'auto', marginBottom: 2 }}>
              {messages.map((msg, index) => (
                <Box key={index} sx={{ marginBottom: 1 }}>
                  <Typography variant="body2"><strong>{msg.sender}:</strong> {msg.text}</Typography>
                </Box>
              ))}
            </Box>
            <TextField
              label="Type a message"
              variant="outlined"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <IconButton onClick={() => setOpenChat(false)} sx={{ alignSelf: 'flex-start' }}>
                <CloseIcon />
              </IconButton>
              <Button variant="contained" onClick={handleSendMessage}>Send</Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Portfolio Modal */}
      <Dialog open={openPortfolio} onClose={handlePortfolioToggle} fullWidth>
        <DialogTitle>Freelancer Portfolio</DialogTitle>
        <DialogContent>
          <List>
            {selectedFreelancer && selectedFreelancer.portfolio.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePortfolioToggle} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Services Modal */}
      <Dialog open={openServices} onClose={handleServicesToggle} fullWidth>
        <DialogTitle>Freelancer Services</DialogTitle>
        <DialogContent>
          <List>
            {selectedFreelancer && selectedFreelancer.services.map((service, index) => (
              <ListItem key={index}>
                <ListItemText primary={service.name} secondary={`${service.description} - ${service.pricePerHour}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleServicesToggle} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default FreelancerProfile;
