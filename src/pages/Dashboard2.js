import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import userService from "../services/userService";
import projetService from "../services/projetService";
import soutenanceService from "../services/soutenanceService";
import Dashboard from "./Dashboard";
import Users from "./Users";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard2 = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [soutenanceData, setSoutenanceData] = useState(null);

  useEffect(() => {
    fetchUsers1();
    fetchData();
  }, []);

  const fetchUsers1 = () => {
    userService
      .getAllUsers()
      .then((response) => {
        const usersData = response.data;
        setUsers(usersData);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const fetchData = () => {
    fetchUsers();
    fetchProjects();
    fetchSoutenances();
  };

  const fetchUsers = () => {
    userService
      .getAllUsers()
      .then((response) => {
        const users = response.data;
        const roles = users.reduce(
          (acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
          },
          { Admin: 0, Teacher: 0, Student: 0 }
        );
        setUserData({
          labels: ["Admin", "Teacher", "Student"],
          datasets: [
            {
              label: "# of Users",
              data: [roles.Admin, roles.Teacher, roles.Student],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  console.log(userData);

  const fetchProjects = () => {
    projetService
      .getAllProjets()
      .then((response) => {
        const projects = response.data.length;
        setProjectData({
          labels: ["Projects"],
          datasets: [
            {
              label: "# of Projects",
              data: [projects],
              backgroundColor: ["#36A2EB"],
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  };

  const fetchSoutenances = () => {
    soutenanceService
      .getAllSoutenances()
      .then((response) => {
        const soutenances = response.data.length;
        setSoutenanceData({
          labels: ["Soutenances"],
          datasets: [
            {
              label: "# of Soutenances",
              data: [soutenances],
              backgroundColor: ["#FF6384"],
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching soutenances:", error);
      });
  };

  return (
    <Dashboard>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <h2>Dashboard</h2>
      </div>
      <div className="contrainer center">
        <div className="row">
          <div className="col-md-4">
            <div className="d-flex justify-content-between align-items-center md-4 mt-3 mb-2">
              <h3>USERS</h3>
            </div>
            {userData ? (
              <div style={{ width: "300px", height: "300px" }}>
                <Doughnut data={userData} />
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="col-md-4">
            <div className="d-flex justify-content-between align-items-center md-4 mt-3 mb-2">
              <h3>PROJECTS</h3>
            </div>
            {projectData ? (
              <div style={{ width: "300px", height: "300px" }}>
                <Doughnut data={projectData} />
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="col-md-4">
            <div className="d-flex justify-content-between align-items-center md-4 mt-3 mb-2">
              <h3>Soutenances</h3>
            </div>
            {soutenanceData ? (
              <div style={{ width: "300px", height: "300px" }}>
                <Doughnut data={soutenanceData} />
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>

            <th className="action-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((users) => (
            <tr key={users.userID}>
              <td>{users.name}</td>
              <td>{users.lastname}</td>
              <td>{users.username}</td>
              <td>{users.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Dashboard>
  );
};

export default Dashboard2;
