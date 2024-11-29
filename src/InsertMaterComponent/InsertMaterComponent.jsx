import axios from "axios";
import { useState, useEffect } from "react";
import './InsertMater.css';

function InsertMaterComponent() {
    const [dataMater, setDataMater] = useState([]);
    const [numero, setNumero] = useState("");
    const [nombre, setNombre] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://172.30.190.47:5000/material`);
                setDataMater(response.data);
            } catch (error) {
                console.error("Error fetching materials");
            }
        }
        fetchData();
    }, []);

    const handleInsert = async (e) => {
        e.preventDefault();
        try {
            const newMaterial = { numero, nombre };
            await axios.post(`http://172.30.190.47:5000/material`, newMaterial);
            setDataMater([...dataMater, newMaterial]); // Update the state with the new material
            setNumero(""); // Clear the input
            setNombre(""); // Clear the input
        } catch (error) {
            console.error("Error inserting material");
        }
    };

    return (
        <div>
            <h2>Insertar Nuevo Material</h2>
            <form onSubmit={handleInsert} className="insert-form">
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
                <button type="submit">Agregar Material</button>
            </form>

            <table className="material-table">
                <thead className="material-tablehd">
                    <tr>
                        <th>ID Material</th>
                        <th>Número</th>
                        <th>Nombre</th>
                    </tr>
                </thead>
                <tbody className="material-tablebd">
                    {dataMater.map((material) => (
                        <tr key={material.idMaterial}>
                            <td>{material.idMaterial}</td>
                            <td>{material.numero}</td>
                            <td>{material.nombre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InsertMaterComponent;