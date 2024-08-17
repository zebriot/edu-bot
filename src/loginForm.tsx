import React, {useState} from "react";
import "./App.css";
import "./index.css";

interface LoginFormProps {
  onSubmit: (user: {name: string; prn: string; course: string}) => void;
}

const COURSES = [
  "Bachelor of Arts in English",
  "Bachelor of Science in Computer Science",
  "Bachelor of Business Administration",
  "Bachelor of Science in Biology",
  "Master of Business Administration",
  "Master of Science in Data Science",
  "Master of Arts in Psychology",
];

const LoginForm: React.FC<LoginFormProps> = ({onSubmit}) => {
  const [name, setName] = useState("");
  const [prn, setPrn] = useState("");
  const [course, setCourse] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && prn) {
      onSubmit({name, prn, course});
      alert(`Student Name: ${name} and PRN: ${prn}`);
      console.log(`Student Name: ${name} and PRN: ${prn}`);
    }
  };

  return (
    <header className="App-header app">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label className="label">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">PRN Number:</label>
          <input
            type="text"
            value={prn}
            onChange={(e) => setPrn(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Course:</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            {COURSES.map((i) => {
              return <option value={i}>{i}</option>;
            })}
          </select>
        </div>
        <button type="submit" className="App-link">
          Start Chat
        </button>
      </form>
    </header>
  );
};

export default LoginForm;
