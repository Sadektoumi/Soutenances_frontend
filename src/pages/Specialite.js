import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Dashboard from "./Dashboard"; // Import the Dashboard component
import specialiteService from "../services/specialiteService"; // Import the Specialite service
import "./Salles.css"; // Ensure you have the custom CSS file

const Specialite = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentSpecialite, setCurrentSpecialite] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [specialites, setSpecialites] = useState([]);
  const [newSpecialite, setNewSpecialite] = useState({
    name: "",
    specialiteType: "Master",
  }); // Initialize newSpecialite state
  const [editSpecialite, setEditSpecialite] = useState({
    name: "",
    specialiteType: "Master",
  }); // Initialize editSpecialite state
  const itemsPerPage = 5; // Change this to the number of items you want per page

  useEffect(() => {
    fetchSpecialites();
  }, []);

  const fetchSpecialites = () => {
    // Fetch data from the API
    specialiteService
      .getAllSpecialites()
      .then((response) => {
        setSpecialites(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (specialite) => {
    setCurrentSpecialite(specialite);
    setEditSpecialite({
      name: specialite.name,
      specialiteType: specialite.specialiteType,
    }); // Set the editSpecialite state with current specialite data
    setShowEdit(true);
  };

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (specialite) => {
    setCurrentSpecialite(specialite);
    setShowDelete(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = () => {
    specialiteService
      .deleteSpecialite(currentSpecialite.specialitéID)
      .then(() => {
        setSpecialites(
          specialites.filter(
            (specialite) =>
              specialite.specialitéID !== currentSpecialite.specialitéID
          )
        );
        setShowDelete(false);
      })
      .catch((error) => {
        console.error("There was an error deleting the specialite!", error);
      });
  };

  const handleAddSpecialiteChange = (event) => {
    const { name, value } = event.target;
    setNewSpecialite({ ...newSpecialite, [name]: value });
  };

  const handleAddSpecialiteSubmit = (event) => {
    event.preventDefault();
    specialiteService
      .createSpecialite(newSpecialite)
      .then((response) => {
        setSpecialites([...specialites, response.data]);
        setShowAdd(false);
        setNewSpecialite({ name: "", specialiteType: "Master" }); // Reset the form
        fetchSpecialites(); // Refresh the list of specialites
      })
      .catch((error) => {
        console.error("There was an error creating the specialite!", error);
      });
  };

  const handleEditSpecialiteChange = (event) => {
    const { name, value } = event.target;
    setEditSpecialite({ ...editSpecialite, [name]: value });
  };

  const handleEditSpecialiteSubmit = (event) => {
    event.preventDefault();
    specialiteService
      .updateSpecialite(currentSpecialite.specialitéID, editSpecialite)
      .then(() => {
        fetchSpecialites(); // Refresh the list of specialites
        setShowEdit(false);
      })
      .catch((error) => {
        console.error("There was an error updating the specialite!", error);
      });
  };

  const filteredSpecialites = specialites.filter(
    (specialite) =>
      specialite.name &&
      specialite.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSpecialites = filteredSpecialites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSpecialites.length / itemsPerPage);

  return (
    <Dashboard>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <h2>SPECIALITES</h2>
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
            + Specialite
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialite Type</th>
            <th className="action-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSpecialites.map((specialite) => (
            <tr key={specialite.specialitéID}>
              <td>{specialite.name}</td>
              <td>{specialite.specialiteType}</td>
              <td className="action-column">
                <Button
                  variant="success"
                  className="mr-2 btn-sm"
                  onClick={() => handleShowEdit(specialite)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleShowDelete(specialite)}
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

      {/* Add Specialite Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Specialite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSpecialiteSubmit}>
            <Form.Group controlId="formSpecialiteName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={newSpecialite.name}
                onChange={handleAddSpecialiteChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSpecialiteType">
              <Form.Label>Specialite Type</Form.Label>
              <Form.Control
                as="select"
                name="specialiteType"
                value={newSpecialite.specialiteType}
                onChange={handleAddSpecialiteChange}
                required
              >
                <option value="Master">Master</option>
                <option value="Ingenierie">Ingenierie</option>
                <option value="Licence">Licence</option>
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

      {/* Edit Specialite Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Specialite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSpecialiteSubmit}>
            <Form.Group controlId="formSpecialiteNameEdit">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={editSpecialite.name}
                onChange={handleEditSpecialiteChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSpecialiteTypeEdit">
              <Form.Label>Specialite Type</Form.Label>
              <Form.Control
                as="select"
                name="specialiteType"
                value={editSpecialite.specialiteType}
                onChange={handleEditSpecialiteChange}
                required
              >
                <option value="Master">Master</option>
                <option value="Ingenierie">Ingenierie</option>
                <option value="Licence">Licence</option>
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
        <Modal.Body>
          Are you sure you want to delete this specialite?
        </Modal.Body>
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

export default Specialite;
