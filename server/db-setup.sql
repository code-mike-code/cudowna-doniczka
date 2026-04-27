CREATE TABLE IF NOT EXISTS pots (
  id              VARCHAR(36)           PRIMARY KEY,
  serial_number   VARCHAR(50)           NOT NULL UNIQUE,
  mass_kg         DECIMAL(4,2)          NOT NULL,
  model_type      ENUM('S', 'M', 'L')   NOT NULL,
  color           VARCHAR(50)           NOT NULL,
  production_date DATE                  NOT NULL
);
