-- 1. Perfiles de Usuario (Corregido según Directrices Maestras)
CREATE TABLE profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  role text CHECK (role IN ('musician', 'composer', 'admin')), -- Roles exclusivos
  name text,
  country text, -- Cambiado de region a country
  gender text CHECK (gender IN ('female', 'male', 'other')), -- Nuevo: Requisito del jefe
  bio text,
  avatar_url text,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Catálogo de Instrumentos
CREATE TABLE instruments (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  family text
);

-- 3. Obras Musicales
CREATE TABLE works (
  id SERIAL PRIMARY KEY,
  composer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  submitted_by uuid REFERENCES profiles(id),
  title text NOT NULL,
  year integer, -- Permite intervalos en el buscador
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Relación Obra-Instrumentos (Muchos a Muchos)
CREATE TABLE work_instruments (
  work_id integer REFERENCES works(id) ON DELETE CASCADE,
  instrument_id integer REFERENCES instruments(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  PRIMARY KEY (work_id, instrument_id)
);

-- NOTA: Se ha habilitado Row Level Security (RLS) en todas las tablas.
-- Un usuario es o 'composer' o 'musician', nunca ambos.
