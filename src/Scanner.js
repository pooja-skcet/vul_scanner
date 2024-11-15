

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Snackbar, Typography } from '@mui/material';
import axios from 'axios';
import './Scanner.css';

const Scanner = () => {
    const [url, setUrl] = useState('');
    const [scanType, setScanType] = useState('sql_injection');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [scheduledScan, setScheduledScan] = useState(null);
    const [apiError, setApiError] = useState('');

    const navigate = useNavigate();

    // Fetch scheduled scan details when the component mounts
    useEffect(() => {
        const fetchScheduledScan = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/schedules');
                // Check if the response contains valid data
                if (response.data && response.data.length > 0) {
                    setScheduledScan(response.data[0]); // Assuming an array of schedules
                } else {
                    setApiError('No scheduled scans found.');
                }
            } catch (error) {
                // Enhanced error handling
                console.error('API Request Failed:', error);
                if (error.response) {
                    // If the error is a response error
                    setApiError(`Error: ${error.response.data.message}`);
                } else if (error.request) {
                    // If no response received
                    setApiError('No response from the server. Please try again later.');
                } else {
                    // If any other error occurred
                    setApiError('An error occurred while fetching scheduled scans.');
                }
            }
        };

        fetchScheduledScan();
    }, []);

    const handleScan = async () => {
        if (!url) {
            alert('Please enter a valid URL.');
            return;
        }
        setLoading(true);
        console.log('Initiating scan for URL:', url);
        console.log('Scan Type:', scanType);
        console.log('Email for report (optional):', email);

        try {
            setTimeout(() => {
                navigate('/scan', { state: { targetUrl: url, scanTypes: scanType, email } });
                setLoading(false);
                setOpenSnackbar(true);
            }, 2000);
        } catch (error) {
            setLoading(false);
            console.error('Error occurred during scan initiation:', error);
        }
    };

    const handleScheduleScan = () => {
        navigate('/schedule-scan');
    };

    return (
        <div className="scanner-container">
            <div className="scanner-form">
                <div className="scanner-input-group">
                    <label>Target URL:</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter URL"
                        className="scanner-input"
                    />
                </div>

                <div className="scanner-input-group">
                    <label>Scan Type:</label>
                    <select
                        value={scanType}
                        onChange={(e) => setScanType(e.target.value)}
                        className="scanner-select"
                    >
                        <option value="sql_injection">SQL Injection</option>
                        <option value="command_injection">Command Injection</option>
                        <option value="xss">XSS</option>
                    </select>
                </div>

                <div className="scanner-input-group">
                    <label>Email (optional for report):</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email for report"
                        className="scanner-input"
                    />
                </div>

                <button
                    onClick={handleScan}
                    className={`scanner-button ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Start Scan'}
                </button>

                <button onClick={handleScheduleScan} className="scanner-button schedule-button">
                    Schedule a Scan
                </button>

                {/* Display Scheduled Scan Details if Available */}
                {scheduledScan && (
                    <div className="scheduled-scan-details">
                        <Typography variant="h6">Scheduled Scan Details</Typography>
                        <Typography>Target URL: {scheduledScan.targetUrl}</Typography>
                        <Typography>Scheduled Time: {new Date(scheduledScan.scheduledTime).toLocaleString()}</Typography>
                        <Typography>Frequency: {scheduledScan.scanFrequency}</Typography>
                        <Typography>Email: {scheduledScan.notificationEmail}</Typography>
                    </div>
                )}

                {/* Display API error if any */}
                {apiError && <Typography color="error">{apiError}</Typography>}
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message="Scan initiated successfully!"
            />
        </div>
    );
};

export default Scanner;

