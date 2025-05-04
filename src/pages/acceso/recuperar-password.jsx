import { useForm } from "react-hook-form";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { CrudContext } from "../../context/api/crud-user";
import { ContextToasty } from "../../context/api/load-alerts/toastfy-alerts";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function RecuperarPassword() {
  const { recuperarContraseña } = useContext(CrudContext);
  const { exitoso, error } = useContext(ContextToasty);
  const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const respuesta = await recuperarContraseña(data); 
      if (respuesta.status === 200) {
        exitoso(respuesta.data.mensaje);
        navigate("/login")
      } else {
        error("No se pudo enviar el correo de recuperación.");
      }
    } catch (err) {
      console.error("Error al recuperar contraseña:", err);
      error(err.error || "Error desconocido.");
    }
  };
  

  const metaData = {
    title: "Recuperar contraseña",
    description: "Recupera el acceso a tu cuenta en Fotógrafos Catamarca.",
    keywords: "fotografía, recuperar cuenta, catamarca"
  };

  return (
    <>
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <meta name="keywords" content={metaData.keywords} />
        <meta property="og:description" content={metaData.description} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">

          {/* Encabezado */}
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Recuperar contraseña
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Recordaste tu contraseña?{" "}
              <Link
                to="/login"
                className="font-medium text-[var(--color-secundario)] hover:text-[var(--color-primario)]"
              >
                Inicia sesión
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
                  type="email"
                  autoComplete="email"
                  placeholder="Correo electrónico"
                  {...register("email", { required: "El correo es obligatorio" })}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[var(--color-primario)] focus:border-[var(--color-primario)] sm:text-sm"
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>
            </div>

            {/* Botón */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[var(--color-base-oscuro)] hover:bg-[var(--color-base-claro)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primario)] transition-colors duration-300 cursor-pointer"
              >
                Recuperar contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
