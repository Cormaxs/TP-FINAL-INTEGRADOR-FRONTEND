import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CrudContext } from "../../context/api/crud-user";
import { optimizarFormDataConWebP } from "../../components/convertir-img/converter-webp";
import { ContextToasty } from "../../context/api/load-alerts/toastfy-alerts";
import { useNavigate } from "react-router-dom";
import { ImagePlus, ArrowLeft } from "lucide-react";

export default function SubirImgSola({ tipo }) {
  // Contextos y hooks
  const { subirImgSola, decodificado } = useContext(CrudContext);
  const { error, exitoso } = useContext(ContextToasty);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Estados
  const [subiendo, setSubiendo] = useState(false);
  const [preview, setPreview] = useState(null);

  // Manejador del envío del formulario
  const onSubmit = async (data) => {
    try {
      setSubiendo(true);
      const formData = new FormData();
      formData.append('imagen', data.imagen[0]);

      // Optimizar imagen a WebP
      const formDataWebP = await optimizarFormDataConWebP(formData);
      const subido = await subirImgSola(formDataWebP, tipo);

      // Manejar respuesta
      if (subido.success) {
        exitoso("Imagen subida correctamente");
        reset();
        setPreview(null);
        navigate(`/perfil/${decodificado.id}`);
      } else {
        error("Fallo al subir la imagen, intente nuevamente");
      }
    } finally {
      setSubiendo(false);
    }
  };

  // Manejador de previsualización de imagen
  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Textos según el tipo de imagen
  const textos = {
    portada: {
      titulo: "foto de portada",
      instruccion: "Arrastrá y soltá tu imagen aquí o hacé clic para seleccionar"
    },
    perfil: {
      titulo: "foto de perfil",
      instruccion: "Arrastrá y soltá tu imagen aquí o hacé clic para seleccionar"
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 my-40 rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Subí tu {textos[tipo]?.titulo || "imagen"}
        </h2>

        {/* Área de subida */}
        <div className="relative group border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 hover:border-blue-400 transition-colors cursor-pointer">
          <label htmlFor="imagen" className="w-full h-full flex flex-col items-center justify-center">
            {preview ? (
              <img 
                src={preview} 
                alt="Previsualización" 
                className="object-cover rounded-xl max-h-60 w-full"
                onLoad={() => URL.revokeObjectURL(preview)}
              />
            ) : (
              <>
                <ImagePlus 
                  size={48} 
                  className="text-gray-400 group-hover:text-[var(--color-base-oscuro)] mb-2 transition-colors cursor-pointer" 
                />
                <p className="text-gray-500 text-sm text-center">
                  {textos[tipo]?.instruccion}
                </p>
              </>
            )}
          </label>
          <input
            id="imagen"
            type="file"
            accept="image/*"
            {...register("imagen", { required: true })}
            onChange={(e) => {
              register("imagen").onChange(e);
              handlePreview(e);
            }}
            className="hidden"
          />
        </div>
        
        {/* Mensaje de error */}
        {errors.imagen && (
          <p className="text-red-500 text-xs text-center">
            Debes seleccionar una imagen
          </p>
        )}

        {/* Botón de subida */}
        <button
          type="submit"
          disabled={subiendo}
          className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-colors ${
            subiendo 
              ? "bg-blue-300 cursor-not-allowed" 
              : "bg-[var(--color-secundario)] hover:bg-[var(--color-primario)]"
          }`}
        >
          {subiendo ? "Subiendo imagen..." : "Subir imagen"}
        </button>

        {/* Botón de retroceso */}
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="min-w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Atrás
        </button>
      </form>
    </div>
  );
}