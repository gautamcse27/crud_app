import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const UserApp = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState(null);
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
        if (photo){
          formData.append('photo', photo);
        }
        try{
        if (editId) {
            await axios.put(`http://localhost:8000/users/${editId}`, formData,{
                headers:{'Content-Type': 'multipart/form-data'},
            });
        } else {
            await axios.post('http://localhost:8000/users', formData,{
                headers: {'Content-Type': 'multipart/form-data'},
            });
        }
        setName('');
        setEmail('');
        setPhoto(null);
        setEditId(null);
        fetchUsers();
    } catch (err) {
      console.error(err);
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
        setEditId(user.id);
    };
    const indexOfLastUser = currentPage*usersPerPage;
    const indesOfFirstUser= indexOfLastUser-usersPerPage;
    const currentUsers = users.slice(indesOfFirstUser, indexOfLastUser);
    const paginate =(pageNumber)=> setCurrentPage(pageNumber);
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">CRUD with React and PostgreSQL</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="card p-4 shadow">
                        <h2 className="text-center mb-4">{editId ? 'Edit User' : 'Add User'}</h2>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="photo" className="form-label">Photo</label>
                            <input
                                type="file"
                                className="form-control"
                                id="photo"
                                onChange={(e) => setPhoto(e.target.files[0])}
                            />
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
                                <th>Photo</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
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