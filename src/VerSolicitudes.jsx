import * as XLSX from 'xlsx';
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './VerSolicitudes.css';

function VerSolicitudes() {
  // const [fechaInicio, setFechaInicio] = useState('');
  // const [fechaFin, setFechaFin] = useState('');
  // const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]); // Inicializa con la fecha de hoy

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

  const [dataSolicitudes, setDataSolicitudes] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [lineaFiltro, setLineaFiltro] = useState('');

  const { IdentLinea } = useParams();

  const fetchDataSolicitudes = async () => {
    try {
      const response = await axios.get(`http://172.30.190.47:5000/solicitudes/area/${IdentLinea}`);
      setDataSolicitudes(response.data);
    } catch (error) {
      console.log("<<Error fetching data>>", error);
    }
  };

  useEffect(() => {
    // getTurnoHoras();
    fetchDataSolicitudes();
  }, [IdentLinea]);
  
  // useEffect(() => {
  //   if (fechaInicio && fechaFin) {
  //     fetchDataSolicitudes();
  //   }
  // }, [fechaInicio, fechaFin]);

  // Función para exportar a Excel
  const exportToExcel = () => {
    // Crear un libro de trabajo
    const wb = XLSX.utils.book_new();
    
    // Crear una hoja de trabajo a partir de los datos filtrados
    const ws = XLSX.utils.json_to_sheet(filteredSolicitudes.map(solicitud => ({
      'ID Solicitud': solicitud.idSolicitud,
      'Línea': solicitud.linea.nombre,
      'Material': solicitud.material.numero,
      'Cantidad': `${solicitud.cantidad} ${solicitud.tipoCantidad}`,
      'Estado': solicitud.estado,
      'Fecha Solicitud': new Date(solicitud.fechaSolicitud).toLocaleString(),
    })));

    // Agregar la hoja de trabajo al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes');

    // Exportar el libro
    XLSX.writeFile(wb, 'Solicitudes.xlsx');
  };

  // Función para determinar el color de fondo según el estado de la solicitud
  const getBackgroundColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return '#ffcccc'; // Rojo claro
      case 'Urgente':
        return '#ff0000'; // Rojo intenso
      case 'Recibido':
        return '#008f39'; // Verde
      case 'Enviado':
        return '#ccffcc'; // Verde claro
      default:
        return '#ffffff'; // Blanco por defecto
    }
  };

  // Función para actualizar el estado de las solicitudes
  const updateEstado = async (idSolicitud, nuevoEstado) => {
    try {
      await axios.put(`http://172.30.190.47:5000/solicitudes/${idSolicitud}`, { estado: nuevoEstado });
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

  // Función para obtener el turno actual
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

  // Filtrar solicitudes
  const filteredSolicitudes = dataSolicitudes.filter(solicitud => {
    const estadoMatch = estadoFiltro ? solicitud.estado === estadoFiltro : true;
    const lineaMatch = lineaFiltro ? solicitud.linea.nombre === lineaFiltro : true;

    // // Obtener la fecha de hoy en formato YYYY-MM-DD
    // const hoy = new Date();
    // const fechaHoy = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    // // Obtener la fecha de la solicitud en formato YYYY-MM-DD
    // const fechaSolicitud = new Date(solicitud.fechaSolicitud).toISOString().split('T')[0];

    // // Si hay un filtro de fecha, usarlo; de lo contrario, usar la fecha de hoy
    // const fechaMatch = fechaFiltro ? fechaSolicitud === fechaFiltro : fechaSolicitud === fechaHoy;

    return estadoMatch && lineaMatch;
  });

  // Filtrar las solicitudes según el turno actual
  // const turnoActual = getTurno();
  // const solicitudesTurnoActual = filteredSolicitudes.filter(solicitud => solicitud.Turno === turnoActual);

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
      <h1>Lista de Solicitudes de Materiales</h1>
      <div className="filter-container">
        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
          <option value="">Filtrar por Estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Enviado">Enviado</option>
          <option value="Recibido">Recibido</option>
        </select>
        {/* <input 
          type="date" 
          value={fechaFiltro} 
          onChange={(e) => setFechaFiltro(e.target.value)} 
          placeholder="Filtrar por Fecha" 
        /> */}
        <button onClick={exportToExcel}>Exportar a Excel</button>
      </div>
      {filteredSolicitudes.length > 0 ? (
        <table className="solicitudes-table">
          <thead>
            <tr>
              <th>ID Solicitud</th>
              <th>Línea</th>
              <th>Rack</th>
              <th>Material</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha Solicitud</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSolicitudes.map((solicitud) => (
              <tr key={solicitud.idSolicitud} style={{ backgroundColor: getBackgroundColor(solicitud.estado) }}>
                <td>{solicitud.idSolicitud}</td>
                <td>{solicitud.linea.nombre}</td>
                <td>{solicitud.material && solicitud.material.rack ? solicitud.material.rack.nombre : 'Sin Rack'}</td>
                <td>{solicitud.material.numero}</td>
                <td>{solicitud.cantidad} {solicitud.tipoCantidad}</td>
                <td>{solicitud.estado}</td>
                <td>{formatDateTimeFromDB(solicitud.fechaSolicitud)}</td>
                <td>
                  <button 
                    onClick={() => updateEstado(solicitud.idSolicitud, 'Pendiente')}
                    disabled={solicitud.estado === 'Pendiente' || solicitud.estado === 'Recibido'}
                  >
                    Marcar como Pendiente
                  </button>
                  <button 
                    onClick={() => updateEstado(solicitud.idSolicitud, 'Enviado')}
                    disabled={solicitud.estado === 'Enviado' || solicitud.estado === 'Recibido'}
                  >
                    Marcar como Enviado
                  </button>
                </td>
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

export default VerSolicitudes;