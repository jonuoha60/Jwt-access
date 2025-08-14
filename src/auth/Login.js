import '../../style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthProvider.js';
import { FcGoogle } from "react-icons/fc"          // Google colored icon
import { FaGithub } from "react-icons/fa"         // GitHub icon
import { FaLinkedin } from "react-icons/fa"

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const { login } = useAuth()
  const [loader, setLoader] = useState(false)
  
  const navigate = useNavigate()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    let newErrors = {};

    if (!email.trim()) newErrors.email = "Email can't be empty";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";

    if (!password) newErrors.password = "Password can't be empty";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoader(true)

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password
      });



      if (response.data) {
         const { token, refreshToken } = response.data;
         const { username, email, id, created_at, firebaseUid } = response.data.user;

      // save to localStorage
        login(token, username, email, id, created_at, firebaseUid, refreshToken)
        navigate('/');
        console.log("Login successful token", token);
        console.log("Login successful refreshToken", refreshToken);
        console.log("Login successful email", email);
        console.log("Login successful id", id);
        console.log("Login successful date", created_at);
        console.log("Login successful firebase", firebaseUid);
        setErrors({});
        setLoader(false)
        // Optionally store token or user info
        // localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error in login", error);
      setErrors({ general: "Invalid email or password" });
    } finally{
      setLoader(false)
    }
  };

  return (
    <div className="login-form">
          {loader && (
  <div className="spinner-overlay">
    <div className="spinner"></div>
  </div>
)}
      <div className="signup-form">
      <h2>Login with Us</h2>
      {/* <strong><p className="login-message">
        Don't have an account? <a href="/Signup">Signup.</a>
      </p>
      </strong> */}
      <p className="login-message">
        To enjoy full access to our website’s features, including editing and rating content,
        as well as receiving personalized recommendations, you need to log in to your account.
        Don’t have an account? Signing up is quick and free. <a href="/signup">Click here to get started.</a>
      </p>

      {errors.general && <p className="error-text">{errors.general}</p>}
      {success && <p className="success-text">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" className="login-button">Login</button>
      </form>

      <p className="login-message">
        Forgot Password? <a href="/reset-password">Click here.</a>
      </p>
     
    </div>
     <div className="continue-section">
          <h1>Continue with</h1>
          {/* Social buttons can go here */}
         <div className="social-buttons-container">
          <button className="social-button google">
            <FcGoogle size={24} style={{ marginRight: 8 }} />
            Sign in with Google
          </button>
          
          <button className="social-button google">
            <FaGithub size={24} style={{ marginRight: 8 }} />
            Github
          </button>
          
          <button className="social-button google">
            <FaLinkedin size={24} style={{ marginRight: 8 }} />
            LinkedIn
          </button>
        </div>
        </div>
    </div>
  );
};

export default Login;
