import axios from "axios";

const API_URL = "http://localhost:8080/api/groupeController";

const getAllGroupes = () => {
  return axios.get(`${API_URL}/GetAllGroupes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const createGroupe = (groupe) => {
  return axios.post(`${API_URL}/CreateGroupe`, groupe, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const deleteGroupe = (id) => {
  return axios.delete(`${API_URL}/DeleteGroupe/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const updateGroupe = (id, groupe) => {
  return axios.put(`${API_URL}/UpdateGroupe/${id}`, groupe, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export default {
  getAllGroupes,
  createGroupe,
  deleteGroupe,
  updateGroupe,
};
