import React from 'react';
import { Container, Typography, Box, Grid, TextField, Divider, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function FreelancerProfile() {
  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Avatar alt="Profile Picture" src="/path/to/profile-pic.jpg" sx={{ width: 120, height: 120, marginRight: 3 }} />
        <Box>
          <Typography variant="h4">Richard Sanchez</Typography>
          <Typography variant="h6" color="textSecondary">Marketing Manager</Typography>
          <Typography variant="body2">+123-456-7890 | hello@reallygreatsite.com | 123 Anywhere St., Any City</Typography>
        </Box>
      </Box>

      <Divider sx={{ margin: '20px 0', width: '100%' }} />

      {/* Profile Section */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>Profile</Typography>
        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Typography>
      </Box>

      {/* Work Experience Section */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>Work Experience</Typography>
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Borcell Studio</Typography>
          <Typography variant="body2" color="textSecondary">Marketing Manager & Specialist | 2030 - Present</Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Develop and execute comprehensive marketing strategies and campaigns that align with the company's goals and objectives.
          </Typography>
        </Box>
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Fauget Studio</Typography>
          <Typography variant="body2" color="textSecondary">Marketing Manager & Specialist | 2025 - 2029</Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Oversee market research to identify emerging trends, customer needs, and competitor strategies. Manage marketing budget and optimize ROI.
          </Typography>
        </Box>
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Studio Showde</Typography>
          <Typography variant="body2" color="textSecondary">Marketing Manager & Specialist | 2024 - 2025</Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Develop and maintain strong relationships with partners, agencies, and vendors to support marketing initiatives.
          </Typography>
        </Box>
      </Box>

      {/* Education Section */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>Education</Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Wardiere University</Typography>
        <Typography variant="body2" color="textSecondary">Master of Business Management | 2029 - 2030</Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>GPA: 3.9 / 4.0</Typography>

        <Typography variant="body2" sx={{ fontWeight: 'bold', marginTop: 2 }}>Wardiere University</Typography>
        <Typography variant="body2" color="textSecondary">Bachelor of Business | 2025 - 2029</Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>GPA: 3.8 / 4.0</Typography>
      </Box>

      {/* Skills Section */}
      <Box sx={{ width: '100%', marginTop: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>Skills</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>• Project Management</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>• Public Relations</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>• Teamwork</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>• Leadership</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>• Effective Communication</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>• Critical Thinking</Typography>
      </Box>

      {/* Languages Section */}
      <Box sx={{ width: '100%', marginTop: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>Languages</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>• English (Fluent)</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>• French (Fluent)</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>• German (Basics)</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>• Spanish (Intermediate)</Typography>
      </Box>

      {/* References Section */}
      <Box sx={{ width: '100%', marginTop: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>References</Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Estelle Darcy</Typography>
        <Typography variant="body2" color="textSecondary">Wardiere Inc. / CTO</Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>Phone: +123-456-7890</Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>Email: hello@reallygreatsite.com</Typography>

        <Typography variant="body2" sx={{ fontWeight: 'bold', marginTop: 2 }}>Harper Richard</Typography>
        <Typography variant="body2" color="textSecondary">Wardiere Inc. / CEO</Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>Phone: +123-456-7890</Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>Email: hello@reallygreatsite.com</Typography>
      </Box>

      {/* Edit Profile Button */}
      <Button variant="contained" color="primary" sx={{ marginTop: 3 }}>
        Edit Profile
      </Button>
    </Container>
  );
}

export default FreelancerProfile;
