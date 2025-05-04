import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";



export const VerificarRol = ({ children, rolesPermitidos }) => {

  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/login" />;
  
  try {
    const decod = jwtDecode(token);
    if (!rolesPermitidos.includes(decod.rol)) {
    
      return <Navigate to="/" />;
    }
    return children;
  } catch (e) {

    return <Navigate to="/login" />;
  }
};
