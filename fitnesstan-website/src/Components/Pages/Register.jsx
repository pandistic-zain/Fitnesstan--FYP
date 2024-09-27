import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Register.css"; // You can rename the CSS file if you'd like

const Register = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };
  const navigate = useNavigate();

  const handleGoBack = () => {
      navigate('/'); // Redirects to the home page
  };
  return (
    <>
      <div className="register-page">
        <div className="GoBack" onClick={handleGoBack}>
          <div class="scene">
              <span class="side front" >
                <div className="button-background">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                  height="25px"
                  width="25px"
                >
                  <path
                    d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                    fill="#000000"
                  ></path>
                  <path
                    d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                    fill="#000000"
                  ></path>
                </svg>
                </div>
                <div className="button-text">Go Back</div>
              </span>
          </div>
        </div>
        <div
          className={`container ${isSignUp ? "right-panel-active" : ""}`}
          id="container"
        >
          <div className="form-container sign-up-container">
            <form action="signup">
              <h1>SIGN UP</h1>
              {/* <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span> */}
              <input type="text" name="username" placeholder="Name" required />
              <input type="email" name="email" placeholder="Email" required />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form action="login">
              <h1>LOGIN</h1>
              {/* <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span> */}
              <input type="email" name="email" placeholder="Email" required />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              /> 
              {/* eslint-disable-next-line */}
              <a href="#">Forgot your password?</a>
              <button type="submit">Login</button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back to Fitnesstan!</h1>
                <p>
                  Log in to access your personalized fitness and nutrition
                  plans, crafted just for you.
                </p>
                <button className="ghost" onClick={handleToggle}>
                  Login
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Fitness Enthusiast!</h1>
                <p>
                  Join Fitnesstan today and embark on a tailored fitness
                  journey, complete with workout and nutrition guidance.
                </p>
                <button className="ghost" onClick={handleToggle}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
