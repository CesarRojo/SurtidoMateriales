import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdmSolicitudes.css';

const AdmSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    turno: '',
    idLinea: '',
    numeroMaterial: '',
    nombreMaterial: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 17,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [lineas, setLineas] = useState([]);
  const [selectedLinea, setSelectedLinea] = useState(null);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      };

      // Limpiar params vacíos para no enviar
      Object.keys(params).forEach(
        (key) => (params[key] === '' || params[key] == null) && delete params[key]
      );

      const res = await axios.get('http://172.30.189.116:5000/solicitudes/filtered', { params });
      setSolicitudes(res.data.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: res.data.totalPages,
        total: res.data.total,
      }));
    } catch (error) {
      console.error('Error fetching solicitudes', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLineas = async () => {
    try {
        const res = await axios.get('http://172.30.189.116:5000/lines');
        setLineas(res.data);
    } catch (error) {
        console.error('Error fetching lineas', error);
    }
  }

  useEffect(() => {
    fetchLineas();
  }, [])

  useEffect(() => {
    fetchSolicitudes();
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
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

  const handleLineaChange = (e) => {
        const selectedIdLinea = e.target.value;
        setSelectedLinea(selectedIdLinea);
        setFilters((prev) => ({
            ...prev,
            idLinea: selectedIdLinea === '' ? '' : parseInt(selectedIdLinea),
        }));
        setPagination((prev) => ({ ...prev, page: 1 }));
  };  

  // Botón para reiniciar filtros
  const handleResetFilters = () => {
    setFilters({
      fechaInicio: '',
      fechaFin: '',
      turno: '',
      idLinea: '',
      numeroMaterial: '',
      nombreMaterial: '',
    });
    setSelectedLinea(null);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="material-table-container">
      <h2>Materiales - Solicitudes</h2>

      <div className="filters">
        <div>
          <label>Fecha Inicio:</label>
          <input
            type="date"
            name="fechaInicio"
            value={filters.fechaInicio}
            onChange={handleFilterChange}
            style={{ width: '91%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
          />
        </div>
        <div>
          <label>Fecha Fin:</label>
          <input
            type="date"
            name="fechaFin"
            value={filters.fechaFin}
            onChange={handleFilterChange}
            style={{ width: '91%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
          />
        </div>
        <div>
          <label>Turno:</label>
          <select name="turno" value={filters.turno} onChange={handleFilterChange}>
            <option value="">Todos</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>
        <div>
            <label>Seleccione una linea</label>
            <select
                id="lineas"
                value={filters.idLinea}
                onChange={handleLineaChange}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
            >
            <option value="">Seleccione una línea</option>
            {lineas.map((linea) => (
                <option key={linea.idLinea} value={linea.idLinea}>
                    {linea.nombre}
                </option>
            ))}
            </select>
        </div>
        <div>
          <label>Número Material:</label>
          <input
            type="text"
            name="numeroMaterial"
            value={filters.numeroMaterial}
            onChange={handleFilterChange}
            placeholder="Buscar por número"
          />
        </div>
        <div>
          <label>Nombre Material:</label>
          <input
            type="text"
            name="nombreMaterial"
            value={filters.nombreMaterial}
            onChange={handleFilterChange}
            placeholder="Buscar por nombre"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label>&nbsp;</label>
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              backgroundColor: '#e23926ff',
              color: '#fff',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              height: '42px'
            }}
          >
            Reiniciar filtros
          </button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="material-table">
            <thead>
              <tr>
                <th>ID Solicitud</th>
                <th>Fecha Solicitud</th>
                <th>Turno</th>
                <th>Línea</th>
                <th>Número Material</th>
                <th>Nombre Material</th>
                <th>Rack</th>
                <th>Cantidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center' }}>
                    No se encontraron resultados
                  </td>
                </tr>
              ) : (
                solicitudes.map((sol) => (
                  <tr key={sol.idSolicitud}>
                    <td>{sol.idSolicitud}</td>
                    <td>{sol.fechaSolicitud ? formatDateTimeFromDB(sol.fechaSolicitud) : ''}</td>
                    <td>{sol.Turno}</td>
                    <td>{sol.linea?.nombre || ''}</td>
                    <td>{sol.material?.numero || ''}</td>
                    <td>{sol.material?.nombre || ''}</td>
                    <td>{sol.material?.rack?.nombre || 'Sin rack'}</td>
                    <td>{sol.cantidad}</td>
                    <td>{sol.estado}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
              Anterior
            </button>
            <span>
              Página {pagination.page} de {pagination.totalPages} (Total: {pagination.total})
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdmSolicitudes;