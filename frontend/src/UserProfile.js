import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    const { id } = useParams(); // Get the user ID from the URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${id}`);
                setUser(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">User Profile</h1>
            <div className="card shadow">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 text-center">
                            {user.photo && (
                                <img
                                    src={`data:image/jpeg;base64,${user.photo}`}
                                    alt="User"
                                    className="img-fluid rounded-circle mb-3"
                                    style={{ width: '150px', height: '150px' }}
                                />
                            )}
                            <h3>{user.name}</h3>
                            <p className="text-muted">{user.email}</p>
                        </div>
                        <div className="col-md-8">
                            <h4>Details</h4>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>Mobile:</strong> {user.mobile}
                                </li>
                                <li className="list-group-item">
                                    <strong>Qualification:</strong> {user.qualification}
                                </li>
                                <li className="list-group-item">
                                    <strong>Address:</strong> {user.address}
                                </li>
                                <li className="list-group-item">
                                    <strong>Work Experience:</strong> {user.work_experience}
                                </li>
                                <li className="list-group-item">
                                    <strong>Achievement:</strong> {user.achievement}
                                </li>
                                <li className="list-group-item">
                                    <strong>Remarks:</strong> {user.remarks}
                                </li>
                            </ul>
                            {user.pdf && (
                                <div className="mt-4">
                                    <a
                                        href={`data:application/pdf;base64,${user.pdf}`}
                                        download={`${user.name}_document.pdf`}
                                        className="btn btn-primary"
                                    >
                                        User's Certificate
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
