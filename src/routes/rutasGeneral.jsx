import { lazy, Suspense, useContext } from "react";

const Home = lazy(() => import("../pages/publicas/home"));
const Fotografos = lazy(() => import("../pages/publicas/fotografos"));
const Login = lazy(() => import("../pages/acceso/login"));
const Register = lazy(() => import("../pages/acceso/register"));
const PerfilGeneral = lazy(() => import("../pages/publicas/perfil"));
const NotFound404 = lazy(() => import("../pages/publicas/404/404"));
const ModificarDatosUser = lazy(() => import("../pages/configuraciones-usuarios/modificarUser"));
const CategoriasImg = lazy(() => import("../pages/configuraciones-usuarios/subirCategoriasImg"));
const SubirImgSola = lazy(() => import("../pages/configuraciones-usuarios/subirImgSingle"));
const RecuperarPassword = lazy(() => import("../pages/acceso/recuperar-password"));
const CambiarPassword = lazy(()=> import("../pages/acceso/cambiar-password"));


import { Routes, Route } from "react-router-dom";
import { CargasAlerts } from "../context/api/load-alerts/cargas";
import { VerificarRol } from "./rutas-privadas"


export function RutasPrivadas() {
    
const { Loader} = useContext(CargasAlerts);
    return (

        <Suspense fallback={<Loader/>}>
            <Routes>
                {/*publicas*/}
                <Route path="/" element={<Home />} />
                <Route path="/fotografos" element={<Fotografos />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/perfil/:id" element={<PerfilGeneral />} />
                <Route path="/recuperar-password" element={<RecuperarPassword/>}/>
                <Route path="/update-password" element={<CambiarPassword/>}/>

                {/*privadas*/}
                <Route path="/updateUser" element={<VerificarRol rolesPermitidos={['client', 'photographer', 'admin']}><ModificarDatosUser /></VerificarRol>} />
                <Route path="/createCategoria" element={<VerificarRol rolesPermitidos={['photographer', 'admin']}><CategoriasImg /></VerificarRol>} />
                <Route path="/upImg/perfil" element={<VerificarRol rolesPermitidos={['client', 'photographer', 'admin']}><SubirImgSola tipo={"perfil"} /></VerificarRol>} />
                <Route path="/upImg/portada" element={<VerificarRol rolesPermitidos={['client', 'photographer', 'admin']}><SubirImgSola tipo={"portada"} /></VerificarRol>} />



                <Route path="*" element={<NotFound404 />} />
            </Routes>
        </Suspense>

    )
} 