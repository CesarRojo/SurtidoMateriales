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

  return (
    <div className="solicitudes-container">
      <h1>Lista de Solicitudes Hechas</h1>
      {dataSolicitudes.length > 0 ? (
        <div className="solicitudes-cards">
          {dataSolicitudes.map((solicitud) => (
            <div 
              className="solicitud-card" 
              key={solicitud.idSolicitud} 
              style={{ backgroundColor: getBackgroundColor(solicitud.estado) }}
            >
              <h2>Solicitud ID: {solicitud.idSolicitud}</h2>
              <p><strong>Área:</strong> {solicitud.area.nombre}</p>
              <p><strong>Línea:</strong> {solicitud.linea.nombre}</p>
              <p><strong>Material:</strong> {solicitud.material.nombre}</p>
              <p><strong>Cantidad:</strong> {solicitud.cantidad} {solicitud.tipoCantidad}</p>
              <p><strong>Estado:</strong> {solicitud.estado}</p>
              <p><strong>Fecha Solicitud:</strong> {new Date(solicitud.fechaSolicitud).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default VerSolLineaComponent;
