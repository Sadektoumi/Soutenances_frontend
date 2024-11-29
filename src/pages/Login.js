import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import loginImage from "../assets/login.png";
import authService from "../services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(username, password);
      const { token } = response.data;
      localStorage.setItem("token", token); // Store token in localStorage
      const decodedToken = jwtDecode(token);

      if (decodedToken.roles && decodedToken.roles.includes("Admin")) {
        navigate("/dashboard2"); // Redirect to dashboard if the role is admin
      } else if (decodedToken.roles && decodedToken.roles.includes("Student")) {
        navigate("/Student");
      } else if (decodedToken.roles && decodedToken.roles.includes("Teacher")) {
        navigate("/Teacher");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg rounded d-flex flex-md-row">
            <div className="col-md-6 d-none d-md-flex align-items-center p-4">
              <img src={loginImage} alt="Login" className="img-fluid rounded" />
            </div>
            <div className="col-md-6 d-flex align-items-center p-4">
              <div className="w-100">
                <h2 className="text-center mb-4  mt-3">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control rounded-pill mt-2 mb-2"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control rounded-pill mt-2"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block rounded-pill mt-3"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
