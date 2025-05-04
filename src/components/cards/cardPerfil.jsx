import { Link } from "react-router-dom";
import { CerrarSesion, EliminarCuenta, SuspenderCuenta } from "../buttons/butons";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

export function DatosPerfil({ perfil, decodificado, id, token }) {
  const [datos, setDatos] = useState(Array.isArray(perfil) ? perfil : [perfil]);

  // Sincronizar datos cuando cambian las props
  useEffect(() => {
    setDatos(Array.isArray(perfil) ? perfil : [perfil]);
  }, [token, perfil]);

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-12 ls:py-0">
      {datos.map((item) => (
        <PerfilCard 
          key={item._id}
          item={item}
          decodificado={decodificado}
          id={id}
          token={token}
        />
      ))}
    </div>
  );
}

/**
 * Componente para la tarjeta de perfil individual
 */
function PerfilCard({ item, decodificado, id, token }) {
  const isCurrentUser = decodificado?.id === id && token;
  const defaultPortada = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";


  return (
    <div className="bg-white rounded-xl overflow-hidden mb-16 shadow-lg mt-15">
      {/* Sección de portada */}
      <PortadaSection 
        portada={item.fotos.portada || defaultPortada}
        isCurrentUser={isCurrentUser}
        decodificado={decodificado}
        id={id}
        item={item}
      />

      {/* Sección de información */}
      <div className="pt-24 px-6 pb-10 bg-gray-50 rounded-b-xl shadow-inner">
        <NombreSection nombre={item.nombre} />
        
        {item.descripcion && <DescripcionSection descripcion={item.descripcion} />}
        
        <InfoAdicionalSection 
          ubicacion={item.ubicacion}
          numeroCelular={item.numeroCelular}
          rol={item.rol}
        />
      </div>
    </div>
  );
}

/**
 * Componente para la sección de portada
 */
function PortadaSection({ portada, isCurrentUser, decodificado, id, item }) {
  const defaultPortada = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
  
  return (
    <div className="relative h-80 bg-gray-100">
      <LazyLoadImage
        src={portada}
        alt="Portada"
        className="w-full h-full object-cover"
        onError={(e) => { e.target.src = defaultPortada; }}
      />

      {/* Botón para cambiar portada */}
      {isCurrentUser && (
        <Link
          to="/upImg/portada"
          className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-80 transition-colors"
        >
          Cambiar portada
        </Link>
      )}

      {/* Botones de configuración */}
      <BotonesConfig decodificado={decodificado} id={id} perfil={item} />

      {/* Imagen de perfil */}
      <PerfilImage 
        perfil={item.fotos.perfil}
        estado={item.estado}
        isCurrentUser={isCurrentUser}
        nombre={item.nombre}
      />
    </div>
  );
}

/**
 * Componente para la imagen de perfil
 */
function PerfilImage({ perfil, estado, isCurrentUser, nombre }) {
  const defaultPerfil = `https://ui-avatars.com/api/?name=${nombre}&background=364153&color=ffffff`;
  
  return (
    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
      <div className="relative">
        <LazyLoadImage
          src={perfil || defaultPerfil}
          alt="Perfil"
          className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
          onError={(e) => { e.target.src = defaultPerfil; }}
        />
        
        <EstadoBadge estado={estado} />
        
        {isCurrentUser && (
          <Link
            to="/upImg/perfil"
            className="absolute bottom-20 right-0 bg-blue-500 text-white text-sm w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-600 transition-colors"
          >
            <i className="bi bi-pencil"></i>
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Componente para el badge de estado (online/offline)
 */
function EstadoBadge({ estado }) {
  return (
    <span
    id="estado-perfil"
      className={`absolute inline-block left-6 bottom-0 w-20 text-center rounded-full text-sm ${
        estado ? "bg-green-300 text-black" : "bg-gray-300 text-black"
      }`}
    >
      {estado ? "online" : "offline"}
    </span>
  );
}

/**
 * Componente para la sección del nombre
 */
function NombreSection({ nombre }) {
  return (
    <h2 className="text-3xl font-extrabold text-gray-900 text-center">
      {nombre}
    </h2>
  );
}

/**
 * Componente para la sección de descripción
 */
function DescripcionSection({ descripcion }) {
  return (
    <div className="mt-6 mx-auto max-w-7xl bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <p className="whitespace-pre-wrap text-gray-700 text-lg leading-relaxed font-serif">
        {descripcion}
      </p>
    </div>
  );
}

/**
 * Componente para la sección de información adicional
 */
function InfoAdicionalSection({ ubicacion, numeroCelular, rol }) {
  return (
    <div className="mt-8 space-y-4 text-gray-700 text-base max-w-7xl mx-auto">
      {/* Ubicación */}
      <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200">
        <i className="bi bi-geo-alt-fill text-red-500 text-xl"></i>
        <span className="font-medium">
          <strong>Ubicación:</strong> {ubicacion || "Desconocida"}
        </span>
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white px-5 py-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <i className="bi bi-whatsapp text-green-500 text-2xl"></i>
          <span className="font-medium text-gray-800">
            {rol === "client" ? "Contactar cliente" : "¿Querés hacer una consulta o reservar una sesión?" }
            
          </span>
        </div>
        <WhatsAppButton numeroCelular={numeroCelular} />
      </div>
    </div>
  );
}

/**
 * Componente para el botón de WhatsApp
 */
function WhatsAppButton({ numeroCelular }) {
  return (
    <a
      href={`https://wa.me/${numeroCelular}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all"
    >
      <i className="bi bi-chat-dots-fill"></i>
      Contactar
    </a>
  );
}

/**
 * Componente para los botones de configuración
 */
function BotonesConfig({ decodificado, id, perfil }) {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const toggleOpciones = () => setMostrarOpciones(!mostrarOpciones);

  const esAdmin = decodificado?.rol === "admin";
  const esPhotographer = decodificado?.rol === "photographer";
  const esElMismoUsuario = decodificado?.id === id;
  const mostrarBoton = esElMismoUsuario || esAdmin;

  if (!mostrarBoton) return null;

  return (
    <div className="absolute top-6 right-6 z-20">
      <div className="relative">
        <button
          onClick={toggleOpciones}
          className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-700 text-white hover:bg-gray-800 shadow transition-all duration-300"
        >
          <i className="bi bi-gear"></i>
        </button>

        {mostrarOpciones && (
          <OpcionesMenu 
            esElMismoUsuario={esElMismoUsuario}
            esAdmin={esAdmin}
            esPhotographer={esPhotographer}
            perfil={perfil}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Componente para el menú de opciones
 */
function OpcionesMenu({ esElMismoUsuario, esAdmin, esPhotographer, perfil }) {
  return (
    <div className="absolute mt-2 w-48 right-0 px-4 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col py-2 gap-2 animate-fade-in-down">
      {esElMismoUsuario && (
        <>
          <Link
            to="/updateUser"
            className="w-full py-2 text-sm text-center text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
          >
            Editar perfil
          </Link>
          
          {(esAdmin || esPhotographer) && (
            <Link
              to="/createCategoria"
              className="w-full py-2 text-sm text-center text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
            >
              Crear categoría
            </Link>
          )}
          
          <CerrarSesion className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors cursor-pointer" />
          <EliminarCuenta className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition-colors cursor-pointer" />
        </>
      )}

      {/* Acciones solo si es admin Y no es su propio perfil */}
      {esAdmin && !esElMismoUsuario && (
        <>
          <SuspenderCuenta usuario={perfil} />
          <EliminarCuenta
            id={perfil._id}
            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition-colors cursor-pointer"
          />
        </>
      )}
    </div>
  );
}