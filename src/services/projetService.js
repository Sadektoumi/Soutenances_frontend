import axios from "axios";

const API_URL = "http://localhost:8080/api/projetController";

const getAllProjets = () => {
  return axios.get(`${API_URL}/GetAllProject`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const createProjet = (projet) => {
  return axios.post(`${API_URL}/CreateProjet`, projet, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const deleteProjet = (id) => {
  return axios.delete(`${API_URL}/DeleteProjet/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const updateProjet = (id, projet) => {
  return axios.put(`${API_URL}/UpdateProjet/${id}`, projet, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const getAvailableProjets = () => {
  return axios.get(`${API_URL}/getAllProjetAreNotInSoutenance`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export default {
  getAllProjets,
  createProjet,
  deleteProjet,
  updateProjet,
  getAvailableProjets,
};
