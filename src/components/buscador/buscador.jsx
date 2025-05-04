import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CrudContext } from "../../context/api/crud-user";
import { CargasAlerts } from "../../context/api/load-alerts/cargas";

export function Buscador({ setFiltros, setPagina, pagina }) {
    const { buscarFotografos } = useContext(CrudContext);
    const { setLoading } = useContext(CargasAlerts);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            nombre: "",
            ubicacion: "",
            categoria: ""
        }
    });

    const onSubmit = async (data) => {
        setPagina(1); // Cuando se busca, volvemos a la página 1
        setFiltrosBusqueda(data);
    };

    const [filtros, setFiltrosBusqueda] = useState({
        nombre: "",
        ubicacion: "",
        categoria: "",
    });

    useEffect(() => {
        const fetchFotografos = async () => {
            setLoading(true);
            try {
                const respuesta = await buscarFotografos({
                    filtros: { ...filtros, page: pagina }
                });
                setFiltros(respuesta);
            } catch (error) {
                console.error("Error al cargar los fotógrafos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFotografos();
    }, [pagina, filtros, buscarFotografos, setFiltros, setLoading]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl m-auto my-5">
            {/* Contenedor principal */}
            <div className="flex flex-col justify-center md:flex-row md:items-center w-full space-y-4 md:space-y-0 md:space-x-4">
                {/* Grupo de campos (se apilan en móvil) */}
                <div className="flex flex-wrap w-full md:w-auto space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                    {/* Campo de búsqueda */}
                    <div className="flex-1 p-2">
                        <input
                            {...register("nombre")}
                            type="text"
                            placeholder="Buscar fotógrafos..."
                            className="w-full bg-transparent px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-base-claro)] text-gray-700 text-lg placeholder-gray-500"
                        />
                    </div>

                    {/* Selector de categoría */}
                    <div className="flex-1 p-2">
                        <select
                            {...register("categoria")}
                            className="w-full bg-transparent px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-base-claro)] text-gray-700 text-lg cursor-pointer"
                        >
                            <option value="">Todas las categorías</option>
                            <optgroup label="📅 Eventos">
                                <option value="bodas">Bodas</option>
                                <option value="quinceañeros">Quinceañeros</option>
                                <option value="egresos">Egresos</option>
                                <option value="bautismos">Bautismos</option>
                                <option value="cumpleaños">Cumpleaños</option>
                                <option value="fiestas-corporativas">Fiestas Corporativas</option>
                            </optgroup>
                            <optgroup label="💼 Comercial">
                                <option value="gastronomia">Gastronomía</option>
                                <option value="productos">Fotografía de Productos</option>
                                <option value="moda">Moda</option>
                                <option value="publicidad">Publicidad</option>
                                <option value="packshot">Packshot</option>
                                <option value="arquitectura">Arquitectura</option>
                            </optgroup>
                            <optgroup label="🎨 Arte/Creativo">
                                <option value="retrato">Retrato Artístico</option>
                                <option value="desnudo-artistico">Desnudo Artístico</option>
                                <option value="conceptual">Fotografía Conceptual</option>
                                <option value="abstracta">Abstracta</option>
                                <option value="callejera">Callejera</option>
                                <option value="minimalista">Minimalista</option>
                            </optgroup>
                            <optgroup label="🌿 Naturaleza">
                                <option value="paisajes">Paisajes</option>
                                <option value="fauna">Fauna</option>
                                <option value="flora">Flora</option>
                                <option value="astrofotografia">Astrofotografía</option>
                                <option value="submarina">Submarina</option>
                            </optgroup>
                            <optgroup label="🔍 Especialidades">
                                <option value="deportiva">Deportiva</option>
                                <option value="cientifica">Científica</option>
                                <option value="medica">Médica</option>
                                <option value="drones">Drones</option>
                                <option value="360">Fotografía 360°</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* Campo de ubicación */}
                    <div className="flex-1 p-2">
                        <input
                            {...register("ubicacion")}
                            type="text"
                            placeholder="Ubicación (ej: Buenos Aires)"
                            className="w-full bg-transparent px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secundario)] text-gray-700 text-lg placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Botón de búsqueda */}
                <div className="w-full md:w-auto p-2">
                    <button
                        type="submit"
                        className="cursor-pointer w-full md:w-auto bg-[var(--color-boton)] hover:bg-[var(--color-secundario)] text-white font-semibold py-2.5 px-7 rounded-md transition-colors duration-200 flex items-center justify-center text-sm md:text-base"
                    >
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>
        </form>
    );
}
