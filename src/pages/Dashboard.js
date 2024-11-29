import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../custom.css";

const Dashboard = ({ children }) => {
  return (
    <div className="d-flex" id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper">
        <Navbar />
        <div className="container-fluid">{children}</div>
      </div>
    </div>
  );
};

export default Dashboard;
