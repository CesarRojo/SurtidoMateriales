import axios from "axios";
import { useEffect, useState } from "react";
import './VerSolicitudesLinea.css'; // Asegúrate de crear este archivo CSS para estilos

function VerSolLineaComponent({ IdentLinea, shouldFetch }) {
  const [dataSolicitudes, setDataSolicitudes] = useState([]);

  useEffect(() => {
    const fetchDataSolicitudes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/solicitudes/area/${IdentLinea}`);
        console.log("Datos RAAAAH", response.data);
        setDataSolicitudes(response.data);
      } catch (error) {
        console.log("<<Error fetching data>>", error);
      }
    };

    fetchDataSolicitudes();
  }, [IdentLinea, shouldFetch]); // Agrega shouldFetch como dependencia

  // Función para determinar el color de fondo según el estado de la solicitud
  const getBackgroundColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return '#ffcccc'; // Rojo claro
      case 'En proceso':
        return '#ffffcc'; // Amarillo claro
      case 'Entregado':
        return '#ccffcc'; // Verde claro
      default:
        return '#ffffff'; // Blanco por defecto
    }
  };

  // Función para obtener el turno actual
  const getTurno = () => {
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();

    // Si la hora es entre 7:00 AM (7) y 4:30 PM (16:30)
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

  // Filtrar solicitudes por fecha de hoy
  const filteredSolicitudes = dataSolicitudes.filter(solicitud => {
    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    // Obtener la fecha de la solicitud en formato YYYY-MM-DD
    const fechaSolicitud = new Date(solicitud.fechaSolicitud).toISOString().split('T')[0];

    return fechaSolicitud === fechaHoy; // Filtrar solo solicitudes de hoy
  });

  // Filtrar las solicitudes según el turno actual
  const turnoActual = getTurno();
  const solicitudesFiltradas = filteredSolicitudes.filter(solicitud => solicitud.Turno === turnoActual);

  return (
    <div className="solicitudes-container">
      <h1>Lista de Solicitudes Hechas</h1>
      {solicitudesFiltradas.length > 0 ? (
        <table className="solicitudes-table">
        <thead>
          <tr>
            <th>ID Solicitud</th>
            <th>Línea</th>
            <th>Material</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Fecha Solicitud</th>
          </tr>
        </thead>
        <tbody>
          {solicitudesFiltradas.map((solicitud) => (
            <tr key={solicitud.idSolicitud} style={{ backgroundColor: getBackgroundColor(solicitud.estado) }}>
              <td>{solicitud.idSolicitud}</td>
              <td>{solicitud.linea.nombre}</td>
              <td>{solicitud.material.numero}</td>
              <td>{solicitud.cantidad} {solicitud.tipoCantidad}</td>
              <td>{solicitud.estado}</td>
              <td>{new Date(solicitud.fechaSolicitud).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : (
        <p>No hay solicitudes para el turno actual.</p>
      )}
    </div>
  );
}

export default VerSolLineaComponent;

/*

*/