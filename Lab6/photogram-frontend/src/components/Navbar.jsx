import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar bg="white" border="bottom" className="mb-4">
      <Container>
        <Navbar.Brand 
          href="/" 
          className="fw-bold"
          style={{ color: '#667eea' }}
        >
          📸 Фотограм
        </Navbar.Brand>
        
        <Nav className="ms-auto">
          {user ? (
            <>
              <Nav.Item className="d-flex align-items-center me-3">
                <div className="avatar me-2">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-muted">{user.username}</span>
              </Nav.Item>
              <Button variant="outline-secondary" size="sm" onClick={() => {
                logout();
                navigate('/');
              }}>
                Выйти
              </Button>
            </>
          ) : (
            <Nav.Item>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Войти
              </Button>
            </Nav.Item>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}