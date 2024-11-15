import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
} from '@mui/material';
import axios from 'axios';

function ScheduleScanPage() {
  const [targetUrl, setTargetUrl] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scanFrequency, setScanFrequency] = useState('');
  const [customInterval, setCustomInterval] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const navigate = useNavigate();

  const handleScheduleScan = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSchedule = async () => {
    setConfirmDialogOpen(false);

    const scheduledDateTime = new Date(scheduledTime);
    const now = new Date();
    const delay = scheduledDateTime - now;

    if (delay > 0) {
      alert(`Scheduled scan for ${targetUrl} on ${scheduledTime} with frequency ${scanFrequency}. Notifications will be sent to ${notificationEmail}.`);

      setTimeout(() => {
        navigate('/'); // Redirect to main page after 2 seconds
      }, 2000);

      setScanProgress(0);
      setTimeout(() => {
        setScanProgress(10);
        const progressInterval = setInterval(() => {
          setScanProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + 10;
          });
        }, 300);
      }, delay);
    } else {
      setErrorMessage('Scheduled time must be in the future.');
    }

    const scanData = {
      targetUrl,
      scheduledTime: scheduledDateTime.toISOString(),
      scanFrequency,
      customInterval,
      notificationEmail,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/schedules/schedule', scanData);
      console.log('Response:', response.data);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Error scheduling scan. Please try again.';
      setErrorMessage(errMsg);
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Scheduled Scanning of URL
        </Typography>

        <TextField
          fullWidth
          label="Target URL for Scheduling"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          sx={{ mb: 2 }}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          label="Scheduled Time"
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Scan Frequency</InputLabel>
          <Select
            value={scanFrequency}
            label="Scan Frequency"
            onChange={(e) => setScanFrequency(e.target.value)}
            variant="outlined"
            size="small"
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Custom Interval (in hours)"
          type="number"
          value={customInterval}
          onChange={(e) => setCustomInterval(e.target.value)}
          sx={{ mb: 2 }}
          variant="outlined"
          size="small"
          helperText="Specify interval in hours for a custom scan schedule"
        />

        <TextField
          fullWidth
          label="Notification Email"
          value={notificationEmail}
          onChange={(e) => setNotificationEmail(e.target.value)}
          sx={{ mb: 2 }}
          variant="outlined"
          size="small"
          helperText="Enter an email to receive scan results"
        />

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        {scanProgress > 0 && (
          <>
            <LinearProgress variant="determinate" value={scanProgress} sx={{ my: 2 }} />
            <Typography variant="body2">Scan Progress: {scanProgress}%</Typography>
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleScheduleScan}
          disabled={!scheduledTime || !scanFrequency}
          sx={{
            width: '100%',
            py: 1,
            fontWeight: 'bold',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          Schedule Scan
        </Button>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Scheduled Scan</DialogTitle>
        <DialogContent>
          <Typography>URL: {targetUrl}</Typography>
          <Typography>Scheduled Time: {scheduledTime}</Typography>
          <Typography>Frequency: {scanFrequency}</Typography>
          <Typography>Custom Interval: {customInterval} hours</Typography>
          <Typography>Email Notifications: {notificationEmail}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmSchedule} color="primary">
            Confirm
          </Button>
          <Button onClick={handleCloseConfirmDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ScheduleScanPage;
