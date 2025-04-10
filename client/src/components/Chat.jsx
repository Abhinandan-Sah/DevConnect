import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
  const { targetUserId } = useParams();
  const user= useSelector((store)=> store.user)
  const [messages, setMessages] = useState([{ text: "Hello" }]);
  const userId = user?._id

  useEffect(()=>{
    if(!userId){
      return;
    }
    const socket = createSocketConnection();
    // As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", {firstName: user?.firstName, userId,targetUserId});
    
    // Disconnect the socket  after use/ Don't leave without disconnecting
    return ()=>{
      socket.disconnect();
    }
    
  }, [userId, targetUserId])

  return (
    <div className="w-1/2 h-[70vh] mx-auto m-7 border rounded-sm border-gray-600 flex flex-col ">
      <h1 className="p-4 text-2xl font-bold text-center border-b border-gray-600">
        Chat
      </h1>
      <div className="flex-1 overflow-y-scroll">
        {/* display messages */}
        {messages.map((msg, index) => {
          return (
            <div key={index}>
              <div  className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">
                  Mandira
                  <time className="text-xs opacity-50">12:45</time>
                </div>
                <div className="chat-bubble">You were the Chosen One!</div>
                <div className="chat-footer opacity-50">Delivered</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">
                  {user?.firstName}
                  <time className="text-xs opacity-50">12:46</time>
                </div>
                <div className="chat-bubble">I Love you!</div>
                <div className="chat-footer opacity-50">Seen at 12:46</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full p-5 border-t justify-center items-center gap-3 border-gray-600 flex ">
        <input className="input w-full border border-gray-600" />
        <button className="btn bg-primary p-5">Send</button>
      </div>
    </div>
  );
};

export default Chat;
