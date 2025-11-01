import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";

const AppNavbar = () => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Navbar 
      expand="lg" 
      className={`custom-navbar ${isLandingPage ? 'navbar-landing' : 'navbar-default'}`}
      style={{
        backgroundColor: isLandingPage ? '#161b22' : '#ffffff',
        backdropFilter: isLandingPage ? 'blur(10px)' : 'none',
        borderBottom: isLandingPage ? '1px solid #30363d' : '1px solid #e1e4e8',
        boxShadow: isLandingPage ? 'none' : '0 1px 3px rgba(0,0,0,0.12)',
        transition: 'all 0.3s ease',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/"
          className="navbar-brand-custom"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem',
            color: isLandingPage ? '#f0f6fc' : '#24292f',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}
        >
          <FaExclamationTriangle style={{ fontSize: '1.5rem', color: isLandingPage ? '#58a6ff' : '#0969da' }} />
          <span>Duvidha Ki Suvidha</span>
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          style={{
            borderColor: isLandingPage ? '#30363d' : '#d1d9e0',
            color: isLandingPage ? '#c9d1d9' : '#24292f'
          }}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {token ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/dashboard"
                  style={{
                    color: isLandingPage ? '#c9d1d9' : '#24292f',
                    fontWeight: 500,
                    marginRight: '0.5rem',
                    textDecoration: 'none'
                  }}
                >
                  Dashboard
                </Nav.Link>
                {user?.role === 'maintainer' && (
                  <Nav.Link 
                    as={Link} 
                    to="/admin"
                    style={{
                      color: isLandingPage ? '#c9d1d9' : '#24292f',
                      fontWeight: 500,
                      marginRight: '0.5rem',
                      textDecoration: 'none'
                    }}
                  >
                    Admin Panel
                  </Nav.Link>
                )}
                <Button
                  variant={isLandingPage ? "outline-secondary" : "outline-secondary"}
                  size="sm"
                  className="ms-2"
                  onClick={handleLogout}
                  style={{
                    fontWeight: 500,
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    borderColor: isLandingPage ? '#30363d' : '#d1d9e0',
                    color: isLandingPage ? '#c9d1d9' : '#24292f',
                    backgroundColor: 'transparent'
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link}
                  to="/login"
                  style={{
                    color: isLandingPage ? '#c9d1d9' : '#24292f',
                    fontWeight: 500,
                    marginRight: '1rem',
                    textDecoration: 'none'
                  }}
                >
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/signup"
                  variant="success"
                  size="sm"
                  style={{
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontWeight: 500,
                    backgroundColor: '#238636',
                    borderColor: '#238636',
                    color: '#ffffff'
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
