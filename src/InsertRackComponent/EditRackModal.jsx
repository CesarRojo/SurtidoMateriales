import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditRackModal.css';

const EditRackModal = ({ isOpen, onClose, rack, onUpdate, onDelete, fetchRacks }) => {
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        if (rack) {
            setNombre(rack.nombre);
        }
    }, [rack]);

    const handleUpdate = async () => {
        const updatedRack = { nombre };
        await axios.put(`http://172.30.189.120:5000/rack/${rack.idRack}`, updatedRack);
        onUpdate({ ...rack, nombre });
        fetchRacks();
        onClose();
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este rack?");
        if (confirmDelete) {
            await axios.delete(`http://172.30.189.120:5000/rack/${rack.idRack}`);
            onDelete(rack.idRack);
            fetchRacks();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Rack</h2>
                <input
                    type="text"
                    placeholder="Nombre del rack"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <button onClick={handleUpdate}>Actualizar</button>
                <button onClick={handleDelete} className='btnDel'>Eliminar</button>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default EditRackModal;