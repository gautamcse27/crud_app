import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage,setUsersPerPage] = useState(10);

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
// Logic to get users for the current page
const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

// Change page
const paginate = (pageNumber) => setCurrentPage(pageNumber);
const handleUsersPerPageChange =(e)=>{
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
};
  // Generate PDF
  const generatePDF = async () => {
    const doc = new jsPDF('landscape');

    // Fetch user data
    const usersWithPhotos = await axios.get('http://localhost:8000/users');
    doc.setFontSize(18);
    doc.text('User List with Photos', 14, 20);
    doc.setFontSize(12);
    doc.text('Below is the list of users with their photos:', 14, 30);
    const startY = 40;
    // Prepare table data
    const tableData = usersWithPhotos.data.map((user, index) => [
        index + 1, 
        user.id, 
        user.name, 
        user.email, 
        user.mobile,
        user.qualification,
        user.address,
        user.work_experience,
        user.achievement,
        user.remarks,
        user.photo ? '' : 'N/A',
        user.pdf? 'Y': 'N/A'
    ]);

    // Add table headers and content
    autoTable(doc, {
       
        head: [['S.No', 'ID', 'Name', 'Email','Contact','Qualification','Address','Work Experience','Achievement','Remarks','Photo','Certificate']],
        body: tableData,
        didDrawCell: (data) => {
            // Skip the header row by checking row.index existence
            if (data.section== 'body' && data.column.index === 10) {
                const user = usersWithPhotos.data[data.row.index];
                if (user.photo) {
                    const base64Img = `data:image/jpeg;base64,${user.photo}`;
                    doc.addImage(base64Img, 'JPEG', data.cell.x + 1, data.cell.y + 1, 10, 10);
                }
            }
        },
        startY,
        margin: { top: 10 },
        styles: { cellPadding: 5, fontSize: 10, overflow: 'linebreak' },
    });

    doc.save('users_with_photos.pdf');
};

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">User Management App</a>
          <button className="btn btn-outline-success" onClick={generatePDF}>
            Download PDF
          </button>
        </div>
      </nav>

      <h2 className="text-center mb-4">User List</h2>
      
      <table className="table table-striped table-hover shadow">
        <thead>
          <tr>
          <th>S.No</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Qualification</th>
            <th>Address</th>
            <th>Work Experience</th>
            <th>Achievement</th>
            <th>Remarks</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
            
          {currentUsers.map((user,index) => (
            <tr key={user.id}>
                <td>{index + 1+(currentPage -1)*usersPerPage}</td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.qualification}</td>
              <td>{user.address}</td>
              <td>{user.work_experience}</td>
              <td>{user.achievement}</td>
              <td>{user.remarks}</td>
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
    <div className="d-flex justify-content-center mt-4">
        <button
            className="btn btn-primary mx-2"
            onClick={()=> paginate(currentPage-1)}
            disabled={currentPage===1}
            >
                Previous
            </button>
            <button
                className="btn btn-primary mx-2"
                onClick={()=> paginate(currentPage +1)}
                disabled={currentPage*usersPerPage >=users.length}
                >
                    Next
                </button>
        </div>
        <div className="d-flex justify-content-between mb-3">
        <label>Show</label>
        <select
            className="form-select w-auto"
            value={usersPerPage}
            onChange={handleUsersPerPageChange}
            >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
          <option value={100}>100</option>
            </select>
            <label>Users per page</label>
      </div>
        </div>
  );
};

export default About;
