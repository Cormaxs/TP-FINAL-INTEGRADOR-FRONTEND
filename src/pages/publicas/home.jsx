import { Link } from "react-router-dom";
import { CardFotografos } from "../../components/cards/cardsFotografos";
import { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../context/api/crud-user";
import { CargasAlerts } from "../../context/api/load-alerts/cargas";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Helmet } from "react-helmet-async";

export default function Home() {
    const { buscarFotografos } = useContext(CrudContext);
    const { Loader } = useContext(CargasAlerts);
    const [busqueda, setBusqueda] = useState([]);
    const [loading, setLoading] = useState(true);

    const filtros = {
        "limit": 3
    };

    // Servicios ofrecidos
    const servicios = [
        {
            nombre: "Sesiones Fotográficas",
            descripcion: "Sesiones personalizadas para capturar tus momentos especiales."
        },
        {
            nombre: "Cobertura de Eventos",
            descripcion: "Documentación profesional de bodas, fiestas y eventos corporativos."
        },
        {
            nombre: "Fotografía Comercial",
            descripcion: "Imágenes profesionales para potenciar tu marca o negocio."
        },
        {
            nombre: "Edición Profesional",
            descripcion: "Retoque y mejoramiento de tus fotografías."
        }
    ];

    useEffect(() => {
        const cargarFotografos = async () => {
            try {
                setLoading(true);
                const buscado = await buscarFotografos({ filtros });
                setBusqueda(buscado);
            } catch (error) {
                console.error("Error al cargar fotógrafos:", error);
                setBusqueda([]);
            } finally {
                setLoading(false);
            }
        };
        
        cargarFotografos();
    }, [buscarFotografos]);

    return (
        <>
        <Helmet>
        <title>Fotografos Catamarca | conecta con fotografos</title>
        <meta name="description" content="Conectamos clientes con los mejores fotógrafos de toda argentina." />

      </Helmet>
       
        <div className="bg-white mt-15 ">
            {/* Hero Section */}
            <div className="relative bg-gray-900">
                <div className="absolute inset-0">
                    <LazyLoadImage
                    width={300} height={300}
                        className="w-full h-full object-cover opacity-50"
                        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                        alt="Fotógrafo profesional"
                    />
                </div>
                <div className="relative max-w-6xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Captura tus momentos inolvidables
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                        Encontra el fotografo que necesitas para tu ocacion especial
                    </p>
                    
                </div>
            </div>

            {/* Quiénes somos */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                   
                    <h2 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Nuestra historia
                    </h2>
                    <div className="mt-10 max-w-3xl mx-auto text-xl text-gray-500">
                        <p>
                            Somos una plataforma dedicada a conectar fotógrafos profesionales con clientes que buscan
                            capturar sus momentos más especiales.
                        </p>
                        <p className="mt-4">
                            Nuestra misión es facilitar el encuentro entre talento y necesidad.
                        </p>
                    </div>
                </div>
            </div>

            {/* Fotógrafos destacados */}
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                      
                        <h2 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                            Fotógrafos destacados
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader />
                        </div>
                    ) : busqueda.length > 0 ? (
                        <CardFotografos filtros={busqueda} />
                    ) : (
                        <p className="text-center py-8 text-gray-500">No se encontraron fotógrafos destacados</p>
                    )}

                    <div className="mt-10 text-center">
                        <Link
                            to="/fotografos"
                            className="inline-block bg-[var(--color-secundario)] py-3 px-8 border border-transparent rounded-md text-base font-medium text-white hover:bg-[var(--color-base-oscuro)]"
                        >
                            Ver todos los fotógrafos
                        </Link>
                    </div>
                </div>
            </div>

            {/* Servicios */}
            <div className="max-w-5xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                    
                    <h2 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                         servicios
                    </h2>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {servicios.map((servicio, index) => (
                        <div key={index} className="pt-6" id="servicios-home">
                            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-[var(--color-base-claro)] rounded-md shadow-lg">
                                            <svg
                                                className="h-6 w-6 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        {servicio.nombre}
                                    </h3>
                                    <p className="mt-1 text-base text-gray-500">
                                        {servicio.descripcion}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-[var(--color-base-oscuro)]">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">¿Listo para encontrar tu fotógrafo ideal?</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-white">
                        Regístrate ahora y descubre una comunidad de profesionales listos para capturar tus momentos especiales.
                    </p>
                    <Link
                        to="/Register"
                        id="btn-home-register"
                        className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[var(--color-base-oscuro)] bg-white hover:bg-[var(--hover-claro)] sm:w-auto"
                    >
                        Crear cuenta
                    </Link>
                </div>
            </div>
        </div>
     </>);
}