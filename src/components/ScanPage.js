import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Card, Typography, LinearProgress, CircularProgress, Grid } from '@mui/material';
import { scanForVulnerabilities } from '../api'; // Import the API function

function ScanPage() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { scanTypes, targetUrl, email } = location.state || {};
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [scanMessages, setScanMessages] = useState([]);

  const startScan = useCallback(async () => {
    setScanning(true);
    setProgress(0);
    setScanMessages(['Initializing scan...', 'Connecting to target...']);

    // Simulate a slow progress update to match scan duration
    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {  // Assuming scan takes ~70% of the time
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);  // Slower interval to simulate scan progress over time

    try {
      const data = await scanForVulnerabilities(targetUrl, scanTypes, email); // Call API function

      if (data && !data.error) {
        setScanMessages((prev) => [...prev, 'Scan in progress...']);
        
        // Introduce a slight artificial delay before updating the results
        setTimeout(() => {
          setResults(data); // Store the scan results in state
          setScanMessages((prev) => [...prev, 'Scan completed.']);
        }, 2000); // Delay to simulate slow processing
      } else {
        setScanMessages((prev) => [...prev, 'Scan failed.']);
      }
    } catch (error) {
      console.error('Scan error:', error);
      setScanMessages((prev) => [...prev, 'Error during scan.']);
    } finally {
      // Simulate finishing progress
      setProgress(100); 
      setScanning(false);
    }
  }, [scanTypes, targetUrl, email]);

  useEffect(() => {
    if (scanTypes && targetUrl) {
      startScan();
    }
  }, [scanTypes, targetUrl, startScan]);

  // New effect to navigate once results are set
  useEffect(() => {
    if (results) {
      navigate('/result', { state: { results } });
    }
  }, [results, navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Scanning in Progress
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
            <Box sx={{ mt: 2 }}>
              {scanMessages.map((msg, index) => (
                <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }}>
                  {msg}
                </Typography>
              ))}
            </Box>
            {scanning && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography>Scanning in progress...</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ScanPage;
