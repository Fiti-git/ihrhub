import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';

function FreelancerServices() {
  const [showForm, setShowForm] = useState(false);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceRate, setServiceRate] = useState('');
  const [servicesList, setServicesList] = useState([
    {
      title: "Website Design",
      description: "Full responsive website with modern UI/UX, built in React.",
      rate: "50"
    },
    {
      title: "SEO Optimization",
      description: "On-page SEO, keyword research, performance tuning.",
      rate: "40"
    },
    {
      title: "Social Media Management",
      description: "Manage your Facebook, Instagram, and LinkedIn profiles.",
      rate: "30"
    }
  ]);

  const handleAddService = () => {
    if (serviceTitle && serviceDescription && serviceRate) {
      setServicesList([
        ...servicesList,
        { title: serviceTitle, description: serviceDescription, rate: serviceRate }
      ]);
      // reset form
      setServiceTitle('');
      setServiceDescription('');
      setServiceRate('');
      setShowForm(false);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleCancel = () => {
    setServiceTitle('');
    setServiceDescription('');
    setServiceRate('');
    setShowForm(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Offer Services (Gigs)
      </Typography>

      {/* Toggle Form Button */}
      {!showForm && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            Add Service
          </Button>
        </Box>
      )}

      {/* Service Creation Form */}
      {showForm && (
        <Box sx={{ width: '100%', mb: 4 }}>
          <TextField
            label="Service Title"
            variant="outlined"
            fullWidth
            value={serviceTitle}
            onChange={(e) => setServiceTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Service Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Per Hour Rate ($)"
            variant="outlined"
            fullWidth
            type="number"
            value={serviceRate}
            onChange={(e) => setServiceRate(e.target.value)}
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleAddService}>
              Save Service
            </Button>
          </Box>
        </Box>
      )}

      {/* List of Services */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Your Services:
        </Typography>
        {servicesList.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            You haven't added any services yet.
          </Typography>
        ) : (
          servicesList.map((service, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{service.title}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {service.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Rate: ${service.rate} / hr
              </Typography>
            </Paper>
          ))
        )}
      </Box>
    </Container>
  );
}

export default FreelancerServices;
