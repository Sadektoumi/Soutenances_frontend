import axios from "axios";

const API_URL = "http://localhost:8080/api/SoutenanceController";

const getAllSoutenances = () => {
  return axios.get(`${API_URL}/GetAllSoutenance`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const createSoutenance = (soutenance) => {
  return axios.post(`${API_URL}/CreateSoutenance`, soutenance, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const deleteSoutenance = (id) => {
  return axios.delete(`${API_URL}/DeleteSoutenance/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const updateSoutenance = (id, soutenance) => {
  return axios.put(`${API_URL}/UpdateSoutenance/${id}`, soutenance, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const getSoutenance = (id) => {
  return axios.put(`${API_URL}/GetSoutenance/${id}`, {
    params: { id },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export default {
  getAllSoutenances,
  createSoutenance,
  deleteSoutenance,
  updateSoutenance,
  getSoutenance,
};
