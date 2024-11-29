import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8080/api/SalleController";

const getAllSalles = () => {
  return axios.get(`${API_URL}/GetAllSalles`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const createSalle = (salle) => {
  return axios.post(`${API_URL}/CreateSalle`, salle, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const deleteSalle = (id) => {
  return axios.delete(`${API_URL}/DeleteSalle/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const updateSalle = (id, salle) => {
  return axios.put(`${API_URL}/UpdateSalle/${id}`, salle, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
const getAvailableSalles = (date, time) => {
  return axios.get(`${API_URL}/available`, {
    params: { date, time },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export default {
  getAllSalles,
  createSalle,
  deleteSalle,
  updateSalle,
  getAvailableSalles,
};
