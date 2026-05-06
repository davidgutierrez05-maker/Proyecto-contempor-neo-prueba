-- 1. SIMULACIÓN DE USUARIO NO LOGUEADO (Intruso)
-- Vamos a decirle a la base de datos que no hay ningún usuario
SET request.jwt.claims = '{"sub": null}'; 

-- Intenta ver todos los perfiles
SELECT * FROM profiles; 
-- (Deberías verlos porque los pusimos como "Públicos")

-- Intenta insertar una obra sin ser compositor
INSERT INTO works (title, status) VALUES ('Obra Intruza', 'validated');
-- (DEBE FALLAR o no dejarte, porque no eres un usuario registrado con rol 'composer')


-- 2. SIMULACIÓN DE USUARIO LOGUEADO PERO SIN PERMISOS
-- Simulamos un ID de usuario cualquiera
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0000-000000000000"}';

-- Intenta ver las obras que NO están validadas (pendientes)
SELECT * FROM works WHERE status = 'pending';
-- (Debería salir VACÍO, porque solo el dueño o el admin pueden verlas)
