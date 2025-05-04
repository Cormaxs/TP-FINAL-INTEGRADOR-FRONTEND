import { Link } from "react-router-dom";

export default  function NotFound404() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-red-600">404</h1>
            <p className="text-2xl text-gray-700 mt-4">Página no encontrada</p>
            <Link 
                to="/" 
                className="mt-6 text-lg text-blue-500 hover:text-blue-700"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
