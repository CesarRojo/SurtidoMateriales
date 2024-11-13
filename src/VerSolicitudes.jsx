import axios from "axios";
import { useEffect, useState } from "react";
import './VerSolicitudes.css';

function VerSolicitudes() {
  const [dataSolicitudes, setDataSolicitudes] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [lineaFiltro, setLineaFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');

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

  // Función para actualizar el estado de las solicitudes
  const updateEstado = async (idSolicitud, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:3000/solicitudes/${idSolicitud}`, { estado: nuevoEstado });
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

  // Filtrar solicitudes
  const filteredSolicitudes = dataSolicitudes.filter(solicitud => {
    const estadoMatch = estadoFiltro ? solicitud.estado === estadoFiltro : true;
    const lineaMatch = lineaFiltro ? solicitud.linea.nombre === lineaFiltro : true;

    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    // Obtener la fecha de la solicitud en formato YYYY-MM-DD
    const fechaSolicitud = new Date(solicitud.fechaSolicitud).toISOString().split('T')[0];

    // Si hay un filtro de fecha, usarlo; de lo contrario, usar la fecha de hoy
    const fechaMatch = fechaFiltro ? fechaSolicitud === fechaFiltro : fechaSolicitud === fechaHoy;

    return estadoMatch && lineaMatch && fechaMatch;
  });

  // Obtener líneas únicas para el combobox
  const lineasUnicas = [...new Set(dataSolicitudes.map(solicitud => solicitud.linea.nombre))];

  return (
    <div className="solicitudes-container">
      <h1>Lista de Solicitudes de Materiales</h1>
      <div className="filter-container">
        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
          <option value="">Filtrar por Estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Entregado">Entregado</option>
        </select>
        <select value={lineaFiltro} onChange={(e) => setLineaFiltro(e.target.value)}>
          <option value="">Filtrar por Línea</option>
          {lineasUnicas.map((linea, index) => (
            <option key={index} value={linea}>{linea}</option>
          ))}
        </select>
        <input 
          type="date" 
          value={fechaFiltro} 
          onChange={(e) => setFechaFiltro(e.target.value)} 
          placeholder="Filtrar por Fecha" 
        />
      </div>
      {filteredSolicitudes.length > 0 ? (
        <div className="solicitudes-cards">
          {filteredSolicitudes.map((solicitud) => (
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
        <p>No hay solicitudes para mostrar.</p>
      )}
    </div>
  );
}

export default VerSolicitudes;
