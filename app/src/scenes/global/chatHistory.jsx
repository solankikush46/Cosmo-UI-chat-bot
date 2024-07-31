import React from 'react';
import BarChart from './Barcharts';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ChatHistory = ({ data }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat History</h1>
      <div style={{ height: '800px', width: '100%' }}>
        <BarChart data={data} />
      </div>
      <Button variant="contained" color="primary" component={Link} to="/">
        Back to Chat
      </Button>
    </div>
  );
};

export default ChatHistory;