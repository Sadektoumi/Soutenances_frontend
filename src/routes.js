import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Groupes from "./pages/Groupes";
import Specialite from "./pages/Specialite";
import Salles from "./pages/Salles";
import Projet from "./pages/Projet";
import Soutenance from "./pages/Soutenance";
import Dashboard2 from "./pages/Dashboard2";
import Student from "./pages/Student";
import Teacher from "./pages/Teacher";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/groupes" element={<Groupes />} />
        <Route path="/specialite" element={<Specialite />} />
        <Route path="/salles" element={<Salles />} />
        <Route path="/projet" element={<Projet />} />
        <Route path="/soutenance" element={<Soutenance />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/Student" element={<Student />} />
        <Route path="/Teacher" element={<Teacher />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
