# ⚛️ Frontend - Gestor de Usuarios e Imágenes

Este es el frontend de una aplicación web desarrollada con **React 19** y **Vite 6**, orientada a la gestión de usuarios y subida de imágenes. Utiliza control de acceso por roles (cliente, fotógrafo y administrador), integración con JWT y notificaciones con Toastify y SweetAlert2.

el frontend esta desplegado en un cpanel, subiendo directamente el build de mi proyecto, tambien modifique el .htaccess para que entre a cualquier ruta "sin tener que pasar por la pagina princiap" - > [fotografoscatamarca.com](https://fotografoscatamarca.com)

## 🚀 Tecnologías utilizadas

- ⚛️ **React 19** con **Vite**
- 🔐 **JWT Decode** para autenticación por token
- 🧠 **React Context API**
- 🎨 **Tailwind CSS 4.1**
- 🧰 **React Hook Form** para formularios
- 🔔 **React Toastify** y **SweetAlert2** para alertas
- 🔁 **React Router DOM 7**
- 📦 **Axios** para peticiones HTTP
- 🧱 **Lucide React** y **Bootstrap Icons** para íconos

## 📦 Scripts disponibles

```bash
npm run dev       # Inicia la app en modo desarrollo
npm run build     # Genera la build de producción
npm run preview   # Previsualiza la build
```

## INSTALACION

**`Clonar el repositorio:`**

```bash
git clone [repo]
```

**`Instala las dependencias:`**

```bash
npm install
```

**`Inicia el servidor:`**

```bash
npm run dev
```

## ESTRUCTURA DEL PROYECTO

```bash
src/
├── API/                          # Lógica para peticiones al backend
├── assets/                       # Imágenes, íconos u otros recursos estáticos
├── components/                   # Componentes reutilizables
│   ├── buscador/                 # Barra de búsqueda
│   ├── buttons/                  # Botones personalizados
│   ├── cards/                    # Tarjetas de contenido
│   ├── convertir-img/            # convierte imagenes a webp antes de subir usando canvas
│   └── footer-menu/              # Menu y footer
├── context/                    
│   ├── api/                      # Tarjetas de alertas, efecto de loading.
│   └── theme/                    # Contexto para darkMode
├── pages/                        # Vistas principales de la app
│   ├── acceso/                   # Login, registro, recuperación password
│   ├── configuraciones-usuarios/ # Edición de datos
│   └── publicas/                 # Vistas públicas -> home, fotografos, etc
├── routes/                       # Definición de rutas protegidas o públicas
├── App.jsx                       # Enrutador principal de la aplicación
├── main.jsx                      # Punto de entrada
└── index.css                     # Estilos globales

```

## Control de acceso por roles

### Accesos configurados

```bash
| Ruta               | Accesos permitidos          |
| ------------------ | --------------------------- |
| `/updateUser`      | client, photographer, admin |
| `/upImg/perfil`    | client, photographer, admin |
| `/upImg/portada`   | client, photographer, admin |
| `/createCategoria` | photographer, admin         |

```

## ✨ Un poco del funcionamiento

La estructura del proyecto se organiza de forma modular y clara:

### 📌 `main.jsx`

Se proveen los distintos **contextos globales** que estarán disponibles en toda la aplicación a través del árbol de componentes.

### 📌 `App.jsx`

Este componente central define la estructura principal del sitio. Desde aquí se accede a:

- Sistema de **rutas** (`react-router-dom`).
- **Menú de navegación**.
- **Footer**.
- Componentes de **alertas/notificaciones**.

### 📁 `routes/`

Contiene la configuración de las rutas del sitio:

- **Rutas públicas**: accesibles para cualquier usuario.
- **Rutas privadas**: requieren autenticación y están organizadas según el tipo de usuario:
  - Cliente
  - Administrador
  - Fotógrafo
  - También se controla el acceso para usuarios no autenticados.

### 📁 `components/`

Incluye componentes reutilizables que permiten construir la interfaz de usuario:

- **Botones**
- **Cards**
- **Otros bloques visuales** utilizados en distintas secciones del sitio.
- **uso de ui-avatars.com como api para usuarios sin foto de perfil**