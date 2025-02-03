import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  const generatePDF = async () => {
    const doc = new jsPDF();

    // Fetch user data
    const usersWithPhotos = await axios.get('http://localhost:8000/users');

    // Prepare table data
    const tableData = usersWithPhotos.data.map((user, index) => [
        index + 1, 
        user.id, 
        user.name, 
        user.email, 
        user.photo ? '' : 'N/A'
    ]);

    // Add table headers and content
    autoTable(doc, {
        head: [['S.No', 'ID', 'Name', 'Email', 'Photo']],
        body: tableData,
        didDrawCell: (data) => {
            // Skip the header row by checking row.index existence
            if (data.section== 'body' && data.column.index === 4) {
                const user = usersWithPhotos.data[data.row.index];
                if (user.photo) {
                    const base64Img = `data:image/jpeg;base64,${user.photo}`;
                    doc.addImage(base64Img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 15, 15);
                }
            }
        },
        startY: 20,
        margin: { top: 10 },
        styles: { cellPadding: 5, fontSize: 10, overflow: 'linebreak' },
    });

    doc.save('users_with_photos.pdf');
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
              <td>
            {user.photo ? (
            <img
            src={`data:image/jpeg;base64,${user.photo}`}
            alt="User Photo"
            style={{ width: '80px', height: '100px', borderRadius: '0%' }}
            />
    ) : (
        'N/A'
    )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default About;
