import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const UserApp = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [qualification, setQualification] = useState('');
    const [address, setAddress] = useState('');
    const [workExperience, setWorkExperience] = useState('');
    const [achievement, setAchievement] = useState('');
    const [remarks, setRemarks] = useState('');
    const [photo, setPhoto] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [editId, setEditId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10); 

    // Fetch all users
    const fetchUsers = async () => {
        const response = await axios.get('http://localhost:8000/users');
        setUsers(response.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    

    // Create or update a user
    const handleSubmit = async (e) => {
        e.preventDefault();
        

        const formData=new FormData();
        formData.append('name', name);
        formData.append('email',email);
        formData.append('mobile',mobile);
        formData.append('qualification', qualification);
        formData.append('address', address);
        formData.append('work_experience', workExperience);
        formData.append('achievement', achievement);
        formData.append('remarks', remarks);
        if (photo){
          formData.append('photo', photo);
        if (pdfFile) formData.append('pdf', pdfFile);
        }
        try{
        if (editId) {
            await axios.put(`http://localhost:8000/users/${editId}`, formData,{
                headers:{'Content-Type': 'multipart/form-data'},
            });
        } else {
            const response =await axios.post('http://localhost:8000/users', formData,{
                headers: {'Content-Type': 'multipart/form-data'},
            });
            if (response.data.error){
                alert(response.data.error);
                return;
            }
        }
        setName('');
        setEmail('');
        setMobile('');
        setQualification('');
        setAddress('');
        setWorkExperience('');
        setPhoto(null);
        setPdfFile(null);
        setEditId(null);
        fetchUsers();
    } catch (err) {
        if(err.response && err.response.data.error){
            alert(err.response.data.error);
        }else{
      console.error(err);
        }
  }
    };

    // Delete a user
    const deleteUser = async (id) => {
        await axios.delete(`http://localhost:8000/users/${id}`);
        fetchUsers();
    };

    // Edit a user
    const editUser = (user) => {
        setName(user.name);
        setEmail(user.email);
        setMobile(user.mobile || '');
        setQualification(user.qualification || '');
        setAddress(user.address || '');
         setWorkExperience(user.work_experience || '');
         setAchievement(user.achievement || '');
         setRemarks(user.remarks || '');
        setEditId(user.id);
    };
    const indexOfLastUser = currentPage*usersPerPage;
    const indexOfFirstUser= indexOfLastUser-usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const paginate =(pageNumber)=> setCurrentPage(pageNumber);
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">User Database Management</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="card p-4 shadow">
                        <h2 className="text-center mb-4">{editId ? 'Edit User' : 'Add User'}</h2>
                        <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        </div>
                        <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Mobile Number</label>
                          <input
                               type="tel"
                               className="form-control"
                               placeholder="Enter mobile number"
                               value={mobile}
                                 onChange={(e) => setMobile(e.target.value)}
                                 required
                                 pattern="[0-9]{10}"
                              maxLength="10"
                            />
                        </div>
                        <div className="col-md-6">
                         <label className="form-label">Qualification</label>
                         <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Qualification"
                               value={qualification}
                               onChange={(e) => setQualification(e.target.value)}
                               required
                         />
                        </div>
                        </div>
                        <div className="mb-3">
                             <label className="form-label">Address</label>
                              <textarea
                             className="form-control"
                             placeholder="Enter Address"
                             rows="3"
                                value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Work Experience</label>
                          <input
                             type="text"
                               className="form-control"
                               placeholder="Mention Work experience"
                            value={workExperience}
                           onChange={(e) => setWorkExperience(e.target.value)}
                           required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Achievement</label>
                        <input
                          type="text"
                            className="form-control"
                             placeholder="Received any Prize"
                        value={achievement}
                         onChange={(e) => setAchievement(e.target.value)}
                         required
                         />
                    </div>
                    <div className="mb-3">
                         <label className="form-label">Remarks</label>
                        <input
                            type="text"
                            className="form-control"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        required
                        />
                    </div>
                        <div className="mb-3">
                            <label htmlFor="photo" className="form-label">Upload Photo ( Max 5MB)</label>
                            <input
                                type="file"
                                className="form-control"
                                id="photo"
                                onChange={(e) => setPhoto(e.target.files[0])}
                                
                            />
                            <small className="text-muted">Leave blank to keep existing photo</small>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Upload Certificate (Max 5MB)</label>
                            <input
                                type="file"
                                 className="form-control"
                                accept="application/pdf"
                                onChange={(e) => setPdfFile(e.target.files[0])}
                                
                            />
                            <small className="text-muted">Leave blank to keep existing PDF</small>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            {editId ? 'Update' : 'Create'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="row justify-content-center mt-5">
                <div className="col-md-8">
                    <h2 className="text-center mb-4">User List</h2>
                    <table className="table table-striped table-hover shadow">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Qualification</th>
                                <th>Address</th>
                                <th>Work Experience</th>
                                <th>Achievement</th>
                                <th>Remarks</th>
                                <th>Photo</th>
                                <th>Certificate</th>
                                <th>Actions</th>
                                <th>Profile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user,index) => (
                                <tr key={user.id}>
                                    
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
                                        {user.photo && (
                                            <img
                                                src={`data:image/jpeg;base64,${user.photo}`}
                                                alt="User"
                                                style={{ width: '80px', height: '100px', borderRadius: '0%' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        {user.pdf && (
                                        <a 
                                             href={`data:application/pdf;base64,${user.pdf}`} 
                                              download={`${user.name}_document.pdf`}
                                             className="btn btn-sm btn-info"
                                        >
                                       View Certificate
                                         </a>
                                         )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => editUser(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td>
                                 <Link to={`/users/${user.id}`} className="btn btn-sm btn-info">
                                  View Profile
                                 </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <nav>
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
                                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button onClick={() => paginate(i + 1)} className="page-link">
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default UserApp;
