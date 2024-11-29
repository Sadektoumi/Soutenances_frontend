import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const login = (username, password) => {
  return axios.post(`${API_URL}/login`, {
    username,
    password,
  });
};

const logout = () => {
  localStorage.removeItem("token"); // Remove token from localStorage
};

export default {
  login,
  logout,
};
