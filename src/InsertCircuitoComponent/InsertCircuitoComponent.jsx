import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../InsertLineasComponent/InsertLines.css';
import EditCircuitoModal from './EditCircuitoModal';

const InsertCircuitosComponent = () => {
    const [circuitos, setCircuitos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [floor, setFloor] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCircuito, setSelectedCircuito] = useState(null);

    const fetchCircuitos = async () => {
        try {
            const response = await axios.get('http://172.30.189.118:5000/circuito');
            setCircuitos(response.data);
        } catch (error) {
            console.error('Error fetching circuitos:', error);
        }
    };

    const handleAddCircuito = async (e) => {
        e.preventDefault();
        try {
            const newCircuito = { nombre, floor };
            await axios.post('http://172.30.189.118:5000/circuito', newCircuito);
            fetchCircuitos();
            setNombre('');
            setFloor('');
            toast.success("Circuito insertado correctamente!");
        } catch (error) {
            console.error('Error adding circuito:', error);
            toast.error("Error al insertar el circuito!");
        }
    };

    const handleRowClick = (circuito) => {
        setSelectedCircuito(circuito);
        setIsModalOpen(true);
    };

    const handleUpdateCircuito = (updatedCircuito) => {
        setCircuitos(circuitos.map(circuito =>
            circuito.idCircuito === updatedCircuito.idCircuito ? updatedCircuito : circuito
        ));
        toast.success("Circuito actualizado correctamente!");
    };

    const handleDeleteCircuito = (idCircuito) => {
        setCircuitos(circuitos.filter(circuito => circuito.idCircuito !== idCircuito));
        toast.success("Circuito eliminado correctamente!");
    };

    useEffect(() => {
        fetchCircuitos();
    }, []);

    return (
        <div className='lines-container'>
            <h2>Agregar Nuevo Circuito</h2>
            <form onSubmit={handleAddCircuito}>
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
                <br />
                <button type="submit">Agregar Circuito</button>
            </form>
            <table className="material-table">
                <thead className="material-tablehd">
                    <tr>
                        <th>ID Circuito</th>
                        <th>Nombre</th>
                        <th>FLOOR</th>
                    </tr>
                </thead>
                <tbody className="material-tablebd">
                    {circuitos.map((circuito, index) => (
                        <tr key={index} onClick={() => handleRowClick(circuito)}>
                            <td>{circuito.idCircuito}</td>
                            <td>{circuito.nombre}</td>
                            <td>{circuito.floor || ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
            <EditCircuitoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                line={selectedCircuito}
                onUpdate={handleUpdateCircuito}
                onDelete={handleDeleteCircuito}
                fetchLines={fetchCircuitos}
            />
        </div>
    );
};

export default InsertCircuitosComponent;