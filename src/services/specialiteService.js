import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8080/api/SpecialiteController";

const getAllSpecialites = () => {
  return axios.get(`${API_URL}/GetAllSpecialite`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const createSpecialite = (specialite) => {
  return axios.post(`${API_URL}/CreateSpecialite`, specialite, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const deleteSpecialite = (id) => {
  return axios.delete(`${API_URL}/DeleteSpecialite/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const updateSpecialite = (id, specialite) => {
  return axios.put(`${API_URL}/UpdateSpecialite/${id}`, specialite, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export default {
  getAllSpecialites,
  createSpecialite,
  deleteSpecialite,
  updateSpecialite,
};
