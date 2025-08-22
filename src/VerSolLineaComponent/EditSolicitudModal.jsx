import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './EditSolicitudModal.css';

const EditSolicitudModal = ({ isOpen, onClose, solicitud, onUpdate, fetchDataSolicitudes, Floor }) => {
    const [cantidad, setCantidad] = useState('');
    const [tipoCantidad, setTipoCantidad] = useState('');
    const [dataMaterial, setDataMaterial] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    useEffect(() => {
        const fetchDataMaterial = async () => {
            try {
                const response = await axios.get(`http://172.30.189.112:5000/material/floor`, {
                    params: {
                        floor: Floor,
                    }
                });
                const formattedMaterials = response.data.map(material => ({
                    value: material.idMaterial,
                    label: material.numero
                }));
                setDataMaterial(formattedMaterials);
            } catch (error) {
                console.log("<<Error fetching data>>", error);
            }
        };

        fetchDataMaterial();

        if (solicitud) {
            setCantidad(solicitud.cantidad);
            setTipoCantidad(solicitud.tipoCantidad);
            setSelectedMaterial({
                value: solicitud.material.idMaterial,
                label: solicitud.material.numero
            });
        }
    }, [solicitud, Floor]);

    const handleUpdate = async () => {
        const updatedSolicitud = {
            cantidad: parseInt(cantidad),
            tipoCantidad,
            idMaterial: selectedMaterial.value // Usar el ID del material seleccionado
        };
    
        try {
            // Actualiza la solicitud
            await axios.put(`http://172.30.189.112:5000/solicitudes/${solicitud.idSolicitud}`, updatedSolicitud);
            // Actualiza el estado en el front-end
            onUpdate({ ...solicitud, ...updatedSolicitud });
            fetchDataSolicitudes();
            onClose();
        } catch (error) {
            console.error("Error updating solicitud:", error.response ? error.response.data : error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Solicitud</h2>
                <label>
                    Cantidad:
                    <input
                        type="number"
                        placeholder="Cantidad"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        min="1"
                        required
                    />
                </label>
                <label>
                    Tipo de Cantidad:
                    <select
                        value={tipoCantidad}
                        onChange={(e) => setTipoCantidad(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un tipo</option>
                        <option value="pieza">pieza</option>
                        <option value="bolsa">bolsa</option>
                        <option value="caja">caja</option>
                    </select>
                </label>
                <label>
                    Material:
                    <Select
                        isClearable
                        options={dataMaterial}
                        value={selectedMaterial}
                        onChange={setSelectedMaterial}
                        placeholder="Seleccione o busque un material"
                        isSearchable
                        required
                    />
                </label>
                <button onClick={handleUpdate}>Actualizar</button>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default EditSolicitudModal;