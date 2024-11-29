import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaLayerGroup,
  FaBook,
  FaBuilding,
  FaProjectDiagram,
  FaClipboardList,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div id="sidebar-wrapper">
      <div className="sidebar-heading font-weight-bold">SOUTENANCE</div>
      <div className="list-group list-group-flush">
        <Link
          to="/dashboard2"
          className="list-group-item list-group-item-action"
        >
          <FaHome className="mr-2" /> dashboard
        </Link>
        <Link to="/users" className="list-group-item list-group-item-action">
          <FaUsers className="mr-2" /> Users
        </Link>
        <Link to="/groupes" className="list-group-item list-group-item-action">
          <FaLayerGroup className="mr-2" /> Groupes
        </Link>
        <Link
          to="/specialite"
          className="list-group-item list-group-item-action"
        >
          <FaBook className="mr-2" /> Spécialité
        </Link>
        <Link to="/salles" className="list-group-item list-group-item-action">
          <FaBuilding className="mr-2" /> Salles
        </Link>
        <Link to="/projet" className="list-group-item list-group-item-action">
          <FaProjectDiagram className="mr-2" /> Projet
        </Link>
        <Link
          to="/soutenance"
          className="list-group-item list-group-item-action"
        >
          <FaClipboardList className="mr-2" /> Soutenance
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
