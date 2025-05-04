import { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../context/api/crud-user";
import { CargasAlerts } from "../../context/api/load-alerts/cargas";
import { ContextToasty } from "../../context/api/load-alerts/toastfy-alerts";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ModificarDatosUser() {
  // Contextos y hooks
  const { editarDatos, decodificado, traeruserId } = useContext(CrudContext);
  const { Loader, loading, setLoading } = useContext(CargasAlerts);
  const { error, exitoso, corroborar } = useContext(ContextToasty);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [userr, setUser] = useState(null);
  const navigate = useNavigate();

  // Efecto para cargar datos del usuario
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      setLoading(true);
      try {
        if (!decodificado?.id) return;
        
        const userData = await traeruserId(decodificado.id);
        setUser(userData);

        // Establecer valores iniciales del formulario
        setValue("nombre", userData.nombre || "");
        setValue("email", userData.email || "");
        setValue("descripcion", userData.descripcion || "");
        setValue("numeroCelular", userData.numeroCelular || "");
        setValue("ubicacion", userData.ubicacion || "");
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        error('Error al cargar los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosUsuario();
  }, [decodificado?.id, traeruserId, error, setLoading, setValue]);

  // Manejador del envío del formulario
  const onSubmit = async (data) => {
    try {
      const confirmacion = await corroborar("", "¿Seguro que quieres editar los datos?");
      if (!confirmacion) return;
      const respuesta = await editarDatos(data);
      exitoso(respuesta.message);
      navigate(`/perfil/${decodificado.id}`);
    } catch (err) {
      error('El correo que intenta usar ya existe en otra cuenta');
    }
  };

  // Mostrar loader mientras carga
  if (!userr) return Loader();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 my-15">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden p-8 relative">
        
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-800">Editar Perfil</h1>
          <p className="text-gray-600 mt-2 text-sm">Actualiza tu información personal</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Campo Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              {...register("nombre", { required: "Este campo es obligatorio" })}
              placeholder="Tu nombre completo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
            )}
          </div>

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "El email no es válido"
                }
              })}
              placeholder="tu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Descripción (solo para admin y photographer) */}
          {(decodificado.rol === "admin" || decodificado.rol === "photographer") && (
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                {...register("descripcion", {
                  maxLength: {
                    value: 200,
                    message: "Máximo 200 caracteres"
                  }
                })}
                rows="6"
                placeholder="Descripción del perfil, máximo 1000 caracteres"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
              {errors.descripcion && (
                <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>
              )}
            </div>
          )}

          {/* Campo Teléfono */}
          <div>
            <label htmlFor="numeroCelular" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="numeroCelular"
              {...register("numeroCelular", { required: "Este campo es obligatorio" })}
              placeholder="Ej: 3512345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            />
            {errors.numeroCelular && (
              <p className="text-red-500 text-xs mt-1">{errors.numeroCelular.message}</p>
            )}
          </div>

          {/* Campo Ubicación */}
          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              id="ubicacion"
              {...register("ubicacion")}
              placeholder="Ciudad, Provincia"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="Dejar en blanco para no cambiar"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
          </div>

          {/* Botón Guardar */}
          <div className="pt-4">
            <button
              type="submit"
              className="cursor-pointer w-full bg-[var(--color-secundario)] hover:bg-[var(--color-primario)] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none"
            >
              Guardar Cambios
            </button>
          </div>
        </form>

        {/* Botón Atrás */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="cursor-pointer min-w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Atrás
          </button>
        </div>
      </div>
    </div>
  );
}