import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Dashboard from "./Dashboard"; // Import the Dashboard component
import projetService from "../services/projetService"; // Import the Projet service
import userService from "../services/userService"; // Import the User service
import "./Salles.css"; // Ensure you have the custom CSS file

const Projet = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentProjet, setCurrentProjet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projets, setProjets] = useState([]);
  const [students, setStudents] = useState([]);
  const [availableStudent, setAvailableStudent] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [newProjet, setNewProjet] = useState({
    sujet: "",
    etudiant_id: "",
    etudiant2_id: "",
    encadrant_id: "",
  });
  const [editProjet, setEditProjet] = useState({
    sujet: "",
    etudiant_id: "",
    etudiant2_id: "",
    encadrant_id: "",
  });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProjets();
    fetchUsers();
    fetchavailableStudent();
  }, []);

  const fetchProjets = () => {
    projetService
      .getAllProjets()
      .then((response) => {
        setProjets(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const fetchavailableStudent = () => {
    userService
      .getStudentsAvailable()
      .then((response) => {
        const usersData = response.data;
        setAvailableStudent(
          usersData.filter(
            (user) => user.role === "Student" && !projets.etudiant_id
          )
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };
  console.log(availableStudent);

  const fetchUsers = () => {
    userService
      .getAllUsers()
      .then((response) => {
        const usersData = response.data;
        setStudents(
          usersData.filter(
            (user) => user.role === "Student" && !projets.etudiant_id
          )
        );

        setTeachers(usersData.filter((user) => user.role === "Teacher"));
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };
  console.log(students);

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (projet) => {
    setCurrentProjet(projet);
    setEditProjet({
      sujet: projet.sujet,
      etudiant_id: projet.etudiant_id ? projet.etudiant_id.userID : "",
      etudiant2_id: projet.etudiant2_id ? projet.etudiant2_id.userID : "",
      encadrant_id: projet.encadrant_id.userID,
    });
    setShowEdit(true);
  };

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (projet) => {
    setCurrentProjet(projet);
    setShowDelete(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = () => {
    projetService
      .deleteProjet(currentProjet.projetid)
      .then(() => {
        setProjets(
          projets.filter((projet) => projet.projetid !== currentProjet.projetid)
        );
        setShowDelete(false);
        fetchavailableStudent();
      })
      .catch((error) => {
        console.error("There was an error deleting the projet!", error);
      });
  };

  const handleAddProjetChange = (event) => {
    const { name, value } = event.target;
    setNewProjet({ ...newProjet, [name]: value });
  };

  const handleAddProjetSubmit = (event) => {
    event.preventDefault();
    projetService
      .createProjet(newProjet)
      .then((response) => {
        setProjets([...projets, response.data]);
        setShowAdd(false);
        setNewProjet({
          sujet: "",
          etudiant_id: "",
          etudiant2_id: "",
          encadrant_id: "",
        });
        fetchProjets();
        fetchavailableStudent();
      })
      .catch((error) => {
        console.error("There was an error creating the projet!", error);
      });
  };

  const handleEditProjetChange = (event) => {
    const { name, value } = event.target;
    setEditProjet({ ...editProjet, [name]: value });
  };

  const handleEditProjetSubmit = (event) => {
    event.preventDefault();
    projetService
      .updateProjet(currentProjet.projetid, editProjet)
      .then(() => {
        fetchProjets();
        setShowEdit(false);
        fetchavailableStudent();
      })
      .catch((error) => {
        console.error("There was an error updating the projet!", error);
      });
  };

  const filteredProjets = projets.filter(
    (projet) =>
      projet.sujet &&
      projet.sujet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProjets = filteredProjets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProjets.length / itemsPerPage);

  return (
    <Dashboard>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <h2>PROJETS</h2>
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
            onClick={handleShowAdd}
          >
            + Add Projet
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Project Subject</th>
            <th>Student</th>
            <th>Supervisor</th>
            <th className="action-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProjets.map((projet) => (
            <tr key={projet.projetId}>
              <td>{projet.sujet}</td>
              <td>
                {projet.etudiant_id ? projet.etudiant_id.name : ""}
                {projet.etudiant2_id ? `, ${projet.etudiant2_id.name}` : ""}
              </td>
              <td>{projet.encadrant_id ? projet.encadrant_id.name : ""}</td>
              <td className="action-column">
                <Button
                  variant="success"
                  className="mr-2 btn-sm"
                  onClick={() => handleShowEdit(projet)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleShowDelete(projet)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <nav
        aria-label="Page navigation example"
        className="d-flex justify-content-end"
      >
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <Button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only"></span>
            </Button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <Button
                className="page-link"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <Button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only"></span>
            </Button>
          </li>
        </ul>
      </nav>

      {/* Add Projet Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Projet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProjetSubmit}>
            <Form.Group controlId="formProjetSujet">
              <Form.Label>Project Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project subject"
                name="sujet"
                value={newProjet.sujet}
                onChange={handleAddProjetChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formProjetEtudiant">
              <Form.Label>Student</Form.Label>
              <Form.Control
                as="select"
                name="etudiant_id"
                value={newProjet.etudiant_id}
                onChange={handleAddProjetChange}
                required
              >
                <option value="">Select Student</option>
                {availableStudent.map((availableStudent) => (
                  <option
                    key={availableStudent.userID}
                    value={availableStudent.userID}
                  >
                    {availableStudent.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProjetEtudiant2">
              <Form.Label>Second Student (Optional)</Form.Label>
              <Form.Control
                as="select"
                name="etudiant2_id"
                value={newProjet.etudiant2_id}
                onChange={handleAddProjetChange}
              >
                <option value="">Select Student</option>
                {availableStudent.map((availableStudent) => (
                  <option
                    key={availableStudent.userID}
                    value={availableStudent.userID}
                  >
                    {availableStudent.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProjetEncadrant">
              <Form.Label>Supervisor</Form.Label>
              <Form.Control
                as="select"
                name="encadrant_id"
                value={newProjet.encadrant_id}
                onChange={handleAddProjetChange}
                required
              >
                <option value="">Select Supervisor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.userID} value={teacher.userID}>
                    {teacher.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <div className="modal-footer">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Projet Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Projet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditProjetSubmit}>
            <Form.Group controlId="formProjetSujetEdit">
              <Form.Label>Project Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project subject"
                name="sujet"
                value={editProjet.sujet}
                onChange={handleEditProjetChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formProjetEtudiantEdit">
              <Form.Label>Student</Form.Label>
              <Form.Control
                as="select"
                name="etudiant_id"
                value={editProjet.etudiant_id}
                onChange={handleEditProjetChange}
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.userID} value={student.userID}>
                    {student.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProjetEtudiant2Edit">
              <Form.Label>Second Student (Optional)</Form.Label>
              <Form.Control
                as="select"
                name="etudiant2_id"
                value={editProjet.etudiant2_id}
                onChange={handleEditProjetChange}
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.userID} value={student.userID}>
                    {student.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProjetEncadrantEdit">
              <Form.Label>Supervisor</Form.Label>
              <Form.Control
                as="select"
                name="encadrant_id"
                value={editProjet.encadrant_id}
                onChange={handleEditProjetChange}
                required
              >
                <option value="">Select Supervisor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.userID} value={teacher.userID}>
                    {teacher.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <div className="modal-footer">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this projet?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            No
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Dashboard>
  );
};

export default Projet;
