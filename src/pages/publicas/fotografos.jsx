import { useState } from "react";
import { CardFotografos } from "../../components/cards/cardsFotografos.jsx";
import { Buscador } from "../../components/buscador/buscador.jsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Fotografos() {
    const [filtros, setFiltros] = useState({});
    const [pagina, setPagina] = useState(parseInt(localStorage.getItem("pagina")) || 1);

    const manejarCambioPagina = (nuevaPagina) => {
        if (nuevaPagina < 1) return;
        setPagina(nuevaPagina);
        localStorage.setItem("pagina", nuevaPagina);
    };

    return (
        <>
        <Helmet>
        <title>Buscar fotografos</title>
        <meta name="description" content="Encontra a los mejores fotografos." />
      </Helmet>
        <div className="bg-[var(--color-fondo)] min-h-screen py-10 px-4 sm:px-8 mt-15">
            <h1 className="text-3xl font-bold text-[var(--color-primario)] mb-6 text-center">Explorár fotógrafos</h1>
            
            <div className="max-w-4xl mx-auto">
                <Buscador 
                    setFiltros={setFiltros}
                    setPagina={setPagina}
                    pagina={pagina}
                />
            </div>

            <div className="mt-10">
                <CardFotografos filtros={filtros} />
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center mt-10 space-x-6">
                <button
                    onClick={() => manejarCambioPagina(pagina - 1)}
                    disabled={pagina === 1}
                    className="flex cursor-pointer items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-primario)] text-white 
                               hover:bg-[var(--color-primario)] transition duration-300
                               disabled:bg-[var(--color-base-claro)] disabled:cursor-not-allowed"
                >
                    <ArrowLeft size={20} />
                    Anterior
                </button>

                <span className="text-lg font-semibold text-[var(--color-primario)]">Página {pagina}</span>

                <button
                    onClick={() => manejarCambioPagina(pagina + 1)}
                    className="flex cursor-pointer items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-primario)] text-white 
                               hover:bg-[var(--color-primario-hover)] transition duration-300"
                >
                    Siguiente
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    </> );
   
}
