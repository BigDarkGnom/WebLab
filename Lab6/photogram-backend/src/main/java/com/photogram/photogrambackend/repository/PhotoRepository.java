package com.photogram.photogrambackend.repository;

import com.photogram.photogrambackend.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional; // <--- Импортировать

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findAllByOrderByCreatedAtDesc();

    // Добавили Optional и @Param
    @Query("SELECT p FROM Photo p LEFT JOIN FETCH p.likedBy WHERE p.id = :id")
    Optional<Photo> findByIdWithLikes(@Param("id") Long id);
}