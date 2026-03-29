package com.photogram.photogrambackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "photos")
@Data
@NoArgsConstructor
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "image_data", length = 10000000)
    private String imageData;

    private String caption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonManagedReference("owner-photos")
    private User owner;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToMany
    @JoinTable(
            name = "likes",
            joinColumns = @JoinColumn(name = "photo_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private List<User> likedBy = new ArrayList<>();

    @Transient
    public List<SimpleUser> getLikedBySimple() {
        if (likedBy == null) return new ArrayList<>();
        return likedBy.stream()
                .map(u -> new SimpleUser(u.getId(), u.getUsername()))
                .toList();
    }

    @Transient
    public String getDisplayUrl() {
        if (imageData != null && !imageData.isEmpty()) {
            return imageData;
        }
        return imageUrl;
    }

    /**
     * Простой DTO для представления пользователя в API
     * Без Lombok — чтобы избежать проблем с компиляцией
     */
    public static class SimpleUser {
        private Long id;
        private String username;

        public SimpleUser() {
            // Пустой конструктор для Jackson
        }

        public SimpleUser(Long id, String username) {
            this.id = id;
            this.username = username;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
}