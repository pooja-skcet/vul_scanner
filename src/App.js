import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Container, Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Security, Notifications, Settings } from '@mui/icons-material';
import Scanner from './Scanner';
import ScanPage from './components/ScanPage';
import ResultPage from './components/ResultPage';
import ScheduleScanPage from './components/ScheduleScanPage';

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        {/* AppBar */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Security sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Vulnerability Scanner
            </Typography>

            {/* Right-aligned icons */}
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <IconButton color="inherit">
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<Scanner />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/schedule-scan" element={<ScheduleScanPage />} />
          
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
