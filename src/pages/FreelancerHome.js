import React, { useState } from 'react';
import { Container, Typography, Box, Button, AppBar, Toolbar, Link, Grid, Card, CardContent, CardActions, LinearProgress, IconButton, Badge, Popover, List, ListItem, ListItemText, TextField, Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Import Notification Icon
import ChatIcon from '@mui/icons-material/Chat'; // Chat Icon for the floating button
import CloseIcon from '@mui/icons-material/Close'; // Import Close Icon for the chat window

function FreelancerHome() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);  // For managing Popover anchor element
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You have a new job post available" },
    { id: 2, message: "Your project has been approved by the client" },
    { id: 3, message: "A client commented on your proposal" },
  ]);
  const [unreadCount, setUnreadCount] = useState(3);  // To show number of unread notifications
  const [showChat, setShowChat] = useState(false); // To control chat window visibility
  const [selectedClient, setSelectedClient] = useState(null); // To store the selected client
  const [messages, setMessages] = useState([]); // Store chat messages
  const [newMessage, setNewMessage] = useState(''); // Input for new message

  // List of clients for chat
  const clients = [
    { id: 1, name: "Client A" },
    { id: 2, name: "Client B" },
    { id: 3, name: "Client C" },
  ];

  // Mock data for ongoing projects with progress
  const ongoingProjects = [
    { id: 1, title: "Project 1", description: "Description of ongoing project 1", progress: 40 },
    { id: 2, title: "Project 2", description: "Description of ongoing project 2", progress: 70 },
    { id: 3, title: "Project 3", description: "Description of ongoing project 3", progress: 90 },
  ];

  const recentJobPosts = [
    { id: 1, title: "Job Post 1", company: "Company A", description: "Description of job post 1" },
    { id: 2, title: "Job Post 2", company: "Company B", description: "Description of job post 2" },
    { id: 3, title: "Job Post 3", company: "Company C", description: "Description of job post 3" },
  ];

  // Handle opening and closing of the notification popover
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Handle opening the chat window
  const handleChatToggle = () => {
    setShowChat(!showChat);  // Toggle chat window visibility
    setSelectedClient(null);  // Reset client selection when opening chat
  };

  // Handle client selection to start chat
  const handleClientSelect = (client) => {
    setSelectedClient(client);  // Set selected client
  };

  // Send a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: 'Freelancer', text: newMessage }]);
      setNewMessage('');  // Clear the input after sending
    }
  };

  // Handle closing the chat window
  const handleCloseChat = () => {
    setShowChat(false); // Close the chat window
    setMessages([]); // Clear messages when closing the chat
  };

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            iHRhub Freelancer
          </Typography>
          <Box>
            <Link href="#" color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate('/freelancer/profile')}>
              Profile
            </Link>
            <Link href="#" color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate('/freelancer/jobs')}>
              Jobs
            </Link>
            <Link href="#" color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate('/freelancer/services')}>
              Services
            </Link>
            <Link href="#" color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate('/freelancer/documents')}>
              Documents
            </Link>
            <Link href="#" color="inherit"  sx={{ marginRight: 2 }} onClick={() => navigate('/freelancer/projects')}>
              Projects
            </Link>
            <Link href="#" color="inherit" onClick={() => navigate('/support')}>
              Support
            </Link>

            {/* Notification Icon */}
            <IconButton onClick={handlePopoverOpen} color="inherit">
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome Freelancer
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Here you can manage your profile, browse jobs, submit proposals, and more.
        </Typography>

        {/* Ongoing Projects Section */}
        <Typography variant="h5" gutterBottom>
          Ongoing Projects
        </Typography>
        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
          {ongoingProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{project.title}</Typography>
                  <Typography variant="body2">{project.description}</Typography>

                  {/* Progress Bar */}
                  <Box sx={{ marginTop: 2 }}>
                    <LinearProgress variant="determinate" value={project.progress} />
                    <Typography variant="caption" sx={{ marginTop: 1 }}>
                      {project.progress}% Completed
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => navigate(`/freelancer/projects/${project.id}`)}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Job Posts Section */}
        <Typography variant="h5" gutterBottom>
          Recent Job Posts
        </Typography>
        <Grid container spacing={2}>
          {recentJobPosts.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="subtitle2">{job.company}</Typography>
                  <Typography variant="body2">{job.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="secondary" onClick={() => navigate(`/freelancer/jobs/${job.id}`)}>
                    Apply Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Notification Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ padding: 2, minWidth: 300 }}>
          <Typography variant="h6">Notifications</Typography>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id}>
                <ListItemText primary={notification.message} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>

      {/* Floating Chat Icon */}
      {!showChat && (
        <Fab 
          color="primary" 
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }} 
          onClick={handleChatToggle}
        >
          <ChatIcon />
        </Fab>
      )}

      {/* Chat Window */}
      {showChat && (
        <Box sx={{
          position: 'fixed', bottom: 20, right: 20, width: 300, backgroundColor: 'white',
          boxShadow: 3, borderRadius: 2, padding: 2, display: 'flex', flexDirection: 'column', zIndex: 1000
        }}>
          {/* If no client is selected, show client list */}
          {!selectedClient ? (
            <>
              <Typography variant="h6" align="center">Select a Client</Typography>
              <Grid container spacing={2}>
                {clients.map((client) => (
                  <Grid item xs={12} key={client.id}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleClientSelect(client)}
                    >
                      {client.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <>
              {/* Show the chat with the selected client */}
              <Typography variant="h6" align="center">Chat with {selectedClient.name}</Typography>

              {/* Chat messages display */}
              <Box sx={{ maxHeight: 200, overflowY: 'auto', marginBottom: 2 }}>
                {messages.map((msg, index) => (
                  <Box key={index} sx={{ marginBottom: 1 }}>
                    <Typography variant="body2">{msg.sender}: {msg.text}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Message input */}
              <TextField
                label="Type a message"
                variant="outlined"
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton onClick={handleCloseChat} sx={{ alignSelf: 'flex-start' }}>
                  <CloseIcon />
                </IconButton>
                <Button variant="contained" onClick={handleSendMessage}>Send</Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </Container>
  );
}

export default FreelancerHome;
