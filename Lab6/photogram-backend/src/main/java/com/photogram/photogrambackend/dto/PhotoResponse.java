package com.photogram.photogrambackend.dto;

import com.photogram.photogrambackend.model.Photo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoResponse {
    private Long id;
    private String displayUrl;  // Только для отображения (Base64 или URL)
    private String caption;
    private SimpleUser owner;
    private LocalDateTime createdAt;
    private List<SimpleUser> likedBy;

    // ✅ Фабричный метод: конвертирует Photo → PhotoResponse
    public static PhotoResponse fromEntity(Photo photo) {
        return new PhotoResponse(
                photo.getId(),
                photo.getDisplayUrl(),
                photo.getCaption(),
                photo.getOwner() != null
                        ? new SimpleUser(photo.getOwner().getId(), photo.getOwner().getUsername())
                        : null,
                photo.getCreatedAt(),
                photo.getLikedBy().stream()
                        .map(u -> new SimpleUser(u.getId(), u.getUsername()))
                        .collect(Collectors.toList())
        );
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SimpleUser {
        private Long id;
        private String username;
    }
}