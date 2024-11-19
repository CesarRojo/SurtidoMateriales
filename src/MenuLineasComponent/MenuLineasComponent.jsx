import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import './MenuLineas.css'; 

function MenuLineasComponent() {
  const [lineas, setLineas] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener líneas
        const lineasResponse = await axios.get(`http://localhost:3000/lines/`);
        setLineas(lineasResponse.data);

        // Obtener solicitudes
        const solicitudesResponse = await axios.get(`http://localhost:3000/solicitudes/`);
        setSolicitudes(solicitudesResponse.data);
      } catch (error) {
        console.log("<<Error fetching data>>", error);
      }
    };

    fetchData();
  }, []);

  // Función para obtener el turno actual
  const getTurno = () => {
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();

    if (currentHour === 16 && currentMinutes >= 0 && currentMinutes < 30) {
      return 'A'; // Incluye hasta las 16:29
    } else if (currentHour >= 7 && currentHour < 17) {
      return 'A'; // Desde las 7:00 AM hasta las 4:29 PM
    } else if (currentHour === 17 && currentMinutes >= 0) {
      return 'B'; // Desde las 5:30 PM (17:30) en adelante
    } else if (currentHour > 17 || (currentHour < 2)) {
      return 'B'; // Desde las 5:30 PM hasta la 1:30 AM
    } else {
      return 'A'; // Cualquier otro caso (por si acaso)
    }
  };

  // Contar solicitudes 'Pendientes' por línea, fecha y turno
  const contarSolicitudesPendientesPorLinea = (idLinea) => {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const turnoActual = getTurno();

    return solicitudes.filter(solicitud => {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud).toISOString().split('T')[0]; // Formato YYYY-MM-DD
      return (
        solicitud.linea.idLinea === idLinea && 
        solicitud.estado === 'Pendiente' &&
        fechaSolicitud === fechaHoy && 
        solicitud.Turno === turnoActual
      );
    }).length;
  };

  // Función para manejar el clic en la tarjeta
  const handleCardClick = (IdentificadorLinea) => {
    navigate(`/solicitudes/${IdentificadorLinea}`); // Esto llevará a la pantalla para ver las solicitudes de cada linea
  };

  return (
    <div className="lineas-container">
      <h1>Solicitudes por Línea</h1>
      <div className="lineas-cards">
        {lineas.map((linea) => {
          const cantidadSolicitudes = contarSolicitudesPendientesPorLinea(linea.idLinea);
          return (
            <div 
              className="linea-card" 
              key={linea.idLinea} 
              onClick={() => handleCardClick(linea.IdentificadorLinea)} // Agrega el manejador de clic
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