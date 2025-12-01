import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

import * as auth from "../utils/auth";
import * as api from "../utils/api";
import { setToken, getToken } from "../utils/token";
import AppContext from "../context/AppContext";

import "./styles/App.css";

function App() {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password === confirmPassword) {
      auth
        .register(username, email, password)
        .then(() => {
          navigate("/login");
        })
        .catch(console.error);
    }
  };

  // handleLogin accepts one parameter: an object with two properties.
  const handleLogin = ({ username, password }) => {
    // If username or password empty, return without sending a request.
    if (!username || !password) {
      return;
    }

    // Try the real API first
    auth
      .authorize(username, password)
      .then((data) => {
        if (data.jwt) {
          // Save the token to local storage
          setToken(data.jwt);
          setUserData(data.user); // save user's data to state
          setIsLoggedIn(true); // log the user in
          // After login, navigate to the location that is stored in state. If
          // there is no stored location, default to redirecting to /ducks.
          const redirectPath = location.state?.from?.pathname || "/ducks";
          navigate(redirectPath);
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
      });
  };

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }

    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        setIsLoggedIn(true);
        setUserData({ username, email });
      })
      .catch(console.error);
  }, []);

  return (
    <AppContext.Provider value={{ setIsLoggedIn, isLoggedIn }}>
      <Routes>
        <Route
          path="/ducks"
          element={
            <ProtectedRoute isLoggedin={isLoggedIn}>
              <Ducks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute isLoggedin={isLoggedIn}>
              <MyProfile userData={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
              <div className="registerContainer">
                <Register handleRegistration={handleRegistration} />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
              <div className="loginContainer">
                <Login handleLogin={handleLogin} />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to="/ducks" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
