import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditMaterialModal.css';

const EditMaterialModal = ({ isOpen, onClose, material, onUpdate, onDelete, fetchData }) => {
    const [numero, setNumero] = useState('');
    const [nombre, setNombre] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedRackId, setSelectedRackId] = useState('');
    const [dataLines, setDataLines] = useState([]);
    const [dataRacks, setDataRacks] = useState([]);

    useEffect(() => {
        const fetchLines = async () => {
            const response = await axios.get(`http://172.30.190.47:5000/lines`);
            setDataLines(response.data);
        };

        const fetchRacks = async () => {
            const response = await axios.get(`http://172.30.190.47:5000/rack`);
            setDataRacks(response.data);
        };

        fetchLines();
        fetchRacks();
    }, []);

    useEffect(() => {
        if (material) {
            setNumero(material.numero);
            setNombre(material.nombre);
            setSelectedFloor(material.floor);
            setSelectedRackId(material.idRack ? material.idRack : '');
        }
    }, [material]);

    const handleUpdate = async () => {
        const updatedMaterial = { 
            numero, 
            nombre, 
            floor: selectedFloor, 
            idRack: selectedRackId ? parseInt(selectedRackId) : null,
        };
        await axios.put(`http://172.30.190.47:5000/material/${material.idMaterial}`, updatedMaterial);
        onUpdate(updatedMaterial);
        fetchData();
        onClose();
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este material?");
        if (confirmDelete) {
            await axios.delete(`http://172.30.190.47:5000/material/${material.idMaterial}`);
            onDelete(material.idMaterial);
            fetchData();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Material</h2>
                <input
                    type="text"
                    placeholder="Número"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <select
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.target.value)}
                    required
                >
                    <option value="">Seleccione un FLOOR</option>
                    {dataLines.map((linea) => (
                        <option key={linea.idLinea} value={linea.Floor}>
                            {linea.Floor}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedRackId}
                    onChange={(e) => setSelectedRackId(e.target.value)}
                    required
                >
                    <option value="">Seleccione un RACK</option>
                    {dataRacks.map((rack) => (
                        <option key={rack.idRack} value={rack.idRack}>
                            {rack.nombre}
                        </option>
                    ))}
                </select>

                <button onClick={handleUpdate}>Actualizar</button>
                <button onClick={handleDelete} className='btnDel'>Eliminar</button>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default EditMaterialModal;