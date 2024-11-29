import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8080/api/UserController";

const getAllUsers = () => {
  return axios.get(`${API_URL}/getAllUser`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const getStudentsAvailable = () => {
  return axios.get(`${API_URL}/getAllUserAreNotInproject`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const createUser = (user) => {
  return axios.post(`${API_URL}/CreateUser`, user, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const deleteUser = (id) => {
  return axios.delete(`${API_URL}/DeleteUser/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const updateUser = (id, specialite) => {
  return axios.put(`${API_URL}/UpdateUser/${id}`, specialite, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const getTeacherAvailable = (date, time) => {
  return axios.get(`${API_URL}/available`, {
    params: { date, time },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export default {
  getAllUsers,
  createUser,
  deleteUser,
  getStudentsAvailable,
  updateUser,
  getTeacherAvailable,
};
