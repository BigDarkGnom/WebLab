import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import AppNavbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import PhotoFeed from './components/PhotoFeed';

// Защищённый маршрут
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading">Загрузка...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  
  return children;
};

function App() {
  return (
    <>
      <AppNavbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<PhotoFeed />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <PhotoFeed />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Футер */}
      <footer className="py-3 text-center text-muted small border-top mt-auto">
        <Container>
          Фотограм © {new Date().getFullYear()} — Лабораторная работа №6
        </Container>
      </footer>
    </>
  );
}

export default App;