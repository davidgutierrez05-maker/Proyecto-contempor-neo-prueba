-- 1. Tabla de Perfiles (Corregida con IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  role text CHECK (role IN ('drums', 'group', 'composer', 'admin')),
  name text,
  region text,
  bio text,
  avatar_url text,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Instrumentos
CREATE TABLE IF NOT EXISTS instruments (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  family text
);

-- 3. Tabla de Obras (Works)
CREATE TABLE IF NOT EXISTS works (
  id SERIAL PRIMARY KEY,
  composer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  submitted_by uuid REFERENCES profiles(id),
  title text NOT NULL,
  year integer,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla Intermedia
CREATE TABLE IF NOT EXISTS work_instruments (
  work_id integer REFERENCES works(id) ON DELETE CASCADE,
  instrument_id integer REFERENCES instruments(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  PRIMARY KEY (work_id, instrument_id)
);

-- 5. Tabla de Compositores (Aseguramos que existe antes de insertar)
CREATE TABLE IF NOT EXISTS composers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    period TEXT,
    nationality TEXT
);

-- 6. Limpieza e Inserción (Borramos lo que hubiera para evitar duplicados en pruebas)
TRUNCATE TABLE composers RESTART IDENTITY;

INSERT INTO composers (name, period, nationality) VALUES
('Philip Glass', 'Minimalismo', 'Estadounidense'),
('Arvo Pärt', 'Minimalismo Sacro', 'Estonio'),
('Steve Reich', 'Minimalismo', 'Estadounidense'),
('György Ligeti', 'Vanguardia / Micropoliifonía', 'Húngaro/Austriaco'),
('Krzysztof Penderecki', 'Sonorismo / Vanguardia', 'Polaco'),
('John Cage', 'Indeterminación / Aleatorio', 'Estadounidense'),
('Karlheinz Stockhausen', 'Música Serial / Electrónica', 'Alemán'),
('Max Richter', 'Post-minimalismo', 'Británico/Alemán'),
('Kaija Saariaho', 'Espectralismo', 'Finlandesa'),
('Pierre Boulez', 'Serialismo Integral', 'Francés');

-- Verificación
SELECT * FROM composers;