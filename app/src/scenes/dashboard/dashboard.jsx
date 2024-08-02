import React from 'react';
import { Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard = ({ onNewChat, onViewPreviousChats, OnViewChatHistory}) => {
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={onNewChat}>
                        New Chat
                    </Button>
                    <Button variant="contained" color="primary" onClick={OnViewChatHistory}>
                        Previous Chats
                    </Button>
                    <Button variant="contained" color="primary" component={Link} to="/chathistory">
                        Chat History Statistics
                    </Button>
                </Grid>

            </Grid>
        </div>
    )
}

export default Dashboard;