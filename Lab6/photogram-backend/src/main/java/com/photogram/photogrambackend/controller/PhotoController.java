package com.photogram.photogrambackend.controller;

import com.photogram.photogrambackend.dto.PhotoResponse;
import com.photogram.photogrambackend.model.Photo;
import com.photogram.photogrambackend.service.PhotoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "*")
public class PhotoController {

    private static final Logger log = LoggerFactory.getLogger(PhotoController.class);
    private final PhotoService photoService;

    public PhotoController(PhotoService photoService) {
        this.photoService = photoService;
    }

    @GetMapping
    public ResponseEntity<List<PhotoResponse>> getFeed() {
        List<Photo> photos = photoService.getAllPhotos();
        List<PhotoResponse> response = photos.stream()
                .map(PhotoResponse::fromEntity)
                .collect(Collectors.toList());
        log.info("Возвращено {} фото в ленте", response.size());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<PhotoResponse> addPhoto(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody PhotoRequest request) {

        log.info("Добавление фото: userId={}, hasImageData={}, caption={}",
                userId,
                request.imageData() != null && !request.imageData().isEmpty(),
                request.caption());

        Photo photo = photoService.addPhoto(
                request.imageUrl(),
                request.imageData(),
                request.caption(),
                userId
        );
        return ResponseEntity.ok(PhotoResponse.fromEntity(photo));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<PhotoResponse> likePhoto(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        Photo photo = photoService.likePhoto(id, userId);
        return ResponseEntity.ok(PhotoResponse.fromEntity(photo));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<PhotoResponse> unlikePhoto(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        Photo photo = photoService.unlikePhoto(id, userId);
        return ResponseEntity.ok(PhotoResponse.fromEntity(photo));
    }

    public record PhotoRequest(String imageUrl, String imageData, String caption) {}
}