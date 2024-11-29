import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Modal, Button, Form, Stepper } from "react-bootstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";
import soutenanceService from "../services/soutenanceService";
import salleService from "../services/sallesService";
import projetService from "../services/projetService";
import userService from "../services/userService";
import Dashboard from "./Dashboard";

const localizer = momentLocalizer(moment);

const Soutenance = () => {
  const [soutenances, setSoutenances] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [salles, setSalles] = useState([]);
  const [projects, setProjects] = useState([]);
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
    fetchSoutenances();
    fetchProjects();
    fetchTeachers();
  }, []);

  const fetchSoutenances = () => {
    soutenanceService
      .getAllSoutenances()
      .then((response) => {
        const formattedSoutenances = response.data.map((soutenance) => ({
          ...soutenance,
          title: soutenance.project.subject,
          start: new Date(soutenance.date),
          end: new Date(soutenance.date),
        }));
        setSoutenances(formattedSoutenances);
      })
      .catch((error) => {
        console.error("Error fetching soutenances:", error);
      });
  };

  const fetchProjects = () => {
    projetService
      .getAllProjets()
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  };
  console.log(projects);

  const fetchTeachers = () => {
    userService
      .getAllUsers()
      .then((response) => {
        const usersData = response.data;
        setTeachers(usersData.filter((user) => user.role === "Teacher"));
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  };

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

  return (
    <Dashboard>
      <div className="mb-3">
        <h2>Soutenance Planning</h2>
        <Button onClick={() => setShowModal(true)}>Add Soutenance</Button>
      </div>
      <Calendar
        localizer={localizer}
        events={soutenances}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => {
          setSelectedEvent(event);
          setShowModal(true);
        }}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent ? "Edit Soutenance" : "Add Soutenance"}
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
                    <option key={project.projectID} value={project.projetid}>
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
