import React, { useState } from "react";
import "./App.css";
import "./index.css";

interface LoginFormProps {
  onSubmit: (user: { name: string; prn: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [prn, setPrn] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && prn) {
      onSubmit({ name, prn });
      alert(`Student Name: ${name} and PRN: ${prn}`);
      console.log(`Student Name: ${name} and PRN: ${prn}`);
    }
  };

  return (
    <header className="App-header app">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label
            className="message"
          >Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="message">PRN Number:</label>
          <input
            type="text"
            value={prn}
            onChange={(e) => setPrn(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="App-link">
          Start Chat
        </button>
      </form>
    </header>
  );
};

export default LoginForm;
