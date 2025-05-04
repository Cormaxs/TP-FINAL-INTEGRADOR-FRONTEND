import { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../context/api/crud-user";
import { useParams } from "react-router-dom";
import { DatosPerfil } from "../../components/cards/cardPerfil";
import { ShowCategories } from "../../components/cards/cardCategorias";
import { CargasAlerts } from "../../context/api/load-alerts/cargas";
import { Helmet } from "react-helmet-async";


export default function PerfilGeneral() {
  const { traeruserId, decodificado, token } = useContext(CrudContext);
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const { Loader, loading, setLoading } = useContext(CargasAlerts);


  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true)
        const userData = await traeruserId(id);
        setUser(userData);
      } catch (err) {

      } finally {
        setLoading(false)
      }
    };

    fetchUser();
  }, [id]);


  if (!user) return loading && Loader(); 

  return (
    <>
      <Helmet>
        <title>{user.nombre}</title>
        <meta name="description" content={user.descripcion} />
        <meta property="og:title" content={user.nombre} />
        <meta property="og:description" content={user.descripcion} />
        <meta property="og:image" content={user.fotos.perfil} />
        <meta property="og:url" content={window.location.href} />
        <meta
          name="keywords"
          content= {user.categorias.map(e => e.categoria).join(", ")}
        />
      </Helmet>

      <DatosPerfil perfil={user} decodificado={decodificado} id={id} token={token} />

      <ShowCategories categorias={user} decodificado={decodificado} id={id} token={token} />

    </>
  );
}