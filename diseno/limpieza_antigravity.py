import json
import csv

def limpiar_datos(archivo_entrada, archivo_salida):
    print(f"--- Iniciando limpieza de Agentes Antigravity ---")
    datos_limpios = []

    try:
        with open(archivo_entrada, 'r', encoding='utf-8') as f:
            # Si es un CSV (muy común en migraciones)
            lector = csv.DictReader(f)
            for fila in lector:
                # EJEMPLO DE LIMPIEZA:
                # 1. Quitar espacios en blanco sobrantes
                nombre = fila['nombre'].strip()
                # 2. Convertir a minúsculas para normalizar
                tipo_agente = fila['tipo'].lower()
                
                datos_limpios.append({
                    "nombre": nombre,
                    "tipo": tipo_agente,
                    "status": "procesado"
                })

        # Guardamos el resultado en un JSON listo para Supabase
        with open(archivo_salida, 'w') as f_out:
            json.dump(datos_limpios, f_out, indent=4)
            
        print(f"Éxito: Se han procesado {len(datos_limpios)} registros.")

    except Exception as e:
        print(f"ERROR Crítico: {e}")

if __name__ == "__main__":
    limpiar_datos('datos_sucios.csv', 'datos_listos_para_supabase.json')