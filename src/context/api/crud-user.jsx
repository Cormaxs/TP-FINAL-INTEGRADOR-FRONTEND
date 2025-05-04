import { createContext, useEffect, useState } from "react";
import { 
    login, register, deleteUser, lagout, recuperarPassword, 
    modificarUser, subirImgSingle, subirImgCategorias, 
    buscador, UserPorId, EliminarImagen, EliminarCategoria, UpdatePassword
} from "../../API/llamadas-api";
import { jwtDecode } from "jwt-decode";

export const CrudContext = createContext();


export function CrudProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [decodificado, setDecodificado] = useState(null);

    // Efecto para manejar cambios en el token
    useEffect(() => {
        const manejarToken = () => {
            localStorage.setItem("token", token);
            
            try {
                const decoded = token.trim() ? jwtDecode(token) : null;
                setDecodificado(decoded);
            } catch (error) {
                console.error("Error decodificando token:", error);
                setDecodificado(null);
            }
        };

        manejarToken();
    }, [token]);

    // Operaciones de autenticación
    const iniciarSesion = async (data) => {
        try {
            const respuesta = await login(data);
    
            if (respuesta?.token) {
                setToken(respuesta.token);
            }
    
            return respuesta;
        } catch (error) {
            console.error("Error en iniciarSesion:", error);
            throw error;
        }
    };

    const crearCuenta = async (userData) => {
        try {
            return await register(userData);
        } catch (error) {
            console.error("Error en crearCuenta:", error);
            throw error;
        }
    };

    const eliminarCuenta = async (id) => {
        try {
            const { id: idToken } = jwtDecode(token);
            const idAEliminar = id || idToken;
            
            const eliminado = await deleteUser(idAEliminar, token);
            
            if (!id && eliminado) {
                localStorage.setItem("token", "");
                setToken("");
            }
        } catch (error) {
            console.error("Error en eliminarCuenta:", error);
            throw error;
        }
    };

    const cerrarSesion = async () => {
        try {
            const datos = jwtDecode(token);
            const respuesta = await lagout(datos.id, token);
            
            if (respuesta !== undefined) {
                localStorage.setItem("token", "");
                setToken("");
            }
            
            return respuesta;
        } catch (error) {
            console.error("Error en cerrarSesion:", error);
            throw error;
        }
    };

    const recuperarContraseña = async (correo) => {
        try {
            return await recuperarPassword(correo);
        } catch (error) {
            console.error("Error en recuperarContraseña:", error);
            throw error;
        }
    };

    // Operaciones de usuario
    const editarDatos = async (userData) => {
        try {
            const datos = {
                nombre: userData.nombre,
                email: userData.email,
                descripcion: userData.descripcion,
                numeroCelular: userData.numeroCelular,
                password: userData.password,
                ubicacion: userData.ubicacion,
            };
            
            const decode = jwtDecode(token);
            return await modificarUser(decode.id, token, datos);
        } catch (error) {
            console.error("Error en editarDatos:", error);
            throw error;
        }
    };

    const suspenderCuenta = async (id, rol) => {
        try {
            return await modificarUser(id.id, token, rol);
        } catch (error) {
            console.error("Error en suspenderCuenta:", error);
            throw error;
        }
    };

    // Operaciones con imágenes
    const subirImgSola = async (img, tipo) => {
        try {
            const datos = jwtDecode(token);
            return await subirImgSingle(tipo, datos.id, img, token);
        } catch (error) {
            console.error("Error en subirImgSola:", error);
            throw error;
        }
    };

    const crearCategoria = async (categoria) => {
        try {
            const decod = jwtDecode(token);
            return await subirImgCategorias(decod.id, categoria, token);
        } catch (error) {
            console.error("Error en crearCategoria:", error);
            throw error;
        }
    };

    // Operaciones de búsqueda
    const buscarFotografos = async ({ filtros }) => {
        try {
            return await buscador(filtros);
        } catch (error) {
            console.error("Error en buscarFotografos:", error);
            throw error;
        }
    };

    const traeruserId = async (id) => {
        try {
            return await UserPorId(id);
        } catch (error) {
            console.error("Error en traeruserId:", error);
            throw error;
        }
    };

    // Operaciones de eliminación
    const eliminarImagen = async (categoria, imagen) => {
        try {
            return await EliminarImagen(categoria, decodificado.id, imagen, token);
        } catch (error) {
            console.error("Error en eliminarImagen:", error);
            throw error;
        }
    };

    const eliminarCategoria = async (categoria) => {
        try {
            return await EliminarCategoria(categoria, decodificado.id, token);
        } catch (error) {
            console.error("Error en eliminarCategoria:", error);
            throw error;
        }
    };

    const actualizarPassword = async (data) =>{
        try{

            const respuesta = await UpdatePassword(data);
            return respuesta;


        }catch(err){
            console.error(err);
            throw err;
        }
    }
 
    return (
        <CrudContext.Provider value={{ 
            iniciarSesion, 
            crearCuenta, 
            eliminarCuenta, 
            cerrarSesion,
            recuperarContraseña, 
            editarDatos,
            subirImgSola, 
            crearCategoria, 
            buscarFotografos, 
            traeruserId, 
            eliminarImagen, 
            eliminarCategoria,
            suspenderCuenta,
            actualizarPassword,
            token, 
            decodificado
        }}>
            {children}
        </CrudContext.Provider>
    );
}