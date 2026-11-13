-- Etap 0.3 + 0.6
-- pots.status: a pot is visible on /pot/:uuid only once its chip was written,
-- locked read-only and confirmed (status 'encoded' or later 'active').
ALTER TABLE pots
  ADD COLUMN status ENUM('registered', 'encoded', 'active', 'void') NOT NULL DEFAULT 'registered';

-- Every pot created before this migration already has a chip in the field.
-- Without this line all sold pots would start returning 404.
UPDATE pots SET status = 'encoded';

-- Sequential serial numbers per model and day (replaces 2 random hex bytes).
CREATE TABLE IF NOT EXISTS serial_counters (
  model_type ENUM('S', 'M', 'L') NOT NULL,
  day        DATE                NOT NULL,
  last_value INT UNSIGNED        NOT NULL,
  PRIMARY KEY (model_type, day)
);
