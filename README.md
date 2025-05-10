# Product CRUD PHP - Puppeteer Automation

Este proyecto contiene scripts de automatización con Puppeteer para probar una aplicación CRUD de productos en PHP/MySQL.

## Requisitos Previos

Antes de ejecutar los scripts de automatización, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [npm](https://www.npmjs.com/) (viene con Node.js)
- Un navegador Chromium/Chrome instalado (Puppeteer lo descargará automáticamente si no está disponible)

## Instalación

1. Clona este repositorio o descárgalo como ZIP:
   ```
   git clone <url-del-repositorio>
   ```

2. Navega al directorio del proyecto:
   ```
   cd product_crud_php
   ```

3. **Instala las dependencias con npm**:
   ```
   npm install
   ```
   Esto instalará Puppeteer y todas las dependencias necesarias.

4. Crea un archivo `.env` en la raíz del proyecto:
   ```
   # Base URL de la aplicación PHP
   BASE_URL=http://localhost:8080

   # Ruta de la imagen de prueba para subir
   TEST_IMAGE_PATH=./test-data/sample-product.jpg

   # Tiempo máximo de espera para carga de página (en milisegundos)
   PAGE_TIMEOUT=30000

   # Configuración del navegador
   HEADLESS=false
   SLOW_MO=50
   ```

5. Asegúrate de que tu servidor PHP esté ejecutándose con Docker en el puerto 8080 antes de ejecutar los scripts.

## Configuración

- `BASE_URL`: URL base donde se ejecuta tu aplicación PHP (por defecto: `http://localhost:8080`)
- `HEADLESS`: Establece a `true` para ejecutar en modo headless (sin interfaz gráfica)
- `SLOW_MO`: Ralentiza las operaciones para depuración (en milisegundos)

## Scripts Disponibles

### Crear Producto
Automatiza la creación de un nuevo producto con nombre aleatorio, descripción e imagen de prueba:
```
npm run create
```

### Listar Productos
Lista los primeros 5 productos de la base de datos:
```
npm run read
```

Filtra por categoría:
```
node scripts/read.js "Audio and Video"
```

### Buscar Producto
Busca un producto por código:
```
npm run search
```
o especifica un código:
```
node scripts/search.js 1
```

### Actualizar Producto
Actualiza el primer producto de la lista (o un producto específico por código):
```
npm run update
```
o especifica un código:
```
node scripts/update.js 1
```

### Eliminar Producto
Elimina el primer producto de la lista (o un producto específico por código):
```
npm run delete
```
o especifica un código:
```
node scripts/delete.js 1
```

### Validar Formulario
Prueba las validaciones del formulario intentando enviar datos incorrectos o incompletos:
```
npm run validate
```
Este script verifica:
- Envío del formulario completamente vacío
- Omisión de cada campo obligatorio individualmente
- Validación de valores incorrectos (por ejemplo, precio negativo)

### Ejecutar Todas las Pruebas
Ejecuta todos los scripts de automatización en secuencia:
```
npm run test-all
```

## Estructura del Proyecto

```
.
├── .env                  # Configuración del entorno
├── package.json          # Dependencias y scripts
├── README.md             # Documentación
├── data/                 # Directorio para salida JSON (creado en tiempo de ejecución)
├── screenshots/          # Directorio para capturas de pantalla (creado en tiempo de ejecución)
├── test-data/            # Imágenes para pruebas
└── scripts/
    ├── create.js         # Script de creación de productos
    ├── read.js           # Script de listado de productos
    ├── search.js         # Script de búsqueda de productos
    ├── update.js         # Script de actualización de productos
    ├── delete.js         # Script de eliminación de productos
    ├── validate.js       # Script de validación de formularios
    └── utils.js          # Utilidades compartidas
```

## Solución de Problemas

Si encuentras errores al ejecutar los scripts:

1. Asegúrate de que tu servidor PHP esté funcionando y accesible en la URL especificada en `.env`
2. Verifica que todas las dependencias estén instaladas correctamente con `npm install`
3. Si hay problemas con el navegador, intenta cambiar `HEADLESS=false` para ver el navegador en acción
4. Comprueba las capturas de pantalla generadas en el directorio `screenshots/` para diagnosticar problemas

## Notas Adicionales

- Los scripts generan capturas de pantalla durante la ejecución para ayudar en el diagnóstico
- Los datos del producto extraídos se pueden guardar en archivos JSON en el directorio `data/`
- La imagen de prueba debe estar disponible en la ruta especificada en `TEST_IMAGE_PATH`