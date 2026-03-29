import { useState, useRef } from 'react';
import { Modal, Form, Button, Alert, Image } from 'react-bootstrap';
import api from '../api/client';

export default function AddPhotoModal({ show, onHide, onPhotoAdded }) {
  const [imageUrl, setImageUrl] = useState('');
  const [imageData, setImageData] = useState('');
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Конвертация файла в Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Обработка выбора файла
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение (JPG, PNG, GIF)');
      return;
    }

    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    try {
      setError('');
      const base64 = await convertToBase64(file);
      setImageData(base64);
      setPreview(base64);
      setImageUrl(''); // Очищаем URL при загрузке файла
    } catch (err) {
      setError('Ошибка при загрузке файла');
    }
  };

  // Сбросить выбранное фото
  const handleClearPhoto = () => {
    setImageData('');
    setImageUrl('');
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Должен быть либо URL, либо файл
    if (!imageUrl && !imageData) {
      setError('Добавьте ссылку или загрузите фото');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      await api.post('/photos', { 
        imageUrl: imageUrl, 
        imageData: imageData,
        caption: caption 
      });
      onPhotoAdded?.();
      onHide();
      // Сброс формы
      setImageUrl('');
      setImageData('');
      setCaption('');
      setPreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось добавить фото');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>➕ Добавить фото</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          {/* Загрузка файла */}
          <Form.Group className="mb-3">
            <Form.Label>📁 Загрузить с устройства</Form.Label>
            <Form.Control
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Поддерживаются: JPG, PNG, GIF (макс. 5MB)
            </Form.Text>
          </Form.Group>

          {/* ИЛИ ссылка */}
          <Form.Group className="mb-3">
            <Form.Label>🔗 Или вставьте ссылку</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImageData('');
                setPreview(e.target.value);
              }}
              disabled={loading || !!imageData}
            />
          </Form.Group>

          {/* Предпросмотр */}
          {preview && (
            <Form.Group className="mb-3">
              <Form.Label>👁️ Предпросмотр</Form.Label>
              <div className="position-relative">
                <Image 
                  src={preview} 
                  fluid 
                  rounded 
                  className="border"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Image+not+found';
                  }}
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2"
                  onClick={handleClearPhoto}
                  type="button"
                >
                  ✕ Сбросить
                </Button>
              </div>
            </Form.Group>
          )}
          
          {/* Описание */}
          <Form.Group className="mb-3">
            <Form.Label>📝 Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Что на фото? #хэштеги"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={onHide} 
            disabled={loading}
            type="button"
          >
            Отмена
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading || (!imageUrl && !imageData)}
          >
            {loading ? 'Публикация...' : 'Опубликовать'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}