import React, {useState} from "react";
import useAssistant from "./hooks/useAssistant";
import "./App.css";
import ReactMarkdown from "react-markdown";

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const {messages, sendMessage, loading} = useAssistant();

  const handleSend = () => {
    if (loading) return;
    if (input.trim() !== "") {
      sendMessage(input);
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

  return (
    <div className="app">
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
      {/* {error && <div className="error">{error}</div>} */}
    </div>
  );
};

export default App;
