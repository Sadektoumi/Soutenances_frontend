import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Card, Row, Col } from "react-bootstrap";
import soutenanceService from "../services/soutenanceService";
import { jwtDecode } from "jwt-decode";
import "./Student.css";

const Student = () => {
  const [soutenances, setSoutenances] = useState([]);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const username = decodedToken.sub;

  useEffect(() => {
    fetchSoutenances();
  }, []);

  const fetchSoutenances = () => {
    soutenanceService
      .getAllSoutenances()
      .then((response) => {
        const studentSoutenances = response.data.filter(
          (soutenance) => soutenance.projet.etudiant_id.username === username
        );
        setSoutenances(studentSoutenances);

        // Console log the username of the etudiant_id
        studentSoutenances.forEach((soutenance) => {
          console.log(soutenance.projet.etudiant_id.username);
        });
      })
      .catch((error) => {
        console.error("Error fetching soutenances:", error);
      });
  };

  return (
    <div className="student-page">
      <Navbar expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="#">SOUTENANCE</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="#">Profile</Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
              >
                Logout
              </Nav.Link>
              <Nav.Link disabled>Welcome, {username}</Nav.Link>{" "}
              {/* Add username to the navbar */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="mt-4 mobile-interface">
        {" "}
        {/* Add mobile-interface class */}
        <h2>My Soutenances</h2>
        <Row className="mobile-interface-grid">
          {" "}
          {/* Add mobile-interface-grid class */}
          {soutenances.map((soutenance) => (
            <Col key={soutenance.soutenanceId} sm={12} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{soutenance.projet.sujet}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {soutenance.dateSoutenance} at {soutenance.heureSoutenance}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Salle:</strong> {soutenance.salle.name}
                    <br />
                    <strong>Jury:</strong> {soutenance.jury.name}
                    <br />
                    <strong>Rapporteur:</strong> {soutenance.rapporteur.name}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Student;
