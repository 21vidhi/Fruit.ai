import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "register";

    try {
      const { data } = await axios.post(
        `http://localhost:5000/auth/${endpoint}`,
        { email, password }
      );

      if (isLogin) {
        setMessage("Logged in! Token: " + data.token);
        setIsAuthenticated(true);
        navigate("/home");
      } else {
        setMessage("User registered successfully!");
      }
    } catch (error) {
      setMessage(error.response?.data?.msg || "An error occurred.");
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginPage
            isLogin={isLogin}
            setIsLogin={setIsLogin} // Ensure this is correctly passed
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            message={message}
          />
        }
      />
      <Route
        path="/home"
        element={isAuthenticated ? <HomePage /> : <LoginPage />}
      />
      <Route
        path="/faqs"
        element={isAuthenticated ? <FAQs /> : <LoginPage />}
      />
    </Routes>
  );
}

// Component for Login and Register
function LoginPage({
  isLogin,
  setIsLogin,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  message,
}) {
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>{isLogin ? "Login" : "Register"}</h1>
        {message && <p style={{ color: "green" }}>{message}</p>}

        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="remember-forget">
          <a href="#">Forget password</a>
        </div>

        <button type="submit">{isLogin ? "Login" : "Register"}</button>
        <div>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>

        <div className="social-connect">
          <p>or connect with</p>
          <div className="social-icons">
            <a
              href="https://www.facebook.com"
              className="icon facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="https://www.instagram.com"
              className="icon instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.pinterest.com"
              className="icon pinterest"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faPinterest} />
            </a>
            <a
              href="https://www.linkedin.com"
              className="icon linkedin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

// Component for the Home Page after Login
function HomePage() {
  return (
    <div className="home-page">
      <h1>Fruit.AI - Be Healthy!</h1>
      <div className="icon-grid">
        <Link to="/chat">
          <div className="icons chat">Chat</div>
        </Link>
        <Link to="/translate">
          <div className="icons translate">Translate</div>
        </Link>
        <Link to="/faqs">
          <div className="icons faqs">FAQs</div>
        </Link>
        <Link to="/about">
          <div className="icons about">About</div>
        </Link>
      </div>
    </div>
  );
}

// Component for FAQs Management
function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch FAQs on component mount
  useEffect(() => {
    async function fetchFaqs() {
      try {
        const { data } = await axios.get("http://localhost:5000/faqs");
        setFaqs(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    }
    fetchFaqs();
  }, []);

  // Add FAQ
  const addFaq = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/faqs", {
        question,
        answer,
      });
      setFaqs([...faqs, data]);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  // Edit FAQ
  const editFaq = async (id) => {
    const faq = faqs.find((f) => f.id === id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditMode(true);
    setEditId(id);
  };

  // Update FAQ
  const updateFaq = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`http://localhost:5000/faqs/${editId}`, {
        question,
        answer,
      });
      setFaqs(faqs.map((f) => (f.id === editId ? data : f)));
      setEditMode(false);
      setEditId(null);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  // Delete FAQ
  const deleteFaq = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/faqs/${id}`);
      setFaqs(faqs.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  return (
    <div className="faq-page">
      <h1>Fruit FAQs</h1>

      <div className="faq-cards">
        {faqs.map((faq) => (
          <div key={faq.id} className="faq-card">
            <div className="faq-content">
              <h2 className="faq-question">{faq.question}</h2>
              <p className="faq-answer">{faq.answer}</p>
              <div className="faq-actions">
                <button onClick={() => editFaq(faq.id)}>Edit</button>
                <button onClick={() => deleteFaq(faq.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-faq">
        <h2>{editMode ? "Update FAQ" : "Add Your FAQ"}</h2>
        <form onSubmit={editMode ? updateFaq : addFaq}>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
          <button type="submit">{editMode ? "Update FAQ" : "Add FAQ"}</button>
        </form>
      </div>
    </div>
  );
}

export default App;
