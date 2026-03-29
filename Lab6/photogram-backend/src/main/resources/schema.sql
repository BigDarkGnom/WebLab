CREATE TABLE IF NOT EXISTS users (
                                     id BIGSERIAL PRIMARY KEY,
                                     username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS photos (
                                      id BIGSERIAL PRIMARY KEY,
                                      image_url TEXT,
                                      image_data TEXT,
                                      caption TEXT,
                                      owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS likes (
                                     id BIGSERIAL PRIMARY KEY,
                                     photo_id BIGINT REFERENCES photos(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(photo_id, user_id)
    );

CREATE INDEX IF NOT EXISTS idx_photos_owner ON photos(owner_id);
CREATE INDEX IF NOT EXISTS idx_likes_photo ON likes(photo_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);