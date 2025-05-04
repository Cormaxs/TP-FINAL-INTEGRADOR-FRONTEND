import { useContext, useState } from "react";
import { CrudContext } from "../../context/api/crud-user";
import { ContextToasty } from "../../context/api/load-alerts/toastfy-alerts";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

export default function Register() {
  const { crearCuenta } = useContext(CrudContext);
  const { error, exitoso } = useContext(ContextToasty);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [isLoading, setIsLoading] = useState(false); // Nuevo estado

  const onSubmit = async (data) => {


    setIsLoading(true); // Activamos el "cargando"

    try {
      const respuesta = await crearCuenta(data);

      if (respuesta.status === 201) {
        exitoso(respuesta.data.message);
        reset();
        navigate("/login");
      } else {
        error(respuesta[0]?.msg || respuesta.message);
      }
    } catch (err) {
      console.log("Error en registro:", err);
      error("Ocurrió un error al crear la cuenta");
    } finally {
      setIsLoading(false); // Finaliza el estado de carga
    }
  };

  const metaData = {
    title: "Crear cuenta",
    description: "Crea tu cuenta en Fotógrafos Catamarca y encuentra a los mejores fotógrafos",
    keywords: "fotografos, catamarca, bodas, cumpleaños, register, crear cuenta"
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
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Crear cuenta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-[var(--color-secundario)] hover:text-[var(--color-primario)]">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">

              <div>
                <label htmlFor="nombre" className="sr-only">Nombre completo</label>
                <input
                  id="nombre"
                  {...register("nombre", { required: "El nombre es obligatorio" })}
                  type="text"
                  autoComplete="name"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primario)] focus:border-[var(--color-primario)] focus:z-10 sm:text-sm"
                  placeholder="Nombre completo"
                />
                {errors.nombre && <span className="text-[var(--color-primario)] text-sm">{errors.nombre.message}</span>}
              </div>

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

              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                  type="password"
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primario)] focus:border-[var(--color-primario)] focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>

              <div>
                <label htmlFor="rol" className="sr-only">Rol</label>
                <select
                  id="rol"
                  {...register("rol", { required: "Debes seleccionar un rol" })}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primario)] focus:border-[var(--color-primario)] focus:z-10 sm:text-sm"
                >
                  <option value="">Selecciona tu rol</option>
                  <option value="client">Cliente</option>
                  <option value="photographer">Fotógrafo</option>
                </select>
                {errors.rol && <span className="text-red-500 text-sm">{errors.rol.message}</span>}
              </div>

              <div className="flex items-center">
                <input
                  id="terminos"
                  {...register("terminos", { required: "Debes aceptar los términos" })}
                  type="checkbox"
                  className="h-4 w-4 text-[var(--color-primario)] focus:ring-[var(--color-secundario)] border-gray-300 rounded"
                />
                <label htmlFor="terminos" className="ml-2 block text-sm text-gray-900">
                  Acepto los términos y condiciones
                </label>
              </div>
              {errors.terminos && <span className="text-red-500 text-sm">{errors.terminos.message}</span>}
            </div>


            {/* Botón con estado de carga */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`cursor-pointer group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--color-base-oscuro)] hover:bg-[var(--color-base-claro)]'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300`}
              >
                {isLoading ? (
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
                      <svg className="h-5 w-5 text-[var(--color-primario)] group-hover:text-[var(--color-secundario)]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Registrar cuenta
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
