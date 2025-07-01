import React, { useState } from 'react';
import { Container, Typography, Box, Button, AppBar, Toolbar, Link, Grid, Card, CardContent, CardActions, LinearProgress, IconButton, Badge, Popover, List, ListItem, ListItemText, TextField, Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Notification Icon
import ChatIcon from '@mui/icons-material/Chat'; // Chat Icon for the floating button
import CloseIcon from '@mui/icons-material/Close'; // Close Icon for the chat window

function JobPosterHome() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);  // For managing Popover anchor element
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New job applicants for your posted jobs" },
    { id: 2, message: "Your job post has been viewed by 10 freelancers" },
    { id: 3, message: "You have a new message from a freelancer" },
  ]);
  const [unreadCount, setUnreadCount] = useState(3);  // Number of unread notifications
  const [showChat, setShowChat] = useState(false); // To control chat window visibility
  const [selectedFreelancer, setSelectedFreelancer] = useState(null); // To store the selected freelancer
  const [messages, setMessages] = useState([]); // Store chat messages
  const [newMessage, setNewMessage] = useState(''); // Input for new message

  // List of freelancers for chat
  const freelancers = [
    { id: 1, name: "Freelancer A" },
    { id: 2, name: "Freelancer B" },
    { id: 3, name: "Freelancer C" },
  ];

  // List of jobs posted by the job poster
  const postedJobs = [
    { id: 1, title: "Job Post 1", description: "Description of job post 1", applicants: 5 },
    { id: 2, title: "Job Post 2", description: "Description of job post 2", applicants: 3 },
    { id: 3, title: "Job Post 3", description: "Description of job post 3", applicants: 8 },
  ];

  // List of ongoing projects related to job posts
  const ongoingProjects = [
    { id: 1, title: "Project 1", description: "Description of ongoing project 1", progress: 40 },
    { id: 2, title: "Project 2", description: "Description of ongoing project 2", progress: 70 },
    { id: 3, title: "Project 3", description: "Description of ongoing project 3", progress: 90 },
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
    setSelectedFreelancer(null);  // Reset freelancer selection when opening chat
  };

  // Handle freelancer selection to start chat
  const handleFreelancerSelect = (freelancer) => {
    setSelectedFreelancer(freelancer);  // Set selected freelancer
  };

  // Send a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: 'Job Poster', text: newMessage }]);
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
            iHRhub Job Poster
          </Typography>
          <Box>
            <Link href="#" color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate('/jobposter/profile')}>
              Profile
            </Link>
            <Link href="#" color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate('/jobposter/jobs')}>
              Jobs
            </Link>
            <Link href="#" color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate('/jobposter/freelancers')}>
              Freelancers
            </Link>
            <Link href="#" color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate('/support')}>
              support
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
          Welcome Job Poster
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Manage your job posts, communicate with freelancers, and more.
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
                  <Button size="small" color="primary" onClick={() => navigate(`/jobposter/projects/${project.id}`)}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Job Posts Section */}
        <Typography variant="h5" gutterBottom>
          Your Posted Jobs
        </Typography>
        <Grid container spacing={2}>
          {postedJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2">{job.description}</Typography>
                  <Typography variant="caption" sx={{ marginTop: 1 }}>
                    {job.applicants} Applicants
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => navigate(`/jobposter/jobs/${job.id}`)}>
                    View Applicants
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
          {/* If no freelancer is selected, show freelancer list */}
          {!selectedFreelancer ? (
            <>
              <Typography variant="h6" align="center">Select a Freelancer</Typography>
              <Grid container spacing={2}>
                {freelancers.map((freelancer) => (
                  <Grid item xs={12} key={freelancer.id}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleFreelancerSelect(freelancer)}
                    >
                      {freelancer.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <>
              {/* Show the chat with the selected freelancer */}
              <Typography variant="h6" align="center">Chat with {selectedFreelancer.name}</Typography>

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

export default JobPosterHome;
