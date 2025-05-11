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
    // now allows letters, spaces, or underscores
    if (name === "username") {
      // allow only letters/spaces/_/- AND disallow leading/trailing _ or -
      const validSoFar =
        /^[A-Za-z _-]*$/.test(value) && // only allowed chars
        !/^[_-]/.test(value) && // no leading _ or -
        !/[_-]$/.test(value); // no trailing _ or -
      if (validSoFar || value === "") {
        setSignUpData({ ...signUpData, [name]: value });
      }
    } else {
      setSignUpData({ ...signUpData, [name]: value });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("[DEBUG] Sending login request with data:", loginData);

      // 1) Login request (returns the full Axios response)
      const response = await loginUser(loginData);
      console.log("[DEBUG] loginUser response:", response);

      // 2) Check if login was successful
      if (response.status === 200) {
        // This is the JSON from the server's /login
        const loginPayload = response.data;
        console.log("[DEBUG] loginPayload:", loginPayload);

        // 3) Store Basic Auth credentials in localStorage
        localStorage.setItem("username", loginData.email);
        localStorage.setItem("password", loginData.password);

        // 4) Fetch the full user data (which returns only the JSON)
        const fullUserData = await getFullUserData();
        console.log("[DEBUG] FullUserInfoDTO:", fullUserData);

        // 5) Since fullUserData is { user, diet, workoutPlan }, check if it's not null
        if (fullUserData) {
          // Optionally store user info
          localStorage.setItem("userData", JSON.stringify(fullUserData.user));

          // 6) Decide navigation based on roles
          const userRoles = fullUserData.user?.roles || [];
          if (userRoles.includes("ADMIN")) {
            navigate("/AdminDashboard");
          } else {
            navigate("/userdashboard");
          }
        } else {
          console.error("Failed to fetch full user data:", fullUserData);
          setErrorMessage("Failed to fetch full user data.");
        }
      } else {
        // Non-200 login
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
      console.error("[DEBUG] Login error:", error);
      setErrorMessage(
        error.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // SIGN UP SUBMIT -> Move user to Additional Info
  // -----------------------------------------
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!/^[A-Za-z_ ]+$/.test(signUpData.username)) {
      setErrorMessage(
        "Full Name must use letters, spaces or underscores only."
      );
      return;
    }
    if (signUpData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    // We store the email/password so that the next steps
    // (AdditionalInfoForm, etc.) can use them
    localStorage.setItem("username", signUpData.email);
    localStorage.setItem("password", signUpData.password);

    // Move to AdditionalInfoForm with signUpData in state
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

        {/* Container that toggles between Sign Up and Login forms */}
        <div
          className={`container ${isSignUp ? "right-panel-active" : ""}`}
          id="container"
        >
          {/* SIGN UP FORM */}
          <div className="form-container sign-up-container">
            <form onSubmit={handleSignUpSubmit} autoComplete="off">
              {/* Hidden fields to trick some browsers into not autofilling */}
              <input
                type="text"
                name="fakeusernameremembered"
                style={{ display: "none" }}
              />
              <input
                type="password"
                name="fakepasswordremembered"
                style={{ display: "none" }}
              />

              <h1>SIGN UP</h1>
              <div className="form-fields">
                <input
                  type="text"
                  name="username"
                  placeholder="Full Name"
                  pattern="^(?![_-])[A-Za-z _-]+(?<![_-])$"
                  value={signUpData.username}
                  onChange={handleSignUpChange}
                  required
                  autoComplete="off"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  required
                  autoComplete="off"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
                  required
                  autoComplete="new-password"
                />
              </div>
              <button type="submit">Sign Up</button>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
          </div>

          {/* LOGIN FORM */}
          <div className="form-container sign-in-container">
            <form onSubmit={handleLoginSubmit} autoComplete="off">
              {/* Hidden fields to trick some browsers into not autofilling */}
              <input
                type="text"
                name="fakeusernameremembered"
                style={{ display: "none" }}
              />
              <input
                type="password"
                name="fakepasswordremembered"
                style={{ display: "none" }}
              />

              <h1>LOGIN</h1>
              <div className="form-fields">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  autoComplete="off"
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
                    autoComplete="new-password"
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
                <a href="/forgetpassword" className="forgot-password-link">
                  Forgot password?
                </a>
              </div>
              <button type="submit">Login</button>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
          </div>

          {/* Overlay for transitions */}
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
