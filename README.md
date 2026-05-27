# 🌿 EcoHabitat — Gestión de Almacenes

Aplicación web para la gestión de inventario de almacenes y registro de mantenimiento de maquinaria según normas ISO 9001 e ISO 14001.

## Almacenes gestionados
- **Zarza la Mayor**
- **Plasencia**

## Funcionalidades

### 📦 Inventario
- Consultar stock de productos por almacén o globalmente
- Filtrar por nombre, nivel de stock (sin stock / bajo / OK)
- Dar de alta nuevos productos
- Editar unidades por almacén
- Dar de baja productos

### ⚙️ Maquinaria
- Registro de todas las máquinas con numeración correlativa por categoría:
  - 🌿 **Desbrozadoras** (Nº1, Nº2, ...)
  - 🪚 **Motosierras** (Nº1, Nº2, ...)
  - 🔧 **Herramientas** (Nº1, Nº2, ...)
- Dar de alta nuevas máquinas (número asignado automáticamente)
- Registrar bajas con motivo
- Ver estado activa/baja

### 🔧 Mantenimiento (ISO 9001 / ISO 14001)
- Logo EcoHabitat integrado en la cabecera con respaldo embebido para evitar fallos en GitHub Pages.
- Plan preventivo con cálculo automático de próxima revisión:
  - Diario: cada 1 día
  - Semanal/Quincenal: cada 14 días
  - Mensual: cada 30 días
- Panel de alertas para equipos vencidos o próximos a vencer.
- Campo de incidencia, riesgo ambiental y acción correctiva/preventiva para trazabilidad ISO 9001 e ISO 14001.
- **Motosierras y Desbrozadoras:**
  - Diario: Filtro, engrase cabezal, cambio de disco, limpieza carcasa
  - Semanal/Quincenal: Revisión general, bujías, filtros de combustible
  - Mensual: Revisión y limpieza general, cambio de piezas dañadas
- **Herramientas:**
  - Por uso: Limpieza general, revisión de partes, baterías y conexiones
- Historial completo con técnico, fecha y almacén
- Filtros por tipo de mantenimiento y categoría

### 📊 Google Sheets
- Sincronización automática con Google Sheets tras cada cambio
- 3 hojas: Inventario, Maquinaria, Mantenimiento
- Formato con colores por tipo de mantenimiento y estado

---

## 🚀 Despliegue en GitHub Pages

1. Sube los archivos a un repositorio GitHub:
   ```
   index.html
   Logo_Ecohabitat.jpg
   apps-script.gs
   README.md
   ```

2. Ve a **Settings → Pages**

3. Fuente: `Deploy from a branch` → rama `main` → carpeta `/ (root)`

4. Tu app estará en: `https://tu-usuario.github.io/nombre-repositorio`

---

## 🔗 Configuración Google Sheets

### Paso 1: Crear la Google Sheet
Crea una nueva hoja en Google Sheets. El sistema creará automáticamente las pestañas necesarias.

### Paso 2: Apps Script
1. En tu Google Sheet, ve a **Extensiones → Apps Script**
2. Borra el código existente y pega el contenido de `apps-script.gs`
3. En la línea `const SHEET_ID = '...'`, pon el ID de tu hoja (lo encuentras en la URL entre `/d/` y `/edit`)
4. Guarda el proyecto (Ctrl+S)

### Paso 3: Desplegar como Web App
1. Haz clic en **Implementar → Nueva implementación**
2. Tipo: **Aplicación web**
3. Ejecutar como: **Yo**
4. Quién tiene acceso: **Cualquier persona**
5. Haz clic en **Implementar** y copia la URL generada

### Paso 4: Configurar en la app
1. Abre la app y ve a **⚙️ Configuración**
2. Pega el ID de tu Google Sheet y la URL del Web App
3. Haz clic en **Guardar Configuración**
4. Usa **Probar Conexión** para verificar que funciona
5. Usa **Sincronizar Ahora** para enviar todos los datos a Sheets

---

## 📁 Estructura de archivos

```
/
├── index.html          # Aplicación principal (todo en un archivo)
├── Logo_Ecohabitat.jpg # Logo de la empresa (debe llamarse exactamente así)
├── apps-script.gs      # Código para Google Apps Script
└── README.md           # Este archivo
```

---

## 💾 Almacenamiento local

Los datos se guardan automáticamente en el navegador (`localStorage`) para que no se pierdan al recargar la página. La sincronización con Google Sheets es adicional y permite tener backup en la nube.

---

*EcoHabitat · Sistema de Gestión de Almacenes v1.0*


## 🖼️ Nota sobre el logotipo

El archivo debe estar en la raíz del repositorio junto a `index.html` y llamarse exactamente `Logo_Ecohabitat.jpg`. GitHub Pages distingue mayúsculas, minúsculas, tildes y espacios; si el nombre cambia, el logo no cargará.

En esta versión se ha eliminado el logotipo incrustado en base64 y el filtro CSS que lo convertía en un bloque blanco. Ahora se carga como archivo externo y se muestra sobre una cápsula blanca para mantener contraste en la cabecera.

## 🛡️ Mejora añadida

Se ha añadido importación de copia de seguridad JSON desde Configuración, complementando la exportación existente. Esto ayuda a conservar evidencias y restaurar datos antes/después de revisiones o auditorías.
