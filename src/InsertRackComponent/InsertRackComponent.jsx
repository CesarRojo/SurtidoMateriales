import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InsertRack.css';
import EditRackModal from './EditRackModal';

function InsertRackComponent() {
    const [dataRack, setDataRack] = useState([]);
    const [nombre, setNombre] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRack, setSelectedRack] = useState(null);
    
    const fetchRacks = async () => {
        try {
            const response = await axios.get(`http://172.30.189.118:5000/rack`);
            setDataRack(response.data);
        } catch (error) {
            console.error("Error fetching racks");
        }
    }

    const handleAddRack = async (e) => {
        e.preventDefault();
    
        // Verificar si el rack ya existe
        const rackExists = dataRack.some(rack => rack.nombre.toLowerCase() === nombre.toLowerCase());
    
        if (rackExists) {
            toast.error("El rack ya existe.");
            return; // Salir de la función si el rack ya existe
        }
    
        try {
            const newRack = { nombre };
            await axios.post(`http://172.30.189.118:5000/rack`, newRack);
            fetchRacks();
            setNombre('');
    
            toast.success("Rack insertado correctamente!");
        } catch (error) {
            console.error("Error inserting rack");
            toast.error("Error al insertar rack!");
        }
    }

    const handleRowClick = (rack) => {
        setSelectedRack(rack);
        setIsModalOpen(true);
    };

    const handleUpdateRack = (updatedRack) => {
        setDataRack(dataRack.map(rack => 
            rack.idRack === updatedRack.idRack ? updatedRack : rack
        ));
        toast.success("Rack actualizado correctamente!");
    };

    const handleDeleteRack = (idRack) => {
        setDataRack(dataRack.filter(rack => rack.idRack !== idRack));
        toast.success("Rack eliminado correctamente!");
    };

    useEffect(() => {
        fetchRacks();
    }, [])

    return (
        <div className="rack-container">
            <h2>Agregar nuevo rack</h2>
            <form onSubmit={handleAddRack}>
                <input 
                    type="text" 
                    placeholder="Nombre rack"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <button type="submit">Agregar rack</button>
            </form>
            <table className="material-table">
                <thead className="material-tablehd">
                    <tr>
                        <th>ID Rack</th>
                        <th>Nombre Rack</th>
                    </tr>
                </thead>
                <tbody className="material-tablebd">
                    {dataRack.map((rack, index) => (
                        <tr key={index} onClick={() => handleRowClick(rack)}>
                            <td>{rack.idRack}</td>
                            <td>{rack.nombre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
            <EditRackModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                rack={selectedRack} 
                onUpdate={handleUpdateRack} 
                onDelete={handleDeleteRack}
                fetchRacks={fetchRacks}
            />
        </div>
    );
}

export default InsertRackComponent;