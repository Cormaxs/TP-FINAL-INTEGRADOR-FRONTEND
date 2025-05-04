import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CrudContext } from "../../context/api/crud-user";
import { CargasAlerts } from "../../context/api/load-alerts/cargas";
import { ArrowLeft, CameraIcon } from "lucide-react";
import { optimizarFormDataConWebP } from "../../components/convertir-img/converter-webp";
import { ContextToasty } from "../../context/api/load-alerts/toastfy-alerts";
import { useNavigate } from "react-router-dom";

export default function CategoriasImg() {
  // Contextos y hooks
  const { error, exitoso } = useContext(ContextToasty);
  const { crearCategoria, decodificado } = useContext(CrudContext);
  const { loading, Loader } = useContext(CargasAlerts);
  const navigate = useNavigate();

  // Estados
  const [previewImgs, setPreviewImgs] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  // Formulario
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Manejador de cambio de imágenes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImgs(previews);
  };

  // Manejador de envío del formulario
  const onSubmit = async (data) => {
    try {
      setSubiendo(true);
      const formData = new FormData();
      
      // Preparar datos del formulario
      formData.append('categoria', data.categoria);
      formData.append('precio', data.precio || '');

      // Agregar imágenes al FormData
      for (let i = 0; i < data.imagenes.length; i++) {
        formData.append('imagenes', data.imagenes[i]);
      }

      // Optimizar imágenes a WebP
      const formDataWebP = await optimizarFormDataConWebP(formData);
      const subido = await crearCategoria(formDataWebP);

      // Resetear formulario y estado
      setPreviewImgs([]);
      reset();

      // Manejar respuesta
      if (subido) {
        exitoso(subido.mensaje);
        navigate(`/perfil/${decodificado.id}`);
      } else {
        error(subido.mensaje);
      }

    } catch (err) {
      error("Ocurrió un error inesperado.");
    } finally {
      setSubiendo(false);
    }
  };

  // Opciones de categorías
  const categoriasOptions = [
    {
      label: "📅 Eventos",
      options: [
        { value: "bodas", label: "Bodas" },
        { value: "quinceañeros", label: "Quinceañeros" },
        { value: "egresos", label: "Egresos" },
        { value: "bautismos", label: "Bautismos" },
        { value: "cumpleaños", label: "Cumpleaños" },
        { value: "fiestas-corporativas", label: "Fiestas Corporativas" }
      ]
    },
    {
      label: "💼 Comercial",
      options: [
        { value: "gastronomia", label: "Gastronomía" },
        { value: "productos", label: "Productos" },
        { value: "moda", label: "Moda" },
        { value: "publicidad", label: "Publicidad" },
        { value: "packshot", label: "Packshot" },
        { value: "arquitectura", label: "Arquitectura" }
      ]
    },
    {
      label: "🎨 Arte / Creativo",
      options: [
        { value: "retrato", label: "Retrato Artístico" },
        { value: "desnudo-artistico", label: "Desnudo Artístico" },
        { value: "conceptual", label: "Conceptual" },
        { value: "abstracta", label: "Abstracta" },
        { value: "callejera", label: "Callejera" },
        { value: "minimalista", label: "Minimalista" }
      ]
    },
    {
      label: "🌿 Naturaleza",
      options: [
        { value: "paisajes", label: "Paisajes" },
        { value: "fauna", label: "Fauna" },
        { value: "flora", label: "Flora" },
        { value: "astrofotografia", label: "Astrofotografía" },
        { value: "submarina", label: "Submarina" }
      ]
    },
    {
      label: "🔍 Especialidades",
      options: [
        { value: "deportiva", label: "Deportiva" },
        { value: "cientifica", label: "Científica" },
        { value: "medica", label: "Médica" },
        { value: "drones", label: "Drones" },
        { value: "360", label: "Fotografía 360°" }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-3xl shadow-xl  border my-25"
         style={{ backgroundColor: "var(--color-gris-suave)", borderColor: "#ddd" }}>
      
      {/* Loader */}
      {loading && Loader()}

      {/* Título */}
      <h2 className="text-3xl font-extrabold mb-8 text-center flex items-center justify-center gap-3"
          style={{ color: "var(--color-primario)" }}>
        <CameraIcon className="w-7 h-7" style={{ color: "var(--color-acento)" }} />
        Nueva galería o categoría
      </h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" style={{ color: "var(--color-texto)" }}>
        
        {/* Selector de Categoría */}
        <div>
          <label className="block text-sm font-semibold mb-2">Selecciona una categoría</label>
          <select
            {...register("categoria", { required: true })}
            className="w-full px-4 py-3 rounded-lg bg-white focus:ring-2 focus:ring-[var(--color-primario)] focus:outline-none border border-gray-300"
          >
            <option value="">-- Elegir --</option>
            {categoriasOptions.map((group, index) => (
              <optgroup key={index} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.categoria && <p className="text-red-500 text-sm mt-1">Debes seleccionar una categoría.</p>}
        </div>

        {/* Subida de Imágenes */}
        <div>
          <label className="block text-sm font-semibold mb-2">Sube tus imágenes (máx. 5)</label>
          <div className="border-2 border-dashed p-6 rounded-xl bg-white hover:bg-[var(--hover-claro)] transition"
               style={{ borderColor: "var(--color-primario)" }}>
            <input
              {...register("imagenes", { required: true })}
              type="file"
              accept="image/*"
              multiple
              max={5}
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 cursor-pointer focus:outline-none hover:border-none"
            />
            {errors.imagenes && <p className="text-red-500 text-sm mt-1">Debes seleccionar al menos una imagen.</p>}
          </div>
          
          {/* Previsualización de imágenes */}
          {previewImgs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
              {previewImgs.map((src, idx) => (
                <div key={idx} className="relative rounded-md overflow-hidden shadow-sm border border-gray-300">
                  <img 
                    src={src} 
                    alt={`Preview ${idx}`} 
                    className="w-full h-36 object-cover"
                    onLoad={() => URL.revokeObjectURL(src)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-semibold mb-2 mt-2">Precio por hora (opcional)</label>
          <input
            {...register("precio")}
            type="number"
            min={1}
            placeholder="Ej. 5.000"
            className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[var(--color-primario)] focus:outline-none border border-gray-300 hover:border-transparent"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mt-6">
          <button
            type="submit"
            className="w-full sm:w-auto cursor-pointer text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: "var(--color-boton)",
              color: "var(--texto-btn)"
            }}
            disabled={subiendo}
          >
            {subiendo ? "Subiendo..." : "Subir fotos"}
          </button>

          <button
            onClick={() => navigate(-1)}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: "var(--hover-claro)",
              color: "var(--color-texto)"
            }}
          >
            <ArrowLeft size={20} />
            Atrás
          </button>
        </div>
      </form>
    </div>
  );
}