import axios from 'axios';

const URL_BASE = "https://gobslayer.com";

// Buscador
export const buscador = async (filtros) => {
    const { nombre = "", rol = "", ubicacion = "", categoria = "", page = 1, limit = 10 } = filtros;
    try {
        const respuesta = await axios.get(`${URL_BASE}/publico/buscador?nombre=${encodeURIComponent(nombre)}&rol=${encodeURIComponent(rol)}&ubicacion=${encodeURIComponent(ubicacion)}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&categoria=${encodeURIComponent(categoria)}`);
        return respuesta.data.resultados;
    } catch (err) {
        console.error(`Error en la búsqueda de usuarios:`, err.response?.data || err.message);
        throw  Error("No se pudo realizar la búsqueda. Intenta nuevamente.");
    }
};

// CRUD USERS
export const register = async (datos) => {
    try {
        const respuesta = await axios.post(`${URL_BASE}/user/register`, datos);
        return respuesta; // Respuesta exitosa
    } catch (err) {
        // Verificamos si hay errores en la respuesta
        const errores = err.response?.data?.errores || err.response?.data;
        return errores; // Devolvemos los errores para que sean manejados en el componente
    }
};

export const UserPorId = async (id) => {
    try {
        const respuesta = await axios.get(`${URL_BASE}/user/${id}`);
        return respuesta.data.usuario;
    } catch (err) {
        console.error(`Error al obtener el usuario con ID ${id}:`, err.response?.data || err.message);
        throw  Error("No se pudo obtener el usuario. Verifica el ID y vuelve a intentarlo.");
    }
};

export const modificarUser = async (id, tokenJWT, datos) => {
    try {
        console.log(`id: ${id} token: ${tokenJWT} rol: ${datos}`);
        const respuesta = await axios.put(`${URL_BASE}/user/modificar/${id}`, datos, {
            headers: {
                'Authorization': `Bearer ${tokenJWT}`
            }
        });
        return respuesta.data;
    } catch (err) {
        console.error(`Error al modificar el usuario con ID ${id}:`, err.response?.data || err.message);
        throw  Error("No se pudo modificar el usuario. Verifica los datos e intenta nuevamente.");
    }
};

export const deleteUser = async (id, tokenJWT) => {
    try {
        const response = await axios.delete(`${URL_BASE}/user/eliminar/${id}`, {
            headers: {
                'Authorization': `Bearer ${tokenJWT}`
            }
        });
        return response.data;
    } catch (err) {
        console.error(`Error al eliminar el usuario con ID ${id}:`, err.response?.data || err.message);
        throw  Error("No se pudo eliminar el usuario. Intenta nuevamente.");
    }
};

// Autenticación
export const login = async (datos) => {
    try {
        const response = await axios.post(`${URL_BASE}/auth/login`, datos);
        return response.data;
    } catch (err) {
        console.error(`Error al intentar iniciar sesión:`, err.response?.data || err.message);
        throw  Error("No se pudo iniciar sesión. Verifica tus credenciales.");
    }
};

export const lagout = async (id, tokenJWT) => {
    try {
        const response = await axios.post(`${URL_BASE}/auth/lagout/${id}`, {}, {
            headers: {
                'Authorization': `Bearer ${tokenJWT}`
            }
        });
        return response.data;
    } catch (err) {
        console.error(`Error al cerrar sesión para el usuario con ID ${id}:`, err.response?.data || err.message);
        throw  Error("No se pudo cerrar la sesión. Intenta nuevamente.");
    }
};

export const sesion = async (id, tokenJWT) => {
    try {
        const response = await axios.post(`${URL_BASE}/auth/sesion/${id}`, {}, {
            headers: {
                'Authorization': `Bearer ${tokenJWT}`
            }
        });
        return response.data;
    } catch (err) {
        console.error(`Error al verificar sesión para el usuario con ID ${id}:`, err.response?.data || err.message);
        throw  Error("No se pudo verificar la sesión. Intenta nuevamente.");
    }
};

export const recuperarPassword = async (correo) => {

    try {
        const response = await axios.post(`${URL_BASE}/auth/recuperarPassword`, correo);
        return response;
    } catch (err) {
        console.error(`Error al intentar recuperar la contraseña para el correo ${correo}:`, err.response?.data || err.message);
        throw  Error("No se pudo recuperar la contraseña. Verifica el correo e intenta nuevamente.");
    }
};

// Archivos - imágenes
export const subirImgSingle = async (tipo, id, img, tokenJWT) => {
    try {
        const response = await axios.post(`${URL_BASE}/archivos/${tipo}/${id}`, img, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${tokenJWT}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al subir la imagen para el ID ${id} en tipo ${tipo}:`, error.response?.data || error.message);
        throw  Error("No se pudo subir la imagen. Intenta nuevamente.");
    }
};

export const subirImgCategorias = async (id, img, tokenJWT) => {
    try {
        const response = await axios.post(`${URL_BASE}/archivos/categorias/${img.get("categoria")}/${id}`, img, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${tokenJWT}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al subir la imagen para la categoría ${img.get("categoria")} del ID ${id}:`, error.response?.data || error.message);
        throw  Error("No se pudo subir la imagen a la categoría. Intenta nuevamente.");
    }
};

export const EliminarImagen = async (categoria, id, imagen, tokenJWT) => {
    try {
        const response = await axios.delete(`${URL_BASE}/archivos/categorias/${categoria}/${id}/${imagen}`, {
            headers: {
                'Authorization': `Bearer ${tokenJWT}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar la imagen ${imagen} en categoría ${categoria} para el ID ${id}:`, error.response?.data || error.message);
        throw  Error("No se pudo eliminar la imagen. Intenta nuevamente.");
    }
};

export const EliminarCategoria = async (categoria, id, tokenJWT) => {
    try {
        const response = await axios.delete(`${URL_BASE}/archivos/categorias/${categoria}/${id}`, {
            headers: {
                'Authorization': `Bearer ${tokenJWT}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar la categoría ${categoria} para el ID ${id}:`, error.response?.data || error.message);
        throw  Error("No se pudo eliminar la categoría. Intenta nuevamente.");
    }
};


export const UpdatePassword = async (data) =>{
    try {
        const response = await axios.post(`${URL_BASE}/auth/actualizarPassword`, data);
        return response;
    } catch (error) {
        
        throw  Error("No se pudo eliminar la categoría. Intenta nuevamente.");
    }
}
