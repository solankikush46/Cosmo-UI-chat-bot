import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import{ MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"

const API_KEY = "sk-None-Qa9UZV7q0UzGZTNRKNZxT3BlbkFJO6ff4WORzIrRoy254h3K";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello I am Jarvis.!",
      sender: "Jarvis",
      direction: "incoming"
    }
  ]) //[]

const handleSend = async (message) => {
  const newMessage ={
    message: message,
    sender: "user",
    direction: "outgoing"
  }

  const newMessages = [...messages, newMessage]; // all the old messages + the new messages

  //Update  our messsage state
  setMessages(newMessages);

  // set a typing indicator (Jarvis is typing......)
  setTyping(true);

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
    setMessages(
      [...chatMessages, {
        message: data.choices[0].message.content,
        sender: "Jarvis",
        direction: "incoming"
      }]
    );
    setTyping(false);
  });

}

  return (
    <div className="App">
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
    </div>
  )    
}

export default App
