import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditLineasModal.css';

const EditLineasModal = ({ isOpen, onClose, line, onUpdate, onDelete, fetchLines }) => {
    const [nombre, setNombre] = useState('');
    const [floor, setFloor] = useState('');

    useEffect(() => {
        if (line) {
            setNombre(line.nombre);
            setFloor(line.Floor);
        }
    }, [line]);

    const handleUpdate = async () => {
        const updatedLine = { nombre, Floor: floor };
        await axios.put(`http://172.30.189.116:5000/lines/${line.idLinea}`, updatedLine);
        onUpdate(updatedLine);
        fetchLines();
        onClose();
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta línea?");
        if (confirmDelete) {
            await axios.delete(`http://172.30.189.116:5000/lines/${line.idLinea}`);
            onDelete(line.idLinea);
            fetchLines();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Línea</h2>
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
                <button onClick={handleUpdate}>Actualizar</button>
                <button onClick={handleDelete} className='btnDel'>Eliminar</button>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default EditLineasModal;