import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VerSolicitudesLinea.css';
import EditSolicitudModal from './EditSolicitudModal';

function VerSolLineaComponent({ IdentLinea, shouldFetch, Floor }) {
  const [dataSolicitudes, setDataSolicitudes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const fetchDataSolicitudes = async () => {
    try {
      const response = await axios.get(`http://172.30.190.47:5000/solicitudes/area/${IdentLinea}`, {
        params: {
          fecha: new Date().toISOString().split('T')[0]
        }
      });
      setDataSolicitudes(response.data);
    } catch (error) {
      console.log("<<Error fetching data>>", error);
    }
  };

  useEffect(() => {
    fetchDataSolicitudes();
  }, [IdentLinea, shouldFetch]);

  const getBackgroundColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return '#ffcccc'; // Rojo claro
      case 'Recibido':
        return '#008f39'; // Amarillo claro
      case 'Enviado':
        return '#ccffcc'; // Verde claro
      default:
        return '#ffffff'; // Blanco por defecto
    }
  };

  const getTurno = () => {
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();

    if (currentHour === 16 && currentMinutes >= 0 && currentMinutes < 30) {
      return 'A'; // Incluye hasta las 16:29
    } else if (currentHour >= 7 && currentHour < 16) {
      return 'A'; // Desde las 7:00 AM hasta las 3:59 PM
    } else if (currentHour === 16 && currentMinutes >= 31) {
      return 'B'; // Desde las 4:31 PM (16:31) en adelante
    } else if (currentHour >= 17 || (currentHour < 2)) {
      return 'B'; // Desde las 5:00 PM hasta la 1:30 AM
    } else {
      return 'A'; // Cualquier otro caso (por si acaso)
    }
  };

  const updateEstado = async (idSolicitud, nuevoEstado) => {
    try {
      await axios.put(`http://172.30.190.47:5000/solicitudes/${idSolicitud}`, { estado: nuevoEstado });
      setDataSolicitudes(prevSolicitudes => 
        prevSolicitudes.map(solicitud => 
          solicitud.idSolicitud === idSolicitud ? { ...solicitud, estado: nuevoEstado } : solicitud
        )
      );
    } catch (error) {
      console.log("<<Error updating estado>>", error);
    }
  };

  const handleRowClick = (solicitud) => {
    if (solicitud.estado === 'Pendiente') {
      setSelectedSolicitud(solicitud);
      setIsModalOpen(true);
    } else {
      toast.warn("Solo se pueden editar solicitudes con estado 'Pendiente'");
    }
  };

  const handleUpdateSolicitud = (updatedSolicitud) => {
    setDataSolicitudes(dataSolicitudes.map(solicitud => 
      solicitud.idSolicitud === updatedSolicitud.idSolicitud ? updatedSolicitud : solicitud
    ));
    toast.success("Solicitud actualizada correctamente!");
  };

  const filteredSolicitudes = dataSolicitudes.filter(solicitud => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados, así que sumamos 1
    const año = hoy.getFullYear();
    const fechaHoy = `${año}-${mes}-${dia}`; // Formato "YYYY-MM-DD"
    
    // Convierte la fecha de la solicitud a formato ISO y extrae solo la parte de la fecha
    const fechaSolicitud = new Date(solicitud.fechaSolicitud).toISOString().split('T')[0];

    // Compara las fechas de todos los registros de la tabla solicitudes, si NO coinciden las fechas ese registro NO se guarda en filteredSolicitudes
    return fechaSolicitud === fechaHoy; 
});

  const turnoActual = getTurno();
  const solicitudesFiltradas = filteredSolicitudes.filter(solicitud => solicitud.Turno === turnoActual);

  const formatDateTimeFromDB = (dateString) => {
    // Suponiendo que dateString es algo como "2025-01-10 10:46:26.0000000" en la BD
    const [datePart, timePart] = dateString.split('T'); // Divide en fecha y hora
    const [year, month, day] = datePart.split('-'); // Divide la fecha en componentes
    const [hours, minutes, seconds] = timePart.split(':'); // Divide la hora en componentes
    const [realSeconds] = seconds.split('.'); //Divide los segundos para quitar la parte de los milisegundos

    // Formatea la fecha y hora en el formato deseado
    return `${year}-${month}-${day} ${hours}:${minutes}:${realSeconds}`;
  };

  return (
    <div className="solicitudes-container">
      <ToastContainer containerId="containerA"/>
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
              <th>Recibido</th>
            </tr>
          </thead>
          <tbody className="solLinea-tb">
            {solicitudesFiltradas.map((solicitud) => (
              <tr key={solicitud.idSolicitud} style={{ backgroundColor: getBackgroundColor(solicitud.estado) }}>
                <td onClick={() => handleRowClick(solicitud)}>{solicitud.idSolicitud}</td>
                <td onClick={() => handleRowClick(solicitud)}>{solicitud.linea.nombre}</td>
                <td onClick={() => handleRowClick(solicitud)}>{solicitud.material.numero}</td>
                <td onClick={() => handleRowClick(solicitud)}>{solicitud.cantidad} {solicitud.tipoCantidad}</td>
                <td onClick={() => handleRowClick(solicitud)}>{solicitud.estado}</td>
                <td onClick={() => handleRowClick(solicitud)}>{formatDateTimeFromDB(solicitud.fechaSolicitud)}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={solicitud.estado === 'Recibido'}
                    onChange={() => updateEstado(solicitud.idSolicitud, 'Recibido')}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay solicitudes para el turno actual.</p>
      )}
      <EditSolicitudModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        solicitud={selectedSolicitud} 
        onUpdate={handleUpdateSolicitud} 
        fetchDataSolicitudes={fetchDataSolicitudes}
        Floor={Floor}
      />
    </div>
  );
}

export default VerSolLineaComponent;