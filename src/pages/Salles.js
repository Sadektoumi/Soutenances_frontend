import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Dashboard from "./Dashboard"; // Import the Dashboard component
import sallesService from "../services/sallesService"; // Import the Salles service
import "./Salles.css"; // Ensure you have the custom CSS file

const Salles = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentSalle, setCurrentSalle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [salles, setSalles] = useState([]);
  const [newSalle, setNewSalle] = useState({ name: "", type: "Salle" }); // Initialize newSalle state
  const [editSalle, setEditSalle] = useState({ name: "", type: "Salle" }); // Initialize editSalle state
  const itemsPerPage = 5; // Change this to the number of items you want per page

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = () => {
    // Fetch data from the API
    sallesService
      .getAllSalles()
      .then((response) => {
        setSalles(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (salle) => {
    setCurrentSalle(salle);
    setEditSalle({ name: salle.name, type: salle.type }); // Set the editSalle state with current salle data
    setShowEdit(true);
  };

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (salle) => {
    setCurrentSalle(salle);
    setShowDelete(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = () => {
    sallesService
      .deleteSalle(currentSalle.salleId)
      .then(() => {
        setSalles(
          salles.filter((salle) => salle.salleId !== currentSalle.salleId)
        );
        setShowDelete(false);
      })
      .catch((error) => {
        console.error("There was an error deleting the salle!", error);
      });
  };

  const handleAddSalleChange = (event) => {
    const { name, value } = event.target;
    setNewSalle({ ...newSalle, [name]: value });
  };

  const handleAddSalleSubmit = (event) => {
    event.preventDefault();
    sallesService
      .createSalle(newSalle)
      .then((response) => {
        setSalles([...salles, response.data]);
        setShowAdd(false);
        setNewSalle({ name: "", type: "Salle" }); // Reset the form
        fetchSalles(); // Refresh the list of salles
      })
      .catch((error) => {
        console.error("There was an error creating the salle!", error);
      });
  };

  const handleEditSalleChange = (event) => {
    const { name, value } = event.target;
    setEditSalle({ ...editSalle, [name]: value });
  };

  const handleEditSalleSubmit = (event) => {
    event.preventDefault();
    sallesService
      .updateSalle(currentSalle.salleId, editSalle)
      .then(() => {
        fetchSalles(); // Refresh the list of salles
        setShowEdit(false);
      })
      .catch((error) => {
        console.error("There was an error updating the salle!", error);
      });
  };

  const filteredSalles = salles.filter(
    (salle) =>
      salle.name && salle.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSalles = filteredSalles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSalles.length / itemsPerPage);

  return (
    <Dashboard>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <h2>SALLES</h2>
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
            + Add Salles
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Salle Type</th>
            <th className="action-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSalles.map((salle) => (
            <tr key={salle.salleId}>
              <td>{salle.name}</td>
              <td>{salle.type}</td>
              <td className="action-column">
                <Button
                  variant="success"
                  className="mr-2 btn-sm"
                  onClick={() => handleShowEdit(salle)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleShowDelete(salle)}
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

      {/* Add Salle Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Salle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSalleSubmit}>
            <Form.Group controlId="formSalleName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={newSalle.name}
                onChange={handleAddSalleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSalleType">
              <Form.Label>Salle Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={newSalle.type}
                onChange={handleAddSalleChange}
                required
              >
                <option value="Laboratoir">Laboratoire</option>
                <option value="Salle">Salle</option>
                <option value="amphi">amphi</option>
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

      {/* Edit Salle Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Salle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSalleSubmit}>
            <Form.Group controlId="formSalleNameEdit">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={editSalle.name}
                onChange={handleEditSalleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSalleTypeEdit">
              <Form.Label>Salle Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={editSalle.type}
                onChange={handleEditSalleChange}
                required
              >
                <option value="Laboratoir">Laboratoire</option>
                <option value="Salle">Salle</option>
                <option value="amphi">Amphi</option>
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
        <Modal.Body>Are you sure you want to delete this salle?</Modal.Body>
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

export default Salles;
