import { createContext } from "react";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';

export const ContextToasty = createContext();

export const Toasty = ({ children }) => {
    
   
    const error = (mensaje) => {
        try {
            toast.error(mensaje, {
                position: "top-right", 
                autoClose: 3000,
                theme: "colored",
            });
        } catch (error) {
            console.error("Error al mostrar notificación de error:", error);
        }
    };

  
    const exitoso = (mensaje) => {
        try {
            toast.success(mensaje, {
                position: "top-right",
                autoClose: 2000,
                style: {
                    backgroundColor: 'var(--color-base-claro)', 
                    color: 'var(--texto-btn)'
                },
            });
        } catch (error) {
            console.error("Error al mostrar notificación de éxito:", error);
        }
    };

    
    const corroborar = async (titulo, mensaje, accion) => {
        try {
            const result = await Swal.fire({
                title: titulo,
                text: mensaje,
                icon: 'warning',
                showCancelButton: true,
                background: 'var(--color-fondo-tarjeta)',
                confirmButtonColor: 'var(--color-base-claro)',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí',
            });
        
            if (result.isConfirmed && accion) {
                accion();
            }
        
            return result.isConfirmed;
        } catch (error) {
            console.error("Error al mostrar diálogo de confirmación:", error);
            return false;
        }
    };
          
    return (
        <ContextToasty.Provider value={{ error, exitoso, corroborar }}>
            {children}
        </ContextToasty.Provider>
    );
};