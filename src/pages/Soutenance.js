import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import soutenanceService from "../services/soutenanceService";
import salleService from "../services/sallesService";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import projetService from "../services/projetService";
import userService from "../services/userService";
import Dashboard from "./Dashboard";

const Soutenance = () => {
  const [soutenances, setSoutenances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [currentSoutenance, setCurrentSoutenance] = useState([]);
  const [salles, setSalles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [newSoutenance, setNewSoutenance] = useState({
    date: "",
    time: "",
    salle: "",
    jury: "",
    rapporteur: "",
    projet: "",
  });

  useEffect(() => {
    fetchCurrentSoutenance();
    fetchSoutenances();
    fetchProjects();
    fetchTeachers();
  }, []);
  const fetchCurrentSoutenance = (id) => {
    soutenanceService
      .getSoutenance(id)
      .then((response) => {
        setCurrentSoutenance(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  };
  console.log(currentSoutenance);
  const fetchSoutenances = () => {
    soutenanceService
      .getAllSoutenances()
      .then((response) => {
        setSoutenances(response.data);
      })
      .catch((error) => {
        console.error("Error fetching soutenances:", error);
      });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const fetchProjects = () => {
    projetService
      .getAvailableProjets()
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  };

  const fetchTeachers = (date, time) => {
    userService
      .getTeacherAvailable(date, time)
      .then((response) => {
        const usersData = response.data;
        setTeachers(usersData.filter((user) => user.role === "Teacher"));
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  };
  const filteredSoutenance = soutenances.filter(
    (soutenance) =>
      soutenance.sujet &&
      soutenance.sujet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchAvailableSalles = (date, time) => {
    salleService
      .getAvailableSalles(date, time)
      .then((response) => {
        setSalles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching available salles:", error);
      });
  };

  const handleNextStep = () => {
    if (step === 0) {
      fetchAvailableSalles(newSoutenance.date, newSoutenance.time);
    } else {
      if (step === 1) {
        fetchTeachers(newSoutenance.date, newSoutenance.time);
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleAddSoutenance = () => {
    soutenanceService
      .createSoutenance(newSoutenance)
      .then(() => {
        fetchSoutenances();
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error creating soutenance:", error);
      });
  };

  const handleDeleteSoutenance = (id) => {
    soutenanceService
      .deleteSoutenance(id)
      .then(() => {
        fetchSoutenances();
      })
      .catch((error) => {
        console.error("Error deleting soutenance:", error);
      });
  };

  const handleShowModal = (event = null) => {
    setShowModal(true);
    if (event) {
      setNewSoutenance({
        date: event.date,
        time: event.time,
        salle: event.salle,
        jury: event.jury,
        rapporteur: event.rapporteur,
        projet: event.projet,
      });
    } else {
      setNewSoutenance({
        date: "",
        time: "",
        salle: "",
        jury: "",
        rapporteur: "",
        projet: "",
      });
    }
  };

  return (
    <Dashboard>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2 ">
        <h2>SOUTENANCE PLANNING</h2>
        {/* <Button onClick={() => handleShowModal()}>Add Soutenance</Button> */}
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <Form className=" sm-2  ">
          <Form.Control
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </Form>
        <div className="sm-4">
          <Button
            variant="secondary "
            className="btn-rounded"
            onClick={handleShowModal}
          >
            + Add SOUTENANCE
          </Button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Salle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {soutenances.map((soutenance) => (
            <tr key={soutenance.soutenance_id}>
              <td>{soutenance.projet.sujet}</td>
              <td>{soutenance.dateSoutenance}</td>
              <td>{soutenance.heureSoutenance}</td>
              <td>{soutenance.salle.name}</td>
              <td>
                <Button
                  variant="success"
                  className="btn-sm"
                  onClick={() => handleShowModal(soutenance)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() =>
                    handleDeleteSoutenance(soutenance.soutenanceId)
                  }
                >
                  <FaTrash />
                </Button>

                <Button
                  variant="info"
                  className="btn-sm"
                  onClick={() => alert(`Details of ${soutenance.projet.sujet}`)}
                >
                  <FaEye />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {newSoutenance.soutenanceID ? "Edit Soutenance" : "Add Soutenance"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {step === 0 && (
              <div>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newSoutenance.date}
                    onChange={(e) =>
                      setNewSoutenance({
                        ...newSoutenance,
                        date: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={newSoutenance.time}
                    onChange={(e) =>
                      setNewSoutenance({
                        ...newSoutenance,
                        time: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
            )}
            {step === 1 && (
              <Form.Group>
                <Form.Label>Salle</Form.Label>
                <Form.Control
                  as="select"
                  value={newSoutenance.salle}
                  onChange={(e) =>
                    setNewSoutenance({
                      ...newSoutenance,
                      salle: e.target.value,
                    })
                  }
                >
                  <option value="">Select Salle</option>
                  {salles.map((salle) => (
                    <option key={salle.salleId} value={salle.salleId}>
                      {salle.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
            {step === 2 && (
              <div>
                <Form.Group>
                  <Form.Label>Jury</Form.Label>
                  <Form.Control
                    as="select"
                    value={newSoutenance.jury}
                    onChange={(e) =>
                      setNewSoutenance({
                        ...newSoutenance,
                        jury: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Jury</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.userID} value={teacher.userID}>
                        {teacher.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Rapporteur</Form.Label>
                  <Form.Control
                    as="select"
                    value={newSoutenance.rapporteur}
                    onChange={(e) =>
                      setNewSoutenance({
                        ...newSoutenance,
                        rapporteur: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Rapporteur</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.userID} value={teacher.userID}>
                        {teacher.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
            )}
            {step === 3 && (
              <Form.Group>
                <Form.Label>Project</Form.Label>
                <Form.Control
                  as="select"
                  value={newSoutenance.projet}
                  onChange={(e) =>
                    setNewSoutenance({
                      ...newSoutenance,
                      projet: e.target.value,
                    })
                  }
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.projetid} value={project.projetid}>
                      {project.sujet}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {step > 0 && (
            <Button variant="secondary" onClick={handlePrevStep}>
              Previous
            </Button>
          )}
          {step < 3 && (
            <Button variant="primary" onClick={handleNextStep}>
              Next
            </Button>
          )}
          {step === 3 && (
            <Button variant="primary" onClick={handleAddSoutenance}>
              Save
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Dashboard>
  );
};

export default Soutenance;
