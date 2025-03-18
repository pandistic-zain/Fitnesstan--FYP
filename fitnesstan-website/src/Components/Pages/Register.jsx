import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getFullUserData } from "../../API/RegisterAPI.jsx";

import Loader from "../Loader.jsx"; // Import the Loader component
import "./Register.css";

const Register = () => {
  const [isSignUp, setIsSignUp] = useState(true); // Default to sign-up page
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("[DEBUG] Sending login request with data:", loginData);

      // 1) Make the login request (returns full Axios response)
      const response = await loginUser(loginData);
      console.log("[DEBUG] loginUser response:", response);

      // 2) Check if login was successful (HTTP 200)
      if (response.status === 200) {
        // response.data is the server’s JSON payload
        const loginPayload = response.data;
        console.log("[DEBUG] loginPayload:", loginPayload);

        // 3) Store Basic Auth credentials for subsequent requests
        localStorage.setItem("username", loginData.email);
        localStorage.setItem("password", loginData.password);

        // 4) Fetch the full user data (returns full Axios response)
        const fullUserRes = await getFullUserData();
        console.log("[DEBUG] getFullUserData response:", fullUserRes);

        // 5) Check if full user data fetch was successful
        if (fullUserRes.status === 200 && fullUserRes.data) {
          // fullUserRes.data should contain your DTO: { user, diet, workoutPlan }
          console.log("[DEBUG] FullUserInfoDTO:", fullUserRes.data);

          // Optionally store the user info in localStorage
          localStorage.setItem(
            "userData",
            JSON.stringify(fullUserRes.data.user)
          );

          // 6) Decide where to navigate based on roles
          const userRoles = fullUserRes.data.user?.roles || [];
          if (userRoles.includes("ADMIN")) {
            navigate("/AdminDashboard");
          } else {
            navigate("/userdashboard");
          }
        } else {
          console.error("Failed to fetch full user data:", fullUserRes.data);
          setErrorMessage("Failed to fetch full user data.");
        }
      } else {
        // If the login response was not 200, show an error
        console.error(
          "Login failed with status:",
          response.status,
          response.data
        );
        setErrorMessage(
          response.data?.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      // Handle any thrown errors from either loginUser or getFullUserData
      console.error("[DEBUG] Login error:", error);
      setErrorMessage(
        error.response?.data?.message || "Invalid email or password."
      );
    } finally {
      // Always stop the loader, whether success or error
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    localStorage.setItem("username", signUpData.email);
    localStorage.setItem("password", signUpData.password);
    // Navigate to Additional Info Page with user data
    navigate("/AdditionalInfoForm", { state: { signUpData } });
  };
  return (
    <>
      {loading && <Loader />} {/* Conditionally render the loader */}
      <div className="register-page">
        <div className="GoBack" onClick={handleGoBack}>
          <div className="scene">
            <span className="side front">
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
            <form onSubmit={handleSignUpSubmit}>
              <h1>SIGN UP</h1>
              <div className="form-fields">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={signUpData.username}
                  onChange={handleSignUpChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  required
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
                  required
                />
              </div>
              <button type="submit">Sign Up</button>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form onSubmit={handleLoginSubmit}>
              <h1>LOGIN</h1>
              <div className="form-fields">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    className={showPassword ? "password-visible" : ""}
                  />
                  <span
                    className="show-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    />
                  </span>
                </div>
              </div>
              <button type="submit">Login</button>
              {errorMessage && <p className="error">{errorMessage}</p>}
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
