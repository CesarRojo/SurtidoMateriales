import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InsertLines.css';
import EditLineModal from './EditLineasModal';

const InsertLineasComponent = () => {
  const [lines, setLines] = useState([]);
  const [nombre, setNombre] = useState('');
  const [floor, setFloor] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);

  const fetchLines = async () => {
    try {
      const response = await axios.get('http://172.30.189.118:5000/lines');
      setLines(response.data);
    } catch (error) {
      console.error('Error fetching lines:', error);
    }
  };

  const handleAddLine = async (e) => {
    e.preventDefault();
    try {
      const newLine = { nombre, Floor: floor };
      await axios.post('http://172.30.189.118:5000/lines', newLine);
      fetchLines();
      setNombre('');
      setFloor('');
      toast.success("Línea insertada correctamente!");
    } catch (error) {
      console.error('Error adding line:', error);
      toast.error("Error al insertar la línea!");
    }
  };

  const handleRowClick = (line) => {
    setSelectedLine(line);
    setIsModalOpen(true);
  };

  const handleUpdateLine = (updatedLine) => {
    setLines(lines.map(line => 
        line.idLinea === updatedLine.idLinea ? updatedLine : line
    ));
    toast.success("Línea actualizada correctamente!");
  };

  const handleDeleteLine = (idLinea) => {
    setLines(lines.filter(line => line.idLinea !== idLinea));
    toast.success("Línea eliminada correctamente!");
  };

  useEffect(() => {
    fetchLines();
  }, []);

  return (
    <div className='lines-container'>
      <h2>Agregar Nueva Línea</h2>
      <form onSubmit={handleAddLine}>
        <input
            type="text"
            placeholder="Nombre de la línea"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
        />
        <input
            type="text"
            placeholder="FLOOR"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            required
        />
        <br />
        <button type="submit">Agregar Línea</button>
      </form>
      <table className="material-table">
        <thead className="material-tablehd">
          <tr>
            <th>ID Linea</th>
            <th>Nombre</th>
            <th>FLOOR</th>
          </tr>
        </thead>
        <tbody className="material-tablebd">
          {lines.map((line, index) => (
            <tr key={index} onClick={() => handleRowClick(line)}>
              <td>{line.idLinea}</td>
              <td>{line.nombre}</td>
              <td>{line.Floor}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
      <EditLineModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        line={selectedLine} 
        onUpdate={handleUpdateLine} 
        onDelete={handleDeleteLine}
        fetchLines={fetchLines}
      />
    </div>
  );
};

export default InsertLineasComponent;