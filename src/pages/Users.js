import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Dashboard from "./Dashboard";
import userService from "../services/userService";
import groupeService from "../services/groupeService";
import "./Salles.css";

const Users = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageTeachers, setCurrentPageTeachers] = useState(1);
  const [currentPageStudents, setCurrentPageStudents] = useState(1);
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "Teacher",
    groupe_id: "",
  });
  const [editUser, setEditUser] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "Teacher",
    groupe_id: "",
  });
  const itemsPerPage = 3;

  useEffect(() => {
    fetchUsers();
    fetchGroupes();
  }, []);

  const fetchUsers = () => {
    userService
      .getAllUsers()
      .then((response) => {
        const usersData = response.data;
        setUsers(usersData);
        setTeachers(usersData.filter((user) => user.role === "Teacher"));
        setStudents(usersData.filter((user) => user.role === "Student"));
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const fetchGroupes = () => {
    groupeService
      .getAllGroupes()
      .then((response) => {
        setGroupes(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (user) => {
    setCurrentUser(user);
    setEditUser({
      name: user.name,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      groupe_id: user.groupe ? user.groupe.groupeId : "",
    });
    setShowEdit(true);
  };

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (user) => {
    setCurrentUser(user);
    setShowDelete(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChangeTeachers = (page) => {
    setCurrentPageTeachers(page);
  };

  const handlePageChangeStudents = (page) => {
    setCurrentPageStudents(page);
  };

  const handleDelete = () => {
    userService
      .deleteUser(currentUser.userID)
      .then(() => {
        setUsers(users.filter((user) => user.userID !== currentUser.userID));
        setTeachers(
          teachers.filter((teacher) => teacher.userID !== currentUser.userID)
        );
        setStudents(
          students.filter((student) => student.userID !== currentUser.userID)
        );
        setShowDelete(false);
      })
      .catch((error) => {
        console.error("There was an error deleting the user!", error);
      });
  };

  const handleAddUserChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUserSubmit = (event) => {
    event.preventDefault();
    userService
      .createUser(newUser)
      .then((response) => {
        setUsers([...users, response.data]);
        setShowAdd(false);
        setNewUser({
          name: "",
          lastname: "",
          username: "",
          email: "",
          password: "",
          role: "Teacher",
          groupe_id: "",
        });
        fetchUsers(); // Refresh the list of users
      })
      .catch((error) => {
        console.error("There was an error creating the user!", error);
      });
  };

  const handleEditUserChange = (event) => {
    const { name, value } = event.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleEditUserSubmit = (event) => {
    event.preventDefault();
    userService
      .updateUser(currentUser.userID, editUser)
      .then(() => {
        fetchUsers(); // Refresh the list of users
        setShowEdit(false);
      })
      .catch((error) => {
        console.error("There was an error updating the user!", error);
      });
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name &&
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(
    (student) =>
      student.name &&
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTeachers = filteredTeachers.slice(
    (currentPageTeachers - 1) * itemsPerPage,
    currentPageTeachers * itemsPerPage
  );

  const paginatedStudents = filteredStudents.slice(
    (currentPageStudents - 1) * itemsPerPage,
    currentPageStudents * itemsPerPage
  );

  const totalPagesTeachers = Math.ceil(filteredTeachers.length / itemsPerPage);
  const totalPagesStudents = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <Dashboard>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <h2>TEACHERS</h2>
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
            + Add User
          </Button>
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
          {paginatedTeachers.map((teacher) => (
            <tr key={teacher.userID}>
              <td>{teacher.name}</td>
              <td>{teacher.lastname}</td>
              <td>{teacher.username}</td>
              <td>{teacher.email}</td>

              <td className="action-column">
                <Button
                  variant="success"
                  className="mr-2 btn-sm"
                  onClick={() => handleShowEdit(teacher)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleShowDelete(teacher)}
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
          <li
            className={`page-item ${
              currentPageTeachers === 1 ? "disabled" : ""
            }`}
          >
            <Button
              className="page-link"
              onClick={() => handlePageChangeTeachers(currentPageTeachers - 1)}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only"></span>
            </Button>
          </li>
          {[...Array(totalPagesTeachers)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPageTeachers === index + 1 ? "active" : ""
              }`}
            >
              <Button
                className="page-link"
                onClick={() => handlePageChangeTeachers(index + 1)}
              >
                {index + 1}
              </Button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPageTeachers === totalPagesTeachers ? "disabled" : ""
            }`}
          >
            <Button
              className="page-link"
              onClick={() => handlePageChangeTeachers(currentPageTeachers + 1)}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only"></span>
            </Button>
          </li>
        </ul>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h2>STUDENTS</h2>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>

            <th>Groupe</th>
            <th className="action-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map((student) => (
            <tr key={student.userID}>
              <td>{student.name}</td>
              <td>{student.lastname}</td>
              <td>{student.username}</td>
              <td>{student.email}</td>

              <td>{student.groupe ? student.groupe.name : ""}</td>
              <td className="action-column">
                <Button
                  variant="success"
                  className="mr-2 btn-sm"
                  onClick={() => handleShowEdit(student)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleShowDelete(student)}
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
          <li
            className={`page-item ${
              currentPageStudents === 1 ? "disabled" : ""
            }`}
          >
            <Button
              className="page-link"
              onClick={() => handlePageChangeStudents(currentPageStudents - 1)}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only"></span>
            </Button>
          </li>
          {[...Array(totalPagesStudents)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPageStudents === index + 1 ? "active" : ""
              }`}
            >
              <Button
                className="page-link"
                onClick={() => handlePageChangeStudents(index + 1)}
              >
                {index + 1}
              </Button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPageStudents === totalPagesStudents ? "disabled" : ""
            }`}
          >
            <Button
              className="page-link"
              onClick={() => handlePageChangeStudents(currentPageStudents + 1)}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only"></span>
            </Button>
          </li>
        </ul>
      </nav>

      {/* Add User Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddUserSubmit}>
            <Form.Group controlId="formUserName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={newUser.name}
                onChange={handleAddUserChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserLastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastname"
                value={newUser.lastname}
                onChange={handleAddUserChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={newUser.username}
                onChange={handleAddUserChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={newUser.email}
                onChange={handleAddUserChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={newUser.password}
                onChange={handleAddUserChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={newUser.role}
                onChange={handleAddUserChange}
                required
              >
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </Form.Control>
            </Form.Group>
            {newUser.role === "Student" && (
              <Form.Group controlId="formUserGroupe">
                <Form.Label>Groupe</Form.Label>
                <Form.Control
                  as="select"
                  name="groupe_id"
                  value={newUser.groupe_id}
                  onChange={handleAddUserChange}
                  required
                >
                  <option value="">Select Groupe</option>
                  {groupes.map((groupe) => (
                    <option key={groupe.groupeId} value={groupe.groupeId}>
                      {groupe.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
            <div className="modal-footer">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditUserSubmit}>
            <Form.Group controlId="formUserNameEdit">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={editUser.name}
                onChange={handleEditUserChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserLastnameEdit">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastname"
                value={editUser.lastname}
                onChange={handleEditUserChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserUsernameEdit">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={editUser.username}
                onChange={handleEditUserChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserEmailEdit">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={editUser.email}
                onChange={handleEditUserChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserPasswordEdit">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={editUser.password}
                onChange={handleEditUserChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserRoleEdit">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={editUser.role}
                onChange={handleEditUserChange}
                required
              >
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </Form.Control>
            </Form.Group>
            {editUser.role === "Student" && (
              <Form.Group controlId="formUserGroupeEdit">
                <Form.Label>Groupe</Form.Label>
                <Form.Control
                  as="select"
                  name="groupe_id"
                  value={editUser.groupe_id}
                  onChange={handleEditUserChange}
                  required
                >
                  <option value="">Select Groupe</option>
                  {groupes.map((groupe) => (
                    <option key={groupe.groupeId} value={groupe.groupeId}>
                      {groupe.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
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

export default Users;
