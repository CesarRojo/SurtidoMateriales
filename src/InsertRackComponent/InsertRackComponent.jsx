import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InsertRack.css'

function InsertRackComponent() {
    const [dataRack, setDataRack] = useState([]);
    const [nombre, setNombre] = useState('');
    
    const fetchRacks = async () => {
        try {
            const response = await axios.get(`http://172.30.190.47:5000/rack`);
            console.log(response.data);
            setDataRack(response.data);
        } catch (error) {
            console.error("Error fetching racks");
        }
    }

    const handleAddRack = async(e) => {
        e.preventDefault();

        try {
            const newRack = { nombre };
            await axios.post(`http://172.30.190.47:5000/rack`, newRack);
            fetchRacks();
            setNombre('');

            toast.success("Rack insertado correctamente!");
        } catch (error) {
            console.error("Error inserting rack");
            toast.error("Error al insertar rack!");
        }
    }

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
                        <tr key={index}>
                            <td>{rack.idRack}</td>
                            <td>{rack.nombre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
}

export default InsertRackComponent;