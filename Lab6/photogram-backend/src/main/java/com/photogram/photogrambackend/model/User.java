package com.photogram.photogrambackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash", nullable = false)
    @JsonIgnore // ✅ Никогда не отправлять хеш пароля в ответе!
    private String passwordHash;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    @JsonBackReference("owner-photos") // ✅ Соответствует @JsonManagedReference в Photo
    @JsonIgnore // ✅ Опционально: не включать список фото пользователя в ответ
    private List<Photo> photos = new ArrayList<>();

    @ManyToMany(mappedBy = "likedBy")
    @JsonIgnore // ✅ Не сериализовать обратную связь
    private List<Photo> likedPhotos = new ArrayList<>();
}