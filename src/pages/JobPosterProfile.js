import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Grid, Card, CardContent, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Edit Icon for the edit button

function JobPosterProfile() {
  // State for storing profile data and edit mode
  const [isEditing, setIsEditing] = useState(false); // To track if the profile is in edit mode
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Example Company",
    phone: "+1 234 567 890",
    address: "123 Main St, City, Country"
  });
  
  // Handle input change for profile details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Save the edited profile data (you can add API call here to save data to the server)
  const handleSave = () => {
    // Here you can make an API call to save the updated profile
    setIsEditing(false);
    console.log("Profile saved", profile);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      {/* Profile Header */}
      <Typography variant="h4" align="center" gutterBottom>
        Job Poster Profile
      </Typography>

      {/* Profile Card */}
      <Card>
        <CardContent>
          {/* Profile Fields */}
          <Grid container spacing={2} direction="column" alignItems="center">
            {/* Name */}
            <Grid item xs={12}>
              {!isEditing ? (
                <Typography variant="h6" gutterBottom>{profile.name}</Typography>
              ) : (
                <TextField
                  label="Name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  fullWidth
                />
              )}
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              {!isEditing ? (
                <Typography variant="h6" gutterBottom>{profile.email}</Typography>
              ) : (
                <TextField
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  fullWidth
                />
              )}
            </Grid>

            {/* Company */}
            <Grid item xs={12}>
              {!isEditing ? (
                <Typography variant="h6" gutterBottom>{profile.company}</Typography>
              ) : (
                <TextField
                  label="Company"
                  name="company"
                  value={profile.company}
                  onChange={handleInputChange}
                  fullWidth
                />
              )}
            </Grid>

            {/* Phone */}
            <Grid item xs={12}>
              {!isEditing ? (
                <Typography variant="h6" gutterBottom>{profile.phone}</Typography>
              ) : (
                <TextField
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  fullWidth
                />
              )}
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              {!isEditing ? (
                <Typography variant="h6" gutterBottom>{profile.address}</Typography>
              ) : (
                <TextField
                  label="Address"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  fullWidth
                />
              )}
            </Grid>

            {/* Edit / Save / Cancel Button */}
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              {!isEditing ? (
                <IconButton color="primary" onClick={toggleEdit}>
                  <EditIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined" onClick={toggleEdit}>Cancel</Button>
                  <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default JobPosterProfile;
