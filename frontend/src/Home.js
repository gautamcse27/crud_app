import React from "react";
import { Link } from 'react-router-dom';

const Home=()=>{
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Welcome to the Home page</h1>
            <div className="list-group">
                <Link to="/users" className="list-group-item list-group-item-action">
                Manage users
                </Link>
                <Link to="/about" className="list-group-item list-group-item-action">
                    About Us
                </Link>
                <Link to="/contact" className="list-group-item list-group-item-action">
                    Contact Us
                </Link>
            </div>
        </div>
    );
};
export default Home;
