import React, {useEffect, useState} from "react";
import useAssistant from "./hooks/useAssistant";
import "./App.css";
import ReactMarkdown from "react-markdown";
import LoginForm from "./loginForm";

export type IUser = {name: string; prn: string; course: string};

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const {messages, sendMessage, loading, processMessage} = useAssistant();
  const [user, setUser] = useState<IUser | null>(null);

  const handleSend = () => {
    if (loading) return;
    if (input.trim() !== "") {
      sendMessage(input, user);
      setInput("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleLogin = (userData: {
    name: string;
    prn: string;
    course: string;
  }) => {
    setUser(userData);
  };

  // useEffect(() => {
  //   processMessage("Hello! Who are you?");
  // }, []);

  return (
    <div className="app">
      {user ? (
        <div className="chat-window">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
            />
            <button onClick={handleSend} disabled={loading}>
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <LoginForm onSubmit={handleLogin} />
      )}
    </div>
  );
};

export default App;
