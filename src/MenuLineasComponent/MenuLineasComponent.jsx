import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import './MenuLineas.css'; 

function MenuLineasComponent() {
  const [lineas, setLineas] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lineasResponse = await axios.get(`http://172.30.190.47:5000/lines/`);
        setLineas(lineasResponse.data);
        const solicitudesResponse = await axios.get(`http://172.30.190.47:5000/solicitudes/`);
        setSolicitudes(solicitudesResponse.data);
      } catch (error) {
        console.log("<<Error fetching data>>", error);
      }
    };

    fetchData();
  }, []);

  const getTurno = () => {
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();

    if (currentHour === 16 && currentMinutes >= 0 && currentMinutes < 30) {
      return 'A';
    } else if (currentHour >= 7 && currentHour < 17) {
      return 'A';
    } else if (currentHour === 17 && currentMinutes >= 0) {
      return 'B';
    } else if (currentHour > 17 || (currentHour < 2)) {
      return 'B';
    } else {
      return 'A';
    }
  };

  const contarSolicitudesPendientesPorLinea = (idLinea) => {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0];
    const turnoActual = getTurno();

    return solicitudes.filter(solicitud => {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud).toISOString().split('T')[0];
      return (
        solicitud.linea.idLinea === idLinea && 
        solicitud.estado === 'Pendiente' &&
        fechaSolicitud === fechaHoy && 
        solicitud.Turno === turnoActual
      );
    }).length;
  };

  const handleCardClick = (IdentificadorLinea) => {
    navigate(`/solicitudes/${IdentificadorLinea}`);
  };

  return (
    <div className="lineas-container">
      <h1>Solicitudes por Línea</h1>
      <div className="lineas-cards">
        {lineas.map((linea) => {
          const cantidadSolicitudes = contarSolicitudesPendientesPorLinea(linea.idLinea);
          const cardClass = cantidadSolicitudes > 0 ? 'red' : 'green'; // Cambia la clase según la cantidad de solicitudes

          return (
            <div 
              className={`linea-card ${cardClass}`} // Aplica la clase dinámica
              key={linea.idLinea} 
              onClick={() => handleCardClick(linea.IdentificadorLinea)}
            >
              <h2>{linea.nombre}</h2>
              <div className="notification-bubble">{cantidadSolicitudes}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MenuLineasComponent;