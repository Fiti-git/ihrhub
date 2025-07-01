import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  InputLabel,
  Link
} from '@mui/material';

function FreelancerDocuments() {
  const [showForm, setShowForm] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docFile, setDocFile] = useState(null);

  // mock existing documents
  const [docsList, setDocsList] = useState([
    {
      title: 'AWS Certified Solutions Architect',
      filename: 'aws_certificate.pdf',
      uploadedAt: '2024-05-10'
    },
    {
      title: 'Bachelor Degree Transcript',
      filename: 'transcript.pdf',
      uploadedAt: '2023-12-01'
    },
    {
      title: 'Portfolio Sample',
      filename: 'portfolio.zip',
      uploadedAt: '2024-02-15'
    }
  ]);

  const handleAddDocument = () => {
    if (!docTitle || !docFile) {
      alert('Please provide a title and select a file.');
      return;
    }
    const newDoc = {
      title: docTitle,
      filename: docFile.name,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setDocsList([newDoc, ...docsList]);
    setDocTitle('');
    setDocFile(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setDocTitle('');
    setDocFile(null);
    setShowForm(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Documents
      </Typography>

      {/* Toggle Form Button */}
      {!showForm && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            Add Document
          </Button>
        </Box>
      )}

      {/* Document Upload Form */}
      {showForm && (
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Document Title"
            variant="outlined"
            fullWidth
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            margin="normal"
          />
          <Box sx={{ mt: 2 }}>
            <InputLabel htmlFor="doc-upload">Select File</InputLabel>
            <input
              id="doc-upload"
              type="file"
              accept=".pdf,.doc,.docx,.zip"
              onChange={(e) => setDocFile(e.target.files[0])}
              style={{ marginTop: 8 }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleAddDocument}>
              Save Document
            </Button>
          </Box>
        </Box>
      )}

      {/* Documents List */}
      <Box>
        {docsList.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No documents uploaded yet.
          </Typography>
        ) : (
          docsList.map((doc, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{doc.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                Uploaded: {doc.uploadedAt}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Link href={`#`} underline="hover">
                  {doc.filename}
                </Link>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Container>
  );
}

export default FreelancerDocuments;
