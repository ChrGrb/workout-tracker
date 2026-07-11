-- Runs on first boot of the local zero-db (postgres:16) container.
-- POSTGRES_DB already creates zero_cvr; this adds the change-log database.
CREATE DATABASE zero_change;
