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
    const fechaHoy = hoy.toISOString().split('T')[0];
    const fechaSolicitud = new Date(solicitud.fechaSolicitud).toISOString().split('T')[0];
    return fechaSolicitud === fechaHoy;
  });

  const turnoActual = getTurno();
  const solicitudesFiltradas = filteredSolicitudes.filter(solicitud => solicitud.Turno === turnoActual);

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
                <td onClick={() => handleRowClick(solicitud)}>{new Date(solicitud.fechaSolicitud).toLocaleString()}</td>
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