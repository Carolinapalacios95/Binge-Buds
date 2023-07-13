import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';
const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const handleToggle = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <Navbar className="color-nav" variant="light" expand="lg" expanded={expanded}>
        <Container fluid>
          <Navbar.Brand className="style-navbarbrand" as={Link} to="/">
            <img className="style-logo" src="../bblogodesign.png" alt="logo"  />
          </Navbar.Brand>
          <Navbar.Toggle className="style-toggler" aria-controls="navbar" onClick={handleToggle} />
          <Navbar.Collapse id="navbar" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/" onClick={handleToggle}>
                Search For Movies
              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to="/saved" onClick={handleToggle}>
                    See Your Movies
                  </Nav.Link>
                  <Nav.Link onClick={() => { Auth.logout(); handleToggle(); }}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => { setShowModal(true); handleToggle(); }}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal
        size="lg"
        show={showModal}
        onHide={() => { setShowModal(false); setExpanded(false); }}
        aria-labelledby="signup-modal"
      >
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => { setShowModal(false); setExpanded(false); }} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => { setShowModal(false); setExpanded(false); }} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};
export default AppNavbar;