# API Middleware Mercado Libre - Test Práctico Frontend

## Descripción
Esta aplicación Express funciona como un wrapper para las API de Mercado Libre y filtra los datos recibidos de estas para alimentar a una aplicacion frontend.

## Endpoints
La app corre sobre el puerto 4000 en localhost - http://localhost:4000

- /api/items?q=:query

Se conecta a el endpoint de búsqueda de Meli, desde donde retorna un máximo de 4 productos por búsqueda realizada y filtra sus propiedades.

-  /api/items/:id

Se conecta a los endpoints de items e items/description de Meli, donde se realiza un merge de la información y se retornan los datos del producto y su descripción.

## Mercado Libre API
- https://api.mercadolibre.com/sites/MLA/search?q=:query
- https://api.mercadolibre.com/items/:id
- https://api.mercadolibre.com/items/:id​/description

## Instalación
Es requerida una versión de node 6 o superior (LTS recomendado) para poder correr el proyecto.

```bash
# Clonando el respositorio
git clone  https://github.com/matias-vdlc/test-api-meli.git

# Navegacion a la carpeta
cd test-api-meli

# Instalando dependencias en node
npm install

# Corriendo el servidor en modo Desarrollo
npm run dev
```