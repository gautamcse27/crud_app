import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import RealAbout from './RealAbout';
import Contact from './Contact';
import UserApp from './UserApp';
import UserProfile from './UserProfile';
import SearchUser from './SearchUser'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Card } from "react-bootstrap";
import './App.css';
const App = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
        <Router>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                <Navbar.Brand href="/">Employee Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/users" style={{ color: "#FFFFFF" }}>Manage Users</Nav.Link>
              <Nav.Link as={Link} to="/searchuser" style={{ color: "#FFFFFF" }}>Search a User</Nav.Link>
              <Nav.Link as={Link} to="/about" style={{ color: "#FFFFFF" }}>Report</Nav.Link>
              <Nav.Link as={Link} to="/contact" style={{ color: "#FFFFFF" }}>Contact Us</Nav.Link>
              <Nav.Link as={Link} to="/realabout" style={{ color: "#FFFFFF" }}>About Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
                    
                </div>
            </nav>
            <div className="flex-grow-1">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<UserApp />} />
                <Route path="/searchuser" element={<SearchUser/>} />
                <Route path="/about" element={<About />} />
                <Route path="/realabout" element={<RealAbout />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/users/:id" element={<UserProfile />} />
            </Routes>
            </div>
            <footer className="bg-dark text-white text-center py-3 mt-4">
                    <Container>
                        <p>&copy; {new Date().getFullYear()} Employee Management App. All rights reserved.</p>
                        <Nav className="justify-content-center">
                            <Nav.Link as={Link} to="/realabout" style={{ color: "#FFFFFF" }}>About</Nav.Link>
                            <Nav.Link as={Link} to="/contact" style={{ color: "#FFFFFF" }}>Contact</Nav.Link>
                        </Nav>
                    </Container>
                </footer>
        </Router>
        </div>
    );
};

export default App;
