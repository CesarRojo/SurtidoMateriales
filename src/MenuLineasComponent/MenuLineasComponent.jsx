import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import './MenuLineas.css'; 
import io from "socket.io-client";

function MenuLineasComponent() {
  const [lineas, setLineas] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  const fetchLineas = async () => {
    try {
      const lineasResponse = await axios.get(`http://172.30.189.112:5000/lines/`);
      setLineas(lineasResponse.data);
    } catch (error) {
      console.log("<<Error fetching lines>>", error);
    }
  }

  const fetchData = async () => {
    try {
      const solicitudesResponse = await axios.get(`http://172.30.189.112:5000/solicitudes/fecha`);
      setSolicitudes(solicitudesResponse.data);
    } catch (error) {
      console.log("<<Error fetching data>>", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLineas();

    const socket = io('http://172.30.189.112:5000'); // URL del backend Socket.IO

    socket.on('connect', () => {
      console.log('Socket.IO conectado');
    });

    socket.on('solicitudes_actualizadas', () => {
      fetchData();
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO desconectado');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const contarSolicitudesPendientesPorLinea = (idLinea) => {
    const solicitudesLinea = solicitudes.filter(solicitud => 
      solicitud.linea.idLinea === idLinea && 
      (solicitud.estado === 'Pendiente' || solicitud.estado === 'Urgente')
    );

    const cantidad = solicitudesLinea.length;
    const tieneUrgente = solicitudesLinea.some(solicitud => solicitud.estado === 'Urgente');

    return { cantidad, tieneUrgente };
  };

  const handleCardClick = (IdentificadorLinea) => {
    navigate(`/solicitudes/${IdentificadorLinea}`);
  };

  return (
    <div className="lineas-container">
      <h1>Solicitudes por Línea</h1>
      <div className="lineas-cards">
        {lineas.map((linea) => {
          const { cantidad, tieneUrgente } = contarSolicitudesPendientesPorLinea(linea.idLinea);
          const cardClass = cantidad > 0 ? 'red' : 'green';
          const urgentClass = tieneUrgente ? 'urgent' : '';

          return (
            <div 
              className={`linea-card ${cardClass} ${urgentClass}`} 
              key={linea.idLinea} 
              onClick={() => handleCardClick(linea.idLinea)}
            >
              <h2>{linea.nombre}</h2>
              <div className="notification-bubble">{cantidad}</div>
              {tieneUrgente && <i className="fa-solid fa-triangle-exclamation fa-beat-fade urgent-indicator" style={{color: '#FFD43B'}}></i>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MenuLineasComponent;