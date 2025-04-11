import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";
import axios from "axios"

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = user?._id;

  const fetchChatMessages = async(req, res) => {
    const chat = await axios.get(BASE_URL+"/chat/"+ targetUserId, {
      withCredentials: true,
    });

    console.log(chat.data.messages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, [])

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();
    // As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, text }) => {
      console.log(firstName + " : " + text);
      setMessages((messages) => [...messages, { firstName, text }]);
    });

    // Disconnect the socket  after use/ Don't leave without disconnecting
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user?.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
  };

  return (
    <div className="w-3/4 h-[70vh] mx-auto m-7 border rounded-sm border-gray-600 flex flex-col ">
      <h1 className="p-4 text-2xl font-bold text-center border-b border-gray-600">
        Chat
      </h1>
      <div className="flex-1 overflow-y-scroll">
        {/* display messages */}
        {messages.map((msg, index) => {
          return (
            <div key={index}>
              <div className="chat chat-start">
                <div className="chat-header">
                  {msg?.firstName}
                  <time className="text-xs opacity-50">2 hours ago</time>
                </div>
                <div className="chat-bubble">{msg?.text}</div>
                <div className="chat-footer opacity-50">Seen</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full p-5 border-t justify-center items-center gap-3 border-gray-600 flex ">
        <input
          className="input w-full border border-gray-600"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="btn bg-primary p-5">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
