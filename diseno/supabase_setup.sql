-- 1. EXTENSIONES Y SEGURIDAD BASE
-- Habilitar RLS en las tablas existentes (si no se hizo)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_instruments ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA 'PROFILES'
-- Cualquiera puede ver perfiles (para el buscador)
CREATE POLICY "Perfiles públicos" ON profiles FOR SELECT USING (true);

-- Solo el dueño puede editar su propio perfil
CREATE POLICY "Usuarios editan su propio perfil" ON profiles 
FOR UPDATE USING (auth.uid() = id);

-- 3. POLÍTICAS PARA 'WORKS'
-- Cualquiera puede ver obras validadas
CREATE POLICY "Obras validadas son públicas" ON works 
FOR SELECT USING (status = 'validated');

-- Compositores pueden ver sus propias obras (aunque estén pendientes)
CREATE POLICY "Dueños ven sus obras" ON works 
FOR SELECT USING (auth.uid() = composer_id);

-- Solo compositores pueden insertar obras
CREATE POLICY "Compositores insertan obras" ON works 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'composer'
  )
);

-- 4. AUTOMATIZACIÓN DE PERFILES (TRIGGER)
-- Esta función crea una entrada en 'profiles' cada vez que alguien se registra en Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name)
  VALUES (new.id, 'musician', new.email); -- Rol por defecto 'musician'
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- NOTA: Para el rol de 'admin', cámbialo manualmente en la tabla profiles para tu usuario.
