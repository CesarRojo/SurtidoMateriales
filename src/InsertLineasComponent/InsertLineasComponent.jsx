import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InsertLines.css'

const InsertLineasComponent = () => {
  const [lines, setLines] = useState([]);
  const [nombre, setNombre] = useState('');
  const [identificadorLinea, setIdentificadorLinea] = useState('');
  const [floor, setFloor] = useState('');

  // Función para obtener las líneas desde la API
  const fetchLines = async () => {
    try {
      const response = await axios.get('http://172.30.190.47:5000/lines');
      setLines(response.data);
    } catch (error) {
      console.error('Error fetching lines:', error);
    }
  };

  // Función para manejar la inserción de una nueva línea
  const handleAddLine = async (e) => {
    e.preventDefault();
    try {
      const newLine = { nombre, IdentificadorLinea: Number(identificadorLinea), Floor: floor };
      await axios.post('http://172.30.190.47:5000/lines', newLine);
      fetchLines(); // Refrescar la lista después de agregar
      setNombre('');
      setIdentificadorLinea('');
      setFloor('');

      // Muestra la alerta de éxito
      toast.success("Linea insertada correctamente!");
    } catch (error) {
      console.error('Error adding line:', error);
      toast.error("Error al insertar la linea!");
    }
  };

  useEffect(() => {
    fetchLines(); // Obtener líneas al montar el componente
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
            type="number"
            placeholder="Identificador de la línea"
            value={identificadorLinea}
            onChange={(e) => setIdentificadorLinea(e.target.value)}
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
            <th>Nombre</th>
            <th>Identificador</th>
            <th>FLOOR</th>
          </tr>
        </thead>
        <tbody className="material-tablebd">
          {lines.map((line, index) => (
            <tr key={index}>
              <td>{line.nombre}</td>
              <td>{line.IdentificadorLinea}</td>
              <td>{line.Floor}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default InsertLineasComponent;