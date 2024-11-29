import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Dashboard from "./Dashboard"; // Import the Dashboard component
import groupeService from "../services/groupeService"; // Import the Groupe service
import specialiteService from "../services/specialiteService"; // Import the Specialite service
import "./Salles.css"; // Ensure you have the custom CSS file

const Groupe = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentGroupe, setCurrentGroupe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [groupes, setGroupes] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [newGroupe, setNewGroupe] = useState({ name: "", specialite_id: "" }); // Initialize newGroupe state
  const [editGroupe, setEditGroupe] = useState({ name: "", specialite_id: "" }); // Initialize editGroupe state
  const itemsPerPage = 5; // Change this to the number of items you want per page

  useEffect(() => {
    fetchGroupes();
    fetchSpecialites();
  }, []);

  const fetchGroupes = () => {
    // Fetch data from the API
    groupeService
      .getAllGroupes()
      .then((response) => {
        setGroupes(response.data);
        console.log(groupes);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const fetchSpecialites = () => {
    // Fetch data from the API
    specialiteService
      .getAllSpecialites()
      .then((response) => {
        setSpecialites(response.data);
        console.log(specialites);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (groupe) => {
    setCurrentGroupe(groupe);
    setEditGroupe({
      name: groupe.name,
      specialite_id: groupe.grp.specialite_id,
    }); // Set the editGroupe state with current groupe data
    setShowEdit(true);
  };

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (groupe) => {
    setCurrentGroupe(groupe);
    setShowDelete(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = () => {
    groupeService
      .deleteGroupe(currentGroupe.groupeId)
      .then(() => {
        setGroupes(
          groupes.filter((groupe) => groupe.groupeId !== currentGroupe.groupeId)
        );
        setShowDelete(false);
      })
      .catch((error) => {
        console.error("There was an error deleting the groupe!", error);
      });
  };

  const handleAddGroupeChange = (event) => {
    const { name, value } = event.target;
    setNewGroupe({ ...newGroupe, [name]: value });
  };

  const handleAddGroupeSubmit = (event) => {
    event.preventDefault();
    groupeService
      .createGroupe(newGroupe)
      .then((response) => {
        setGroupes([...groupes, response.data]);
        setShowAdd(false);
        setNewGroupe({ name: "", specialite_id: "" }); // Reset the form
        fetchGroupes(); // Refresh the list of groupes
      })
      .catch((error) => {
        console.error("There was an error creating the groupe!", error);
      });
  };

  const handleEditGroupeChange = (event) => {
    const { name, value } = event.target;
    setEditGroupe({ ...editGroupe, [name]: value });
  };

  const handleEditGroupeSubmit = (event) => {
    event.preventDefault();
    groupeService
      .updateGroupe(currentGroupe.groupeId, editGroupe)
      .then(() => {
        fetchGroupes(); // Refresh the list of groupes
        setShowEdit(false);
      })
      .catch((error) => {
        console.error("There was an error updating the groupe!", error);
      });
  };

  const filteredGroupes = groupes.filter(
    (groupe) =>
      groupe.name &&
      groupe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedGroupes = filteredGroupes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredGroupes.length / itemsPerPage);

  return (
    <Dashboard>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <h2>GROUPES</h2>
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
            + Add GROUPE
          </Button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialite Name</th>
            <th className="action-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedGroupes.map((groupe) => (
            <tr key={groupe.groupeId}>
              <td>{groupe.name}</td>
              <td>{groupe.grp.name}</td>
              <td className="action-column">
                <Button
                  variant="success"
                  className="mr-2 btn-sm"
                  onClick={() => handleShowEdit(groupe)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleShowDelete(groupe)}
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
      {/* Add Groupe Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Groupe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddGroupeSubmit}>
            <Form.Group controlId="formGroupeName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={newGroupe.name}
                onChange={handleAddGroupeChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGroupeSpecialite">
              <Form.Label>Specialite</Form.Label>
              <Form.Control
                as="select"
                name="specialite_id"
                value={newGroupe.specialite_id}
                onChange={handleAddGroupeChange}
                required
              >
                <option value="">Select Specialite</option>
                {specialites.map((specialite) => (
                  <option
                    key={specialite.specialite_id}
                    value={specialite.specialitéID}
                  >
                    {specialite.name}
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
      {/* Edit Groupe Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Groupe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditGroupeSubmit}>
            <Form.Group controlId="formGroupeNameEdit">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={editGroupe.name}
                onChange={handleEditGroupeChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGroupeSpecialiteEdit">
              <Form.Label>Specialite</Form.Label>
              <Form.Control
                as="select"
                name="specialite_id"
                value={editGroupe.specialite_id}
                onChange={handleEditGroupeChange}
                required
              >
                <option value="">Select Specialite</option>
                {specialites.map((specialite) => (
                  <option
                    key={specialite.specialite_id}
                    value={specialite.specialitéID}
                  >
                    {specialite.name}
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
        <Modal.Body>Are you sure you want to delete this groupe?</Modal.Body>
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

export default Groupe;
