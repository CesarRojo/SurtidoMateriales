import axios from "axios";
import { useEffect, useState } from "react";
import './VerSolicitudes.css'; // Asegúrate de crear este archivo CSS para estilos

function VerSolicitudes() {
  const [dataSolicitudes, setDataSolicitudes] = useState([]);

  useEffect(() => {
    const fetchDataSolicitudes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/solicitudes/`);
        console.log("Datos RAAAAH", response.data);
        setDataSolicitudes(response.data);
      } catch (error) {
        console.log("<<Error fetching data>>", error);
      }
    };

    fetchDataSolicitudes();
  }, []);

  // Función para determinar el color de fondo según el estado
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

  // Función para actualizar el estado de las solicitudes
  const updateEstado = async (idSolicitud, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:3000/solicitudes/${idSolicitud}`, { estado: nuevoEstado }); //Hacer un put con axios usando el idSolicitud y enviando el body del estado
      // Actualizar el estado localmente
      setDataSolicitudes(prevSolicitudes => 
        prevSolicitudes.map(solicitud => 
          solicitud.idSolicitud === idSolicitud ? { ...solicitud, estado: nuevoEstado } : solicitud
        )
      );
    } catch (error) {
      console.log("<<Error updating estado>>", error);
    }
  };

  return (
    <div className="solicitudes-container">
      <h1>Lista de Solicitudes de Materiales</h1>
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
              <p><strong>Línea:</strong> {solicitud.area.linea.nombre}</p>
              <p><strong>Material:</strong> {solicitud.material.nombre}</p>
              <p><strong>Cantidad:</strong> {solicitud.cantidad}</p>
              <p><strong>Estado:</strong> {solicitud.estado}</p>
              <p><strong>Fecha Solicitud:</strong> {new Date(solicitud.fechaSolicitud).toLocaleString()}</p>
              <div className="button-group">
                {['Pendiente', 'En proceso', 'Entregado'].map((estado) => (
                  <button 
                    key={estado} 
                    onClick={() => updateEstado(solicitud.idSolicitud, estado)}
                    disabled={solicitud.estado === estado} // Deshabilitar boton si ya está en ese estado
                  >
                    Marcar como {estado}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default VerSolicitudes;