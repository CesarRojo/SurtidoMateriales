import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InsertMater.css';

function InsertMaterComponent() {
    const [dataMater, setDataMater] = useState([]);
    const [dataLines, setDataLines] = useState([]);
    const [dataRacks, setDataRacks] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState("");
    const [numero, setNumero] = useState("");
    const [nombre, setNombre] = useState("");
    const [filterFloor, setFilterFloor] = useState("");
    const [selectedRackId, setSelectedRackId] = useState("");

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://172.30.190.47:5000/material`);
            console.log(response.data);
            setDataMater(response.data);
        } catch (error) {
            console.error("Error fetching materials");
        }
    }

    const fetchLines = async () => {
        try {
            const response = await axios.get(`http://172.30.190.47:5000/lines`);
            const uniqueLineas = [];
            const seenFloors = new Set();

            response.data.forEach(linea => {
                if (!seenFloors.has(linea.Floor)) {
                    seenFloors.add(linea.Floor);
                    uniqueLineas.push(linea);
                }   
            });

            setDataLines(uniqueLineas);
        } catch (error) {
            console.error("Error fetching lines");
        }
    }

    const fetchRacks = async () => {
        try {
            const response = await axios.get(`http://172.30.190.47:5000/rack`);
            setDataRacks(response.data);
        } catch (error) {
            console.error("Error fetching racks");
        }
    }

    useEffect(() => {
        fetchData();
        fetchLines();
        fetchRacks();
    }, []);

    const handleLineaChange = (e) => {
        const selectedIdLinea = e.target.value;
        const selectedLine = dataLines.find(linea => linea.idLinea == selectedIdLinea);

        if (selectedLine) {
            setSelectedFloor(selectedLine.Floor);
            console.log("Floor seleccionado:", selectedLine.Floor);
        } else {
            setSelectedFloor("");
            console.error("No se encontró la línea con idLinea:", selectedIdLinea);
        }
    };

    const handleInsert = async (e) => {
        e.preventDefault();
        try {
            const newMaterial = { 
                numero, 
                nombre, 
                floor: selectedFloor, 
                idRack: parseInt(selectedRackId),
            };
            await axios.post(`http://172.30.190.47:5000/material`, newMaterial);
            setDataMater([...dataMater, newMaterial]);
            setNumero("");
            setNombre("");
            setSelectedFloor("");
            setSelectedRackId("");

            fetchData();

            // Muestra la alerta de éxito
            toast.success("Material insertado correctamente!");
        } catch (error) {
            console.error("Error inserting material");
            toast.error("Error al insertar el material");
        }
    };

    const filteredMaterials = filterFloor ? dataMater.filter(material => material.floor === filterFloor) : dataMater;

    return (
        <div className="mat-container">
            <h2>Insertar Nuevo Material</h2>
            <div className="form-filters-container">
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
                    <select
                        id="lineas"
                        value={selectedFloor ? dataLines.find(linea => linea.Floor === selectedFloor)?.idLinea : ""}
                        onChange={handleLineaChange}
                        required
                    >
                        <option value="">Seleccione un FLOOR</option>
                        {dataLines.map((linea) => (
                            <option key={linea.idLinea} value={linea.idLinea}>
                                {linea.Floor}
                            </option>
                        ))}
                    </select>

                    <select
                        id="racks"
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

                    <button type="submit">Agregar Material</button>
                </form>

                <div className="filtros">
                    <select
                        value={filterFloor}
                        onChange={(e) => setFilterFloor(e.target.value)}
                    >
                        <option value="">Seleccione un FLOOR para filtrar</option>
                        {dataLines.map((linea) => (
                            <option key={linea.idLinea} value={linea.Floor}>
                                {linea.Floor}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="material-table">
                <thead className="material-tablehd">
                    <tr>
                        <th>ID Material</th>
                        <th>Número</th>
                        <th>Nombre</th>
                        <th>Floor</th>
                        <th>ID Rack</th>
                    </tr>
                </thead>
                <tbody className="material-tablebd">
                    {filteredMaterials.map((material, index) => (
                        <tr key={index}>
                            <td>{material.idMaterial}</td>
                            <td>{material.numero}</td>
                            <td>{material.nombre}</td>
                            <td>{material.floor}</td>
                            <td>{material && material.rack ? material.rack.nombre : 'Sin Rack'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
}

export default InsertMaterComponent;