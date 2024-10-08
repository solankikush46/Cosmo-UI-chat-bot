import React, { useEffect, useState } from "react";
import {List, ListItem, ListItemText } from '@mui/material';

function PreviousSessions({ onSessionSelect}) {
    //State for storing sessions:
    const [sessions, setSessions] = useState([]);

    useEffect(()=> {
        //Load previous sessions from the local storage when the component mounts
        const storedSessions = localStorage.getItem('chatSessions');
        if(storedSessions) {
            setSessions(JSON.parse(storedSessions));
        }
    }, []);

    //Rendering the list of sessions
    return(
        <div>
            <h2>Previous Chat Sessions</h2>
            <List>
                {sessions.slice().reverse().map((session, index) =>{
                    const date= new Date(session.timestamp).toLocaleDateString();
                    const firstUserMessage =session.messages.find(msg => msg.sender === 'user');
                    const sessionLabel = firstUserMessage ? firstUserMessage.message : 'Empty chat';
                    return (
                    <ListItem button key = {index} onClick={() => onSessionSelect(session)}>
                        <ListItemText primary= {sessionLabel} secondary={date} />
                    </ListItem>
                )
                })}
            </List>
        </div>
    );
}

export default PreviousSessions;