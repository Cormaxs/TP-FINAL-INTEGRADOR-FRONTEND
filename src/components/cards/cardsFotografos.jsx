import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CargasAlerts } from "../../context/api/load-alerts/cargas";
import { LazyLoadImage } from "react-lazy-load-image-component";

// URLs constantes para imágenes por defecto
const DEFAULT_COVER = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";
const DEFAULT_PROFILE = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";



export function CardFotografos({ filtros = null }) {
  // Estado y contexto
  const { loading, Loader } = useContext(CargasAlerts);
  const [fotografos, setFotografos] = useState(filtros);

  // Actualiza la lista de fotógrafos cuando cambian los filtros
  useEffect(() => {
    setFotografos(filtros);
  }, [filtros]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Muestra el loader si está cargando */}
      {loading && <Loader />}

      {/* Contenedor de la grilla de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {fotografos.length > 0 ? (
          fotografos.map(fotografo => (
            <FotografoCard 
              key={fotografo._id}
              fotografo={fotografo}
            />
          ))
        ) : (
          <MensajeSinResultados />
        )}
      </div>
    </div>
  );
}

/**
 * Componente de tarjeta individual para cada fotógrafo
 */
function FotografoCard({ fotografo }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link to={`/perfil/${fotografo._id}`} className="block h-full">
        {/* Sección superior con imágenes */}
        <div className="relative h-48 bg-gray-200">
          {/* Imagen de portada */}
          <ImagenPortada 
            src={fotografo.fotos.portada} 
            alt={`Portada de ${fotografo.nombre}`}
          />
          
          {/* Imagen de perfil (superpuesta) */}
          <ImagenPerfil 
            src={fotografo.fotos.perfil} 
            alt={fotografo.nombre}
          />
        </div>

        {/* Sección inferior con información */}
        <div className="pt-16 px-6 pb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {fotografo.nombre}
          </h2>

          {/* Información adicional */}
          <InformacionAdicional 
            ubicacion={fotografo.ubicacion}
            experiencia={fotografo.experiencia}
          />

          {/* Botón de acción */}
          <BotonVerPerfil />
        </div>
      </Link>
    </div>
  );
}

/**
 * Componente para la imagen de portada
 */
function ImagenPortada({ src, alt }) {
  return (
    <LazyLoadImage
      width={400}
      height={200}
      placeholderSrc=""
      src={src || DEFAULT_COVER}
      alt={alt}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.src = DEFAULT_COVER;
      }}
    />
  );
}

/**
 * Componente para la imagen de perfil (circular)
 */
function ImagenPerfil({ src, alt }) {
  const defaultImg = `https://ui-avatars.com/api/?name=${alt}&background=364153&color=ffffff`;
  return (
    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
      <LazyLoadImage
        width={100}
        height={90}
        placeholderSrc=""
        src={src || defaultImg || DEFAULT_PROFILE}
        alt={`Perfil de  ${alt}`}
        className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg bg-white"
        onError={(e) => {
          e.target.src = defaultImg;
        }}
      />
    </div>
  );
}

/**
 * Componente para la información adicional del fotógrafo
 */
function InformacionAdicional({ ubicacion, experiencia }) {
  return (
    <div className="mt-4 space-y-3 text-sm text-gray-700">
      <ItemInformacion 
        titulo="Ubicación"
        valor={ubicacion || 'No especificada'}
      />
      
      {experiencia && (
        <ItemInformacion 
          titulo="Experiencia"
          valor={experiencia}
        />
      )}
    </div>
  );
}

/**
 * Componente para cada ítem de información
 */
function ItemInformacion({ titulo, valor }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-widest">
        {titulo}
      </p>
      <p className="font-medium">
        {valor}
      </p>
    </div>
  );
}

/**
 * Componente para el botón "Ver perfil completo"
 */
function BotonVerPerfil() {
  return (
    <div className="mt-6">
      <div id="btn-ver-perfil-completo" className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-md shadow-md text-white bg-[var(--color-base-oscuro)] hover:bg-[var(--color-secundario)] transition-colors duration-300 cursor-pointer">
        Ver perfil completo
        <IconoFlecha />
      </div>
    </div>
  );
}

/**
 * Componente para el icono de flecha
 */
function IconoFlecha() {
  return (
    <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path 
        fillRule="evenodd" 
        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 01 0 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 010-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}

/**
 * Componente para el mensaje cuando no hay resultados
 */
function MensajeSinResultados() {
  return (
    <div className="col-span-full text-center text-lg text-gray-500">
      No se encontraron fotógrafos.
    </div>
  );
}