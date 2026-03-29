import { useState } from 'react';
import { Card, Button, Collapse } from 'react-bootstrap';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function PhotoCard({ photo, onLikeChange }) {
  const { user } = useAuth();
  const [showLikes, setShowLikes] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Проверяем, лайкнул ли текущий пользователь это фото
  const isLiked = photo.likedBy?.some(u => u.id === user?.id);
  const likeCount = photo.likedBy?.length || 0;

  const handleLike = async () => {
    if (!user || loading) return;
    setLoading(true);
    
    try {
      // Определяем метод и эндпоинт в зависимости от состояния лайка
      const method = isLiked ? 'delete' : 'post';
      await api[method](`/photos/${photo.id}/like`);
      
      // Уведомляем родительский компонент об изменении
      onLikeChange?.();
    } catch (err) {
      console.error('Like error:', err);
      alert('Не удалось изменить лайк');
    } finally {
      setLoading(false);
    }
  };

  // Определяем источник изображения (Base64 или URL)
  const imageSrc = photo.displayUrl || photo.imageUrl || photo.imageData;

  return (
    <Card className="mb-4 shadow-sm photo-card">
      {/* Заголовок карточки */}
      <Card.Header className="bg-white d-flex align-items-center">
        <div className="avatar me-2">
          {photo.owner?.username?.charAt(0).toUpperCase() || '?'}
        </div>
        <strong>@{photo.owner?.username || 'unknown'}</strong>
      </Card.Header>
      
      {/* Изображение */}
      <Card.Img 
        variant="top" 
        src={imageSrc} 
        alt={photo.caption || 'Photo'}
        style={{ 
          maxHeight: '500px', 
          objectFit: 'contain', 
          cursor: 'pointer',
          backgroundColor: '#f8f9fa'
        }}
        onError={(e) => {
          // Если изображение не загрузилось, показываем заглушку
          e.target.src = 'https://via.placeholder.com/600x400?text=Image+not+found';
        }}
      />
      
      {/* Тело карточки */}
      <Card.Body>
        {/* Описание фото */}
        {photo.caption && (
          <Card.Text className="mb-3">{photo.caption}</Card.Text>
        )}
        
        {/* Кнопки действий */}
        <div className="d-flex align-items-center gap-2">
          <Button
            variant={isLiked ? 'danger' : 'outline-danger'}
            size="sm"
            className="btn-like"
            onClick={handleLike}
            disabled={!user || loading}
          >
            {isLiked ? '❤️' : '🤍'} {likeCount > 0 && `(${likeCount})`}
          </Button>
          
          {/* Кнопка показа списка лайкнувших */}
          {user && likeCount > 0 && (
            <Button
              variant="link"
              size="sm"
              className="text-muted p-0"
              onClick={() => setShowLikes(!showLikes)}
            >
              {showLikes ? 'Скрыть' : `Кто лайкнул (${likeCount})`}
            </Button>
          )}
        </div>
        
        {/* Выпадающий список лайкнувших */}
        <Collapse in={showLikes}>
          <div className="mt-2 pt-2 border-top">
            <small className="text-muted">
              Лайкнули:{' '}
              {photo.likedBy?.map(u => (
                <span key={u.id} className="me-1">@{u.username}</span>
              ))}
            </small>
          </div>
        </Collapse>
      </Card.Body>
      
      {/* Подвал с датой */}
      <Card.Footer className="bg-white text-muted small">
        {photo.createdAt 
          ? new Date(photo.createdAt).toLocaleString('ru-RU')
          : 'Только что'}
      </Card.Footer>
    </Card>
  );
}