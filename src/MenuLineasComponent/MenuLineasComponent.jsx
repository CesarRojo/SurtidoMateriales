import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import './MenuLineas.css'; 

function MenuLineasComponent() {
  const [lineas, setLineas] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  // const [fechaInicio, setFechaInicio] = useState('');
  // const [fechaFin, setFechaFin] = useState('');

  // const getTurnoHoras = () => {
  //   const ahora = new Date();
    
  //   let dia = String(ahora.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos
  //   const mes = String(ahora.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados, así que sumamos 1
  //   const año = ahora.getFullYear();

  //   const currentHour = new Date().getHours();
  //   const currentMinutes = new Date().getMinutes();

  //   if (currentHour === 16 && currentMinutes >= 0 && currentMinutes < 30) {
  //     setFechaInicio(`${año}-${mes}-${dia}T06:00:00.000Z`);
  //     setFechaFin(`${año}-${mes}-${dia}T16:30:00.000Z`);
  //   } else if (currentHour >= 6 && currentHour < 16) {
  //     setFechaInicio(`${año}-${mes}-${dia}T06:00:00.000Z`);
  //     setFechaFin(`${año}-${mes}-${dia}T16:30:00.000Z`);
  //   } else if (currentHour >= 16 && currentMinutes >= 31) {
  //     setFechaInicio(`${año}-${mes}-${dia}T16:31:00.000Z`);
  //     setFechaFin(`${año}-${mes}-${dia}T24:00:00.000Z`);
  //   } else if (currentHour >= 17) {
  //     setFechaInicio(`${año}-${mes}-${dia}T16:31:00.000Z`);
  //     setFechaFin(`${año}-${mes}-${dia}T24:00:00.000Z`);
  //   }else if(currentHour < 2){
  //     setFechaFin(`${año}-${mes}-${dia}T02:00:00.000Z`); //Las 2am del dia actual
  //     dia = String(ahora.getDate() - 1).padStart(2, '0');
  //     setFechaInicio(`${año}-${mes}-${dia}T16:31:00.000Z`); //Las 16:31 del dia anterior
  //   } else {
  //     setFechaInicio(`${año}-${mes}-${dia}T06:00:00.000Z`);
  //     setFechaFin(`${año}-${mes}-${dia}T16:30:00.000Z`);
  //   }
  // };

  const fetchData = async () => {
    try {
      const lineasResponse = await axios.get(`http://172.30.190.47:5000/lines/`);
      setLineas(lineasResponse.data);
      // const fechaHoy = new Date().toISOString().split('T')[0];
      const solicitudesResponse = await axios.get(`http://172.30.190.47:5000/solicitudes/fecha`);
      setSolicitudes(solicitudesResponse.data);
    } catch (error) {
      console.log("<<Error fetching data>>", error);
    }
  };

  useEffect(() => {
    fetchData();
    // getTurnoHoras();
  }, []);
  
  // useEffect(() => {
  //   if (fechaInicio && fechaFin) {
  //     fetchData();
  //   }
  // }, [fechaInicio, fechaFin]);

  // const getTurno = () => {
  //   const currentHour = new Date().getHours();
  //   const currentMinutes = new Date().getMinutes();

  //   if (currentHour === 16 && currentMinutes >= 0 && currentMinutes < 30) {
  //     return 'A'; // Incluye hasta las 16:29
  //   } else if (currentHour >= 7 && currentHour < 16) {
  //     return 'A'; // Desde las 7:00 AM hasta las 3:59 PM
  //   } else if (currentHour === 16 && currentMinutes >= 31) {
  //     return 'B'; // Desde las 4:31 PM (16:31) en adelante
  //   } else if (currentHour >= 17 || (currentHour < 2)) {
  //     return 'B'; // Desde las 5:00 PM hasta la 1:30 AM
  //   } else {
  //     return 'A'; // Cualquier otro caso (por si acaso)
  //   }
  // };

  const contarSolicitudesPendientesPorLinea = (idLinea) => {
    const hoy = new Date();
    // const fechaHoy = hoy.toISOString().split('T')[0];
    // const turnoActual = getTurno();

    return solicitudes.filter(solicitud => {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud).toISOString().split('T')[0];
      return (
        solicitud.linea.idLinea === idLinea && 
        (solicitud.estado === 'Pendiente' || solicitud.estado === 'Urgente')
        // fechaSolicitud === fechaHoy && 
        // solicitud.Turno === turnoActual
      );
    }).length;
  };

  const handleCardClick = (IdentificadorLinea) => {
    navigate(`/solicitudes/${IdentificadorLinea}`);
  };

  return (
    <div className="lineas-container">
      <h1>PLANTA 3</h1>
      <h1>Solicitudes por Línea</h1>
      <div className="lineas-cards">
        {lineas.map((linea) => {
          const cantidadSolicitudes = contarSolicitudesPendientesPorLinea(linea.idLinea);
          const cardClass = cantidadSolicitudes > 0 ? 'red' : 'green'; // Cambia la clase según la cantidad de solicitudes

          return (
            <div 
              className={`linea-card ${cardClass}`} // Aplica la clase dinámica
              key={linea.idLinea} 
              onClick={() => handleCardClick(linea.idLinea)}
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