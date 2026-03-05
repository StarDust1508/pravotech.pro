-- Хранение файлов в PostgreSQL как BYTEA
ALTER TABLE media ADD COLUMN IF NOT EXISTS file_data BYTEA;
