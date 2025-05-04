import { useContext } from "react";
import { CrudContext } from "../../context/api/crud-user";
import { ContextToasty } from "../../context/api/load-alerts/toastfy-alerts";
import { useNavigate } from "react-router-dom";

// Componente para cerrar sesión
export const CerrarSesion = () => {
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(CrudContext);
  const { corroborar } = useContext(ContextToasty);

  const handleCerrarSesion = async () => {
    // Corrobora si el usuario quiere cerrar sesión
    const confirmacion = await corroborar("", "¿Querés cerrar sesión?", cerrarSesion);
    if (confirmacion) navigate("/"); // Si confirma, navega a la página principal
  };

  return (
    <button
      onClick={handleCerrarSesion}
      className="w-full py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
    >
      Cerrar sesión
    </button>
  );
};

// Componente para eliminar la cuenta
export const EliminarCuenta = ({ id }) => {
  const navigate = useNavigate();
  const { corroborar, exitoso } = useContext(ContextToasty);
  const { eliminarCuenta } = useContext(CrudContext);

  const handleEliminarCuenta = async () => {
    // Corrobora si el usuario quiere eliminar la cuenta
    const confirmacion = await corroborar("Tus datos se eliminaran completamente", "¿Querés eliminar tu cuenta definitivamente?", () => eliminarCuenta(id));
    if (confirmacion) {
      exitoso("Cuenta eliminada con éxito");
      navigate("/"); // Redirige al inicio después de eliminar la cuenta
    }
  };

  return (
    <button
      onClick={handleEliminarCuenta}
      className="w-full py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
    >
      Eliminar cuenta
    </button>
  );
};

// Componente para suspender o anular la suspensión de una cuenta
export const SuspenderCuenta = ({ usuario }) => {
  const { suspenderCuenta } = useContext(CrudContext);
  const { exitoso, error } = useContext(ContextToasty);
  const navigate = useNavigate();

  const estaSuspendido = usuario.rol === "suspendido"; // Verifica si el usuario está suspendido
  const nuevoRol = estaSuspendido ? "photographer" : "suspendido"; // Determina el nuevo rol

  const manejarSuspension = async () => {
    // Realiza la solicitud para suspender o anular la suspensión
    const respuesta = await suspenderCuenta({ id: usuario._id }, { rol: nuevoRol });
    if (respuesta) {
      navigate(0); // Recarga la página para reflejar los cambios
      exitoso(
        estaSuspendido
          ? "Suspensión anulada exitosamente"
          : "Cuenta suspendida exitosamente"
      );
    } else {
      error("Error al actualizar la cuenta"); // Muestra un error si la operación falla
    }
  };

  return (
    <button
      onClick={manejarSuspension}
      className="w-full py-2 text-sm text-center text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
    >
      {estaSuspendido ? "Anular suspensión" : "Suspender cuenta"}
    </button>
  );
};
