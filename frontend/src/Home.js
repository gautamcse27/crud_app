import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Card } from "react-bootstrap";

const Home = () => {
  return (
    <div>
      {/* Navigation Bar */}
      

      {/* Welcome Section */}
      <Container className="mt-5">
        <Card className="text-center border-0 shadow-lg">
          <Card.Body>
            <h1 className="display-4 text-primary mb-3">Welcome to the Employee Management Portal</h1>
            <p className="lead text-secondary">Manage users, learn more about us, or get in touch.</p>
          </Card.Body>
        </Card>

        {/* Interactive Links */}
        <div className="row mt-5 text-center">
          <div className="col-md-4">
            <Card className="p-3 shadow border-0">
              <Card.Body>
                <h5 className="text-dark">Manage Users</h5>
                <p className="text-muted">Add, update, or delete employees in your database.</p>
                <Link to="/users" className="btn btn-primary">Go to Users</Link>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="p-3 shadow border-0">
              <Card.Body>
                <h5 className="text-dark">Report</h5>
                <p className="text-muted">See the employees report with all details.</p>
                <Link to="/about" className="btn btn-success">Learn More</Link>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="p-3 shadow border-0">
              <Card.Body>
                <h5 className="text-dark">Contact Us</h5>
                <p className="text-muted">Have questions? Reach out to us today.</p>
                <Link to="/contact" className="btn btn-warning">Contact Now</Link>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
