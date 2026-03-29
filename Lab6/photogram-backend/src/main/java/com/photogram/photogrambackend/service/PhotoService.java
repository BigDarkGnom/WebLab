package com.photogram.photogrambackend.service;

import com.photogram.photogrambackend.model.Photo;
import com.photogram.photogrambackend.model.User;
import com.photogram.photogrambackend.repository.PhotoRepository;
import com.photogram.photogrambackend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PhotoService {

    private static final Logger log = LoggerFactory.getLogger(PhotoService.class);

    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;

    public PhotoService(PhotoRepository photoRepository, UserRepository userRepository) {
        this.photoRepository = photoRepository;
        this.userRepository = userRepository;
    }

    /**
     * Получить все фотографии для ленты
     */
    public List<Photo> getAllPhotos() {
        log.info("Загрузка всех фотографий для ленты");
        List<Photo> photos = photoRepository.findAllByOrderByCreatedAtDesc();
        log.info("Найдено {} фотографий", photos.size());
        return photos;
    }

    /**
     * Добавить новую фотографию
     */
    public Photo addPhoto(String imageUrl, String imageData, String caption, Long ownerId) {
        log.info("Добавление фото для пользователя {}", ownerId);

        // Валидация: должно быть либо URL, либо Base64 данные
        boolean hasUrl = imageUrl != null && !imageUrl.trim().isEmpty();
        boolean hasData = imageData != null && !imageData.trim().isEmpty();

        if (!hasUrl && !hasData) {
            log.warn("Попытка добавить фото без изображения");
            throw new RuntimeException("Требуется либо imageUrl, либо imageData");
        }

        // Валидация размера Base64 (макс ~7.5MB после кодирования)
        if (hasData && imageData.length() > 10_000_000) {
            log.warn("Попытка добавить слишком большое фото: {} символов", imageData.length());
            throw new RuntimeException("Изображение слишком большое (макс. 10MB)");
        }

        // Проверка существования владельца
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> {
                    log.error("Пользователь {} не найден", ownerId);
                    return new RuntimeException("User not found");
                });

        // Создание и сохранение фото
        Photo photo = new Photo();
        photo.setImageUrl(hasUrl ? imageUrl : null);
        photo.setImageData(hasData ? imageData : null);
        photo.setCaption(caption);
        photo.setOwner(owner);

        Photo saved = photoRepository.save(photo);
        log.info("Фото успешно добавлено с ID: {}", saved.getId());

        return saved;
    }

    /**
     * Поставить лайк на фотографию
     */
    public Photo likePhoto(Long photoId, Long userId) {
        log.info("Попытка лайка: photoId={}, userId={}", photoId, userId);

        // Находим фото с загруженным списком лайков
        Photo photo = photoRepository.findByIdWithLikes(photoId)
                .orElseThrow(() -> {
                    log.error("Фото {} не найдено", photoId);
                    return new RuntimeException("Photo not found");
                });

        // Находим пользователя
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("Пользователь {} не найден", userId);
                    return new RuntimeException("User not found");
                });

        // Добавляем лайк, если его ещё нет
        if (!photo.getLikedBy().contains(user)) {
            photo.getLikedBy().add(user);
            log.info("Пользователь {} лайкнул фото {}", userId, photoId);
        } else {
            log.info("Пользователь {} уже лайкнул фото {}", userId, photoId);
        }

        return photoRepository.save(photo);
    }

    /**
     * Убрать лайк с фотографии
     */
    public Photo unlikePhoto(Long photoId, Long userId) {
        log.info("Попытка удаления лайка: photoId={}, userId={}", photoId, userId);

        // Находим фото с загруженным списком лайков
        Photo photo = photoRepository.findByIdWithLikes(photoId)
                .orElseThrow(() -> {
                    log.error("Фото {} не найдено", photoId);
                    return new RuntimeException("Photo not found");
                });

        // Находим пользователя
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("Пользователь {} не найден", userId);
                    return new RuntimeException("User not found");
                });

        // Удаляем лайк
        if (photo.getLikedBy().remove(user)) {
            log.info("Пользователь {} убрал лайк с фото {}", userId, photoId);
        } else {
            log.info("Пользователь {} не лайкал фото {}", userId, photoId);
        }

        return photoRepository.save(photo);
    }
}