
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { CheckCircle, ErrorOutline } from '@mui/icons-material';
import './ResultPage.css';  // Import the new styles

// Function to handle downloading the report with only the scan results
const handleDownloadReport = (results) => {
    // Create a Blob from the scan results data
    const reportData = {
        vulnerabilityStatus: results.vulnerable ? "Vulnerable" : "Not Vulnerable",
        payload: results.vulnerable ? results.payload : null,
        scanType: results.scan_type,
        timestamp: results.timestamp,
    };

    // Create a Blob object for the JSON data
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scan_report.json'; // Specify the file name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
};

const ResultPage = () => {
    const location = useLocation();
    const { results } = location.state || {}; // Extract results from ScanPage.js
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading delay if no results are immediately available
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    return (
        <div className="result-container">
            <div className="result-card">
                <h2>Scan Results</h2>
                {isLoading ? (
                    <div className="loading-spinner">
                        <CircularProgress size={50} />
                    </div>
                ) : results ? (
                    <div>
                        <div className={`result-status ${results.vulnerable ? 'vulnerable' : 'safe'}`}>
                            {results.vulnerable ? (
                                <CheckCircle sx={{ color: '#ff5722' }} fontSize="large" />
                            ) : (
                                <ErrorOutline sx={{ color: '#4caf50' }} fontSize="large" />
                            )}
                            <p><strong>Vulnerability Status:</strong> {results.vulnerable ? "Vulnerable" : "Not Vulnerable"}</p>
                        </div>

                        {results.vulnerable && (
                            <div className="result-details">
                                <p><strong>Payload:</strong> {results.payload}</p>
                                <p><strong>Scan Type:</strong> {results.scan_type}</p>
                                <p><strong>Date & Time:</strong> {results.timestamp}</p>
                            </div>
                        )}

                        <button onClick={() => handleDownloadReport(results)} className="download-button">
                            Download Scan Report
                        </button>
                    </div>
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default ResultPage;
