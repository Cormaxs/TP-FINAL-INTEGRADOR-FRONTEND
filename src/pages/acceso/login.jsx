import { useState, useContext } from "react";
import { CrudContext } from "../../context/api/crud-user";
import { ContextToasty } from "../../context/api/load-alerts/toastfy-alerts";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

export default function Login() {
  // Contextos y hooks
  const { iniciarSesion } = useContext(CrudContext);
  const { error, exitoso } = useContext(ContextToasty);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Estado para controlar el envío
  const [loading, setLoading] = useState(false);

  // Manejador del envío del formulario
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const respuesta = await iniciarSesion(data);
      if (respuesta.valido) {
        exitoso(respuesta.mensaje);
        navigate("/");
      } else {
        error("Error desconocido al iniciar sesión.");
      }
    } catch (err) {
      console.error("Error de login:", err);
      error(err.error || "Credenciales inválidas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  // Metadatos para SEO
  const metaData = {
    title: "Iniciar sesión",
    description: "Inicia sesión en Fotógrafos Catamarca y encuentra a los mejores fotógrafos",
    keywords: "fotografos, catamarca, bodas, cumpleaños, login, iniciar sesion"
  };

  return (
    <>
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <meta property="og:description" content={metaData.description} />
        <meta property="og:url" content={window.location.href} />
        <meta name="keywords" content={metaData.keywords} />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          
          {/* Encabezado */}
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Iniciar sesión
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="font-medium text-[var(--color-secundario)] hover:text-[var(--color-primario)]"
              >
                Crea una aquí
              </Link>
            </p>
          </div>

          {/* Formulario */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">
              
              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="sr-only">Correo electrónico</label>
                <input
                  id="email"
                  {...register("email", { required: "El correo es obligatorio" })}
                  type="email"
                  autoComplete="email"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primario)] focus:border-[var(--color-primario)] focus:z-10 sm:text-sm"
                  placeholder="Correo electrónico"
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>

              {/* Campo Contraseña */}
              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                  type="password"
                  autoComplete="current-password"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primario)] focus:border-[var(--color-primario)] focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[var(--color-secundario)] focus:ring-[var(--color-primario)] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/recuperar-password"
                  className="font-medium text-[var(--color-secundario)] hover:text-[var(--color-primario)]"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Botón de envío */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={` cursor-pointer group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--color-base-oscuro)] hover:bg-[var(--color-base-claro)]"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primario)] transition-colors duration-300`}
              >
                {loading ? (
                  <>
                  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Cargando...
                </>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m0 0l4-4m-4 4l4 4" />
                      </svg>
                    </span>
                    Iniciar sesión
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
