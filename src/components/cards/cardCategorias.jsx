import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { CrudContext } from '../../context/api/crud-user';
import { ContextToasty } from '../../context/api/load-alerts/toastfy-alerts';
import { LazyLoadImage } from "react-lazy-load-image-component";



export function ShowCategories({ categorias: categoriasProp, decodificado, id, token }) {

    const { eliminarImagen, eliminarCategoria } = useContext(CrudContext);
    const { error, exitoso, corroborar } = useContext(ContextToasty);
    

    const [categorias, setCategorias] = useState(categoriasProp);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [zoom, setZoom] = useState(1);
    
  
    const imageRef = useRef(null);
    
    // Verificación de autenticación
    const isLoggedIn = decodificado?.id === id && token && token.length > 0;

    // sincroniza categorías externas
    useEffect(() => {
        setCategorias(categoriasProp);
    }, [categoriasProp]);

    // Manejadores del visor de imágenes
    const openImageViewer = useCallback((categoryIndex, imageIndex) => {
        const image = categorias.categorias[categoryIndex].imagenes[imageIndex];
        setCurrentCategoryIndex(categoryIndex);
        setCurrentImageIndex(imageIndex);
        setSelectedImage(image);
        setZoom(1);
    }, [categorias]);

    const closeImageViewer = useCallback(() => {
        setSelectedImage(null);
        setZoom(1);
    }, []);

    const navigateImage = useCallback((direction) => {
        setCurrentImageIndex(prevImageIndex => {
            const currentCategory = categorias.categorias[currentCategoryIndex];
            let newIndex = prevImageIndex + direction;

            // Navegación entre categorías si es necesario
            if (newIndex < 0) {
                if (currentCategoryIndex > 0) {
                    const prevCategory = categorias.categorias[currentCategoryIndex - 1];
                    setCurrentCategoryIndex(currentCategoryIndex - 1);
                    setSelectedImage(prevCategory.imagenes[prevCategory.imagenes.length - 1]);
                    return prevCategory.imagenes.length - 1;
                }
                return 0;
            }

            if (newIndex >= currentCategory.imagenes.length) {
                if (currentCategoryIndex < categorias.categorias.length - 1) {
                    const nextCategory = categorias.categorias[currentCategoryIndex + 1];
                    setCurrentCategoryIndex(currentCategoryIndex + 1);
                    setSelectedImage(nextCategory.imagenes[0]);
                    return 0;
                }
                return currentCategory.imagenes.length - 1;
            }

            setSelectedImage(currentCategory.imagenes[newIndex]);
            return newIndex;
        });
        setZoom(1);
    }, [currentCategoryIndex, categorias]);

    // Efectos para manejar eventos de teclado y rueda del mouse
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage) return;
            
            switch (e.key) {
                case 'ArrowLeft': navigateImage(-1); break;
                case 'ArrowRight': navigateImage(1); break;
                case 'Escape': closeImageViewer(); break;
                default: break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, navigateImage, closeImageViewer]);

    useEffect(() => {
        if (!selectedImage) return;

        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                setZoom(prev => Math.min(Math.max(prev - e.deltaY / 1000, 1), 4));
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [selectedImage]);

    // Manejadores de eliminación
    const handleDeleteCategory = async (categoria, e) => {
        e.stopPropagation();
        const res = await corroborar("eliminar categoria", "¿Estás seguro de eliminar la categoría");
        
        if (res) {
            try {
                await eliminarCategoria(categoria);
                setCategorias(prev => ({
                    categorias: prev.categorias.filter(c => c.categoria !== categoria)
                }));
                exitoso("categoria eliminada con exito");
            } catch (error) {
                console.error("Error al eliminar categoría:", error);
                error("Error al eliminar la categoria");
            }
        }
    };

    const handleDeleteImage = async (categoria, imagen, e) => {
        e.stopPropagation();
        const res = await corroborar("eliminar imagen", `¿Estás seguro de eliminar la imagen ${imagen.split('/').pop()}?`);
        
        if (res) {
            try {
                await eliminarImagen(categoria, imagen.split('/').pop());
                exitoso("imagen eliminada con exito");
                setCategorias(prev => ({
                    categorias: prev.categorias.map(cat => {
                        if (cat.categoria === categoria) {
                            return {
                                ...cat,
                                imagenes: cat.imagenes.filter(img => img !== imagen)
                            };
                        }
                        return cat;
                    })
                }));
            } catch (error) {
                console.error("Error al eliminar imagen:", error);
            }
        }
    };

   
    return (
        <div className="max-w-7xl mx-auto p-4 space-y-8">
            {/* Listado de categorías */}
            {categorias.categorias.map((catego, categoryIndex) => (
                <div key={catego._id || catego.categoria} className="bg-white rounded-xl shadow-md overflow-hidden relative">
                    {/* Botón de eliminar categoría (solo para usuarios autenticados) */}
                    {isLoggedIn && (
                        <DeleteButton 
                            onClick={(e) => handleDeleteCategory(catego.categoria, e)}
                            title="Eliminar categoría"
                            position="top-2 right-2"
                        />
                    )}

                    {/* Encabezado de la categoría */}
                    <CategoryHeader 
                        name={catego.categoria}
                        imageCount={catego.imagenes.length}
                        price={catego.precio}
                    />

                    {/* Grid de imágenes */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5">
                        {catego.imagenes.map((imagen, imageIndex) => (
                            <ImageThumbnail 
                                key={imageIndex}
                                image={imagen}
                                alt={`Imagen ${imageIndex + 1} de ${catego.categoria}`}
                                onClick={() => openImageViewer(categoryIndex, imageIndex)}
                                showDelete={isLoggedIn}
                                onDelete={(e) => handleDeleteImage(catego.categoria, imagen, e)}
                            />
                        ))}
                    </div>
                </div>
            ))}

            {/* Visor de imágenes modal */}
            {selectedImage && (
                <ImageViewer 
                    image={selectedImage}
                    zoom={zoom}
                    currentImageIndex={currentImageIndex}
                    totalImages={categorias.categorias[currentCategoryIndex].imagenes.length}
                    categoryName={categorias.categorias[currentCategoryIndex].categoria}
                    onClose={closeImageViewer}
                    onNavigate={navigateImage}
                    imageRef={imageRef}
                />
            )}
        </div>
    );
}



/* Componente para el encabezado de la categoría*/
function CategoryHeader({ name, imageCount, price }) {
    return (
        <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 capitalize">{name}</h2>
            <p className="text-sm text-gray-500">{imageCount} fotos</p>
            <p className="text-sm text-gray-600">
                Precio por hora:{' '}
                {typeof price === 'number'
                    ? `$ ${price.toLocaleString('es-AR')}`
                    : 'Consultar'}
            </p>
        </div>
    );
}

/*Componente para la miniatura de imagen*/
function ImageThumbnail({ image, alt, onClick, showDelete, onDelete }) {
    return (
        <div className="relative aspect-square cursor-pointer group" onClick={onClick}>
            <LazyLoadImage
                src={image}
                alt={alt}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                loading="lazy"
            />
            {showDelete && (
                <DeleteButton 
                    onClick={onDelete}
                    title="Eliminar imagen"
                    position="bottom-1 right-1"
                    size="h-3 w-3"
                />
            )}
        </div>
    );
}

/*Componente para el visor de imágenes*/
function ImageViewer({ image, zoom, currentImageIndex, totalImages, categoryName, onClose, onNavigate, imageRef }) {
    return (
        <div id='imageView-categorias' className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4" onClick={onClose}>
            {/* Botón de cerrar */}
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 text-white text-3xl z-50 hover:bg-white/10 p-2 rounded-full"
                aria-label="Cerrar visor"
            >
                &times;
            </button>

            {/* Contenedor de la imagen con navegación */}
            <div className="relative w-full max-w-4xl h-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <NavigationButton direction="left" onClick={(e) => { e.stopPropagation(); onNavigate(-1); }} />
                
                <LazyLoadImage
                    ref={imageRef}
                    src={image}
                    alt={`Imagen ${currentImageIndex + 1}`}
                    style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
                    className="max-w-full max-h-full object-contain select-none"
                    draggable="false"
                />
                
                <NavigationButton direction="right" onClick={(e) => { e.stopPropagation(); onNavigate(1); }} />
            </div>

            {/* Información de la imagen */}
            <div className="absolute bottom-4 flex items-center gap-2 text-white text-sm md:text-base bg-black/50 px-4 py-2 rounded-full">
                Imagen {currentImageIndex + 1} de {totalImages} •
                Categoría: {categoryName}
            </div>
        </div>
    );
}

/**
 * Componente para botones de navegación
 */
function NavigationButton({ direction, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`absolute ${direction === 'left' ? 'left-4' : 'right-4'} bg-white bg-opacity-80 hover:bg-opacity-100 text-black p-3 rounded-full z-10 shadow-md`}
            aria-label={`Imagen ${direction === 'left' ? 'anterior' : 'siguiente'}`}
        >
            {direction === 'left' ? '❮' : '❯'}
        </button>
    );
}

/**
 * Componente para botones de eliminación
 */
function DeleteButton({ onClick, title, position, size = 'h-4 w-4' }) {
    return (
        <button
            onClick={onClick}
            className={`absolute ${position} bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full z-10`}
            title={title}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className={size} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    );
}