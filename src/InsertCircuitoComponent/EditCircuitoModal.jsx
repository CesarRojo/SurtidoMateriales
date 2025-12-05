import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../InsertLineasComponent/EditLineasModal.css';

const EditCircuitoModal = ({ isOpen, onClose, line, onUpdate, onDelete, fetchLines }) => {
    const [nombre, setNombre] = useState('');
    const [floor, setFloor] = useState('');

    useEffect(() => {
        if (line) {
            setNombre(line.nombre);
            setFloor(line.floor || '');
        }
    }, [line]);

    const handleUpdate = async () => {
        try {
            const updatedCircuito = { nombre, floor };
            await axios.put(`http://172.30.189.118:5000/circuito/${line.idCircuito}`, updatedCircuito);
            onUpdate({ ...line, ...updatedCircuito });
            fetchLines();
            onClose();
        } catch (error) {
            console.error('Error updating circuito:', error);
            alert('Error al actualizar el circuito');
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este circuito?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://172.30.189.118:5000/circuito/${line.idCircuito}`);
                onDelete(line.idCircuito);
                fetchLines();
                onClose();
            } catch (error) {
                console.error('Error deleting circuito:', error);
                alert('Error al eliminar el circuito');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Circuito</h2>
                <input
                    type="text"
                    placeholder="Nombre del circuito"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="FLOOR"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                />
                <button onClick={handleUpdate}>Actualizar</button>
                <button onClick={handleDelete} className='btnDel'>Eliminar</button>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default EditCircuitoModal;