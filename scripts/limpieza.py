import csv
import json
import os

def limpiar_texto(texto):
    """Quita espacios en blanco y pone mayúscula en cada palabra."""
    return " ".join(texto.split()).title()

def limpiar_fecha(fecha):
    """Intenta extraer el año de una fecha sucia."""
    # Extraer los últimos 4 dígitos si es un año completo al final o el string completo si son 4 números
    import re
    match = re.search(r'\d{4}', fecha)
    return int(match.group()) if match else None

def limpiar_lista(lista_str):
    """Convierte 'Violin, Cello' en ['Violin', 'Cello'] limpios."""
    return [limpiar_texto(i) for i in lista_str.split(',')]

def procesar_datos(input_file, output_file):
    resultados = []
    
    if not os.path.exists(input_file):
        print(f"Error: No se encuentra el archivo {input_file}")
        return

    with open(input_file, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            obra_limpia = {
                "titulo": limpiar_texto(row['titulo']),
                "compositor": limpiar_texto(row['compositor']),
                "anio": limpiar_fecha(row['fecha']),
                "instrumentos": limpiar_lista(row['instrumentos']),
                "estado": "pending" # Valor por defecto según tablas.sql
            }
            resultados.append(obra_limpia)

    with open(output_file, mode='w', encoding='utf-8') as jsonfile:
        json.dump(resultados, jsonfile, indent=4, ensure_ascii=False)
    
    print(f"¡Éxito! Datos limpiados y guardados en {output_file}")

if __name__ == "__main__":
    # Rutas relativas
    input_csv = os.path.join('datos', 'repertorio_sucio.csv')
    output_json = os.path.join('datos', 'repertorio_limpio.json')
    
    procesar_datos(input_csv, output_json)
