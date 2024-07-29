import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import{ MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"
import BarChart from './scenes/global/Barcharts';
import PreviousSessions from './scenes/global/previousChat';
import { Grid } from '@mui/material'; 

const API_KEY = "sk-None-Qa9UZV7q0UzGZTNRKNZxT3BlbkFJO6ff4WORzIrRoy254h3K";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello I am Jarvis.!",
      sender: "Jarvis",
      direction: "incoming",
      timestamp: new Date()
    }
  ]) //[]

  const [activityData, setActivityData] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Load activity data from local storage when the component mounts
  useEffect(() => {
    const storedActivityData = localStorage.getItem('activityData');
    if (storedActivityData) {
      setActivityData(JSON.parse(storedActivityData));
    }

  const storedSessions = localStorage.getItem('chatSessions');
    if (storedSessions) {
      const parsedSessions = JSON.parse(storedSessions).map(session => ({
        ...session,
        messages: session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp) // Convert timestamp to Date object
        }))
      }));
      const sortedSessions = parsedSessions.sort((a,b)=> new Date(b.timestamp)- new Date(a.timestamp));
      setSessions(sortedSessions);
    }
  }, []);

  
  useEffect(()=>{
    const initialActivityData =messages.reduce((acc,msg)=>{
      const date= msg.timestamp.toISOString().split('T')[0];
      if(!acc[date]){
        acc[date] ={date: date,message: 0};
      }
      acc[date].messages +=1;
      return acc;
    },{});
  
    const updatedActivityData = Object.values(initialActivityData);
    setActivityData(updatedActivityData);
    localStorage.setItem('activtyData',JSON.stringify(updatedActivityData));

    //Save the  current session to the local storage
    const storedSessions =JSON.parse(localStorage.getItem('chatSessions')) || [];
    const newSessions = [...storedSessions, { messages, timestamp: new Date()}];
    localStorage.setItem('chatSessions', JSON.stringify(newSessions));
  }, [messages]);

const handleSend = async (message) => {
  const newMessage ={
    message: message,
    sender: "user",
    direction: "outgoing",
    timestamp: new Date()
  };    

  const newMessages = [...messages, newMessage]; // all the old messages + the new messages

  //Update  our messsage state
  setMessages(newMessages);

  // set a typing indicator (Jarvis is typing......)
  setTyping(true);

  //Update activity data

  const date = newMessage.timestamp.toISOString().split('T')[0];
    setActivityData(prevData => {
      const existingData = prevData.find(data => data.date === date);
      if (existingData) {
        const updatedData = prevData.map(data => data.date === date ? { ...data, messages: data.messages + 1 } : data);
        localStorage.setItem('activityData',JSON.stringify(updatedData));
        return updatedData;
      }
      const newData = [...prevData, { date: date, messages: 1 }];
      localStorage.setItem('activityData',JSON.stringify(newData));
        return newData;
    });

  // Process message to chatgpt (send it over to chat gpt and see the response)
  await processMessageToChatGPT(newMessages);
}

async function processMessageToChatGPT(chatMessages) {

  let apiMessages = chatMessages.map((messageObject) =>{
    let role ="";
    if(messageObject.sender === "Jarvis"){
      role="assistant"
    } else {
      role ="user"
    }
    return{role: role, content: messageObject.message }
  });

  const systemMessage = {
    role: "system",
    content: "Explain all the concepts like I am 17- 22 years old."
  }

  const apiRequestBody = {
    "model": "gpt-3.5-turbo",
    "messages": [
      systemMessage,
      ...apiMessages
    ]
  }

  await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + API_KEY,
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(apiRequestBody)
  }).then((data) => {
    return data.json();
  }).then((data) => {
    console.log(data);
    console.log(data.choices[0].message.content);
    const jarvisMessage = {
        message: data.choices[0].message.content,
        sender: "Jarvis",
        direction: "incoming",
        timestamp: new Date()
      };
    setMessages([...chatMessages, jarvisMessage]);
    setTyping(false);

    //Update the activity data after reply from Jarvis
    const date = jarvisMessage.timestamp.toISOString().split('T')[0];
      setActivityData(prevData => {
        const existingData = prevData.find(data => data.date === date);
        if (existingData) {
          const updatedData = prevData.map(data => data.date === date ? { ...data, messages: data.messages + 1 } : data);
          localStorage.setItem('activityData',JSON.stringify(updatedData));
          return updatedData;
        }
        const newData = [...prevData, { date: date, messages: 1 }];
        localStorage.setItem('activityData',JSON.stringify(newData));
        return newData;
      });

  });

}

const handleSessionSelect = (session) => {
  setMessages(session.messages);
};

  return (
    <div className="App">
      <Grid container spacing = {2}>
        <Grid item xs = {3}>
        <PreviousSessions sessions={sessions} onSessionSelect={handleSessionSelect}/>
      </Grid>
      <Grid item xs={9}>
      <div style={{ position: "relative", height: "800px", width: "700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator = {typing ? <TypingIndicator content="Jarvis is typing" /> :null}
              >
              {messages.map((message,index) => {
                return <Message key={index} model={message} />
              })}
              </MessageList>
              <MessageInput placeholder="Type your Message Here" onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
      <div style={{marginTop: '20px'}}>
        <BarChart data={activityData}/>
      </div>
    </Grid>
    </Grid>
    </div>
  )    
}

export default App
