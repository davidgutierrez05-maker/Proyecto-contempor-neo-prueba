-- 1. 
CREATE TABLE profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  role text CHECK (role IN ('drums', 'group', 'composer', 'admin')),
  name text,
  region text,
  bio text,
  avatar_url text,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 
CREATE TABLE instruments (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  family text
);

-- 3. 
CREATE TABLE works (
  id SERIAL PRIMARY KEY,
  composer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  submitted_by uuid REFERENCES profiles(id),
  title text NOT NULL,
  year integer,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 
CREATE TABLE work_instruments (
  work_id integer REFERENCES works(id) ON DELETE CASCADE,
  instrument_id integer REFERENCES instruments(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  PRIMARY KEY (work_id, instrument_id)
);

# Proyecto Contemporáneo - Gestión de Instrumentos
Este proyecto utiliza **Supabase** como infraestructura de base de datos relacional.

## Configuración de la Base de Datos
-- **Project ID:** xidiihjezddpbgiexbph
-- **Esquema:** El archivo `schema.sql` contiene la definición de tablas (`profiles`, `instruments`, `works`, `work_instruments`).
-- **Seguridad:** Se ha habilitado Row Level Security (RLS) en todas las tablas.