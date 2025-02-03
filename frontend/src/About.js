import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('User List Report', 14, 16);

    const tableData = users.map((user, index) => [
      index + 1,
      user.name,
      user.email,
      user.photo ? 'Available' : 'N/A',
    ]);

    doc.autoTable({
      head: [['S.No', 'Name', 'Email', 'Photo']],
      body: tableData,
      startY: 25,
    });

    doc.save('user-data-report.pdf');
  };

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">CRUD App</a>
          <button className="btn btn-outline-success" onClick={generatePDF}>
            Download PDF
          </button>
        </div>
      </nav>

      <h2 className="text-center mb-4">User List</h2>
      <table className="table table-striped table-hover shadow">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.photo ? 'Available' : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default About;
