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
      const response = await axios.get(`http://172.30.189.112:5000/solicitudes/area/${IdentLinea}`);
      setDataSolicitudes(response.data);
    } catch (error) {
      console.error("<<Error fetching data>>", error);
    }
  };
  
  useEffect(() => {
      fetchDataSolicitudes();
  }, [IdentLinea, shouldFetch]);

  const getBackgroundColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return '#ffcccc'; // Rojo claro
      case 'Urgente':
        return '#ff0000'; // Rojo intenso
      case 'Recibido':
        return '#008f39'; // Amarillo claro
      case 'Enviado':
        return '#ccffcc'; // Verde claro
      default:
        return '#ffffff'; // Blanco por defecto
    }
  };

  const updateEstado = async (idSolicitud, nuevoEstado) => {
    try {
      await axios.put(`http://172.30.189.112:5000/solicitudes/${idSolicitud}`, { estado: nuevoEstado });
      setDataSolicitudes(prevSolicitudes => 
        prevSolicitudes.map(solicitud => 
          solicitud.idSolicitud === idSolicitud ? { ...solicitud, estado: nuevoEstado } : solicitud
        )
      );
    } catch (error) {
      console.error("<<Error updating estado>>", error);
    }
  };

  const handleRowClick = (solicitud) => {
    if (solicitud.estado === 'Pendiente' || solicitud.estado === 'Urgente') {
      setSelectedSolicitud(solicitud);
      setIsModalOpen(true);
    } else {
      toast.warn("Solo se pueden editar solicitudes con estado 'Pendiente' o 'Urgente'.");
    }
  };

  const handleUpdateSolicitud = (updatedSolicitud) => {
    setDataSolicitudes(dataSolicitudes.map(solicitud => 
      solicitud.idSolicitud === updatedSolicitud.idSolicitud ? updatedSolicitud : solicitud
    ));
    toast.success("Solicitud actualizada correctamente!");
  };

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
      {dataSolicitudes.length > 0 ? (
        <table className="solicitudes-table">
          <thead>
            <tr>
              <th>ID Solicitud</th>
              <th>Línea</th>
              <th>Material</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha Solicitud</th>
              <th>Urgente</th>
              <th>Recibido</th>
            </tr>
          </thead>
          <tbody className="solLinea-tb">
            {dataSolicitudes.map((solicitud) => (
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
                    checked={solicitud.estado === 'Urgente'}
                    disabled={solicitud.estado !== 'Pendiente' && solicitud.estado !== 'Urgente'}
                    onChange={() => {
                      const nuevoEstado = solicitud.estado === 'Urgente' ? 'Pendiente' : 'Urgente';
                      updateEstado(solicitud.idSolicitud, nuevoEstado);
                    }}
                  />
                </td>
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