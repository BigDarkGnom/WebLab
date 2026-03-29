import { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Button, Card } from 'react-bootstrap';
import api from '../api/client';
import PhotoCard from './PhotoCard';
import AddPhotoModal from './AddPhotoModal';
import { useAuth } from '../context/AuthContext';

export default function PhotoFeed() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { user } = useAuth();

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/photos');
      setPhotos(response.data);
      setError('');
    } catch (err) {
      setError('Не удалось загрузить ленту');
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  if (loading && photos.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Загрузка фотографий...</p>
      </Container>
    );
  }

  return (
    <Container className="py-3" style={{ maxWidth: '600px' }}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
          <div>
            <Button variant="outline-danger" size="sm" onClick={loadPhotos}>
              Повторить
            </Button>
          </div>
        </Alert>
      )}
      
      {/* Кнопка добавления для авторизованных */}
      {user && (
        <div className="mb-4">
          <Button 
            variant="primary" 
            className="w-100"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Добавить фото
          </Button>
        </div>
      )}
      
      {/* Лента */}
      {photos.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h3 className="text-muted mb-3">📭 Пусто</h3>
            <p className="text-muted">
              {user 
                ? 'Будьте первым — добавьте фото!' 
                : 'Зарегистрируйтесь, чтобы увидеть ленту'}
            </p>
          </Card.Body>
        </Card>
      ) : (
        photos.map(photo => (
          <PhotoCard 
            key={photo.id} 
            photo={photo} 
            onLikeChange={loadPhotos}
          />
        ))
      )}
      
      {/* Модальное окно добавления */}
      <AddPhotoModal 
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onPhotoAdded={loadPhotos}
      />
    </Container>
  );
}