import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InsertMater.css';
import EditMaterialModal from './EditMaterialModal';
import Select from 'react-select'; // Importar Select

function InsertMaterComponent() {
    const [dataMater, setDataMater] = useState([]);
    const [dataLines, setDataLines] = useState([]);
    const [dataRacks, setDataRacks] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState("");
    const [numero, setNumero] = useState("");
    const [nombre, setNombre] = useState("");
    const [filterFloor, setFilterFloor] = useState("");
    const [selectedRackId, setSelectedRackId] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState(null); // Para el select de material
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredMaterials, setFilteredMaterials] = useState([]); // State for filtered materials

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://172.30.190.47:5000/material`);
            setDataMater(response.data);
            setFilteredMaterials(response.data); // Inicializar los materiales filtrados
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
        } else {
            setSelectedFloor("");
        }
    };

    const handleInsert = async (e) => {
        e.preventDefault();
        
        // Verificar si el material ya existe
        const materialExists = dataMater.some(material => 
            material.numero === numero && material.floor === selectedFloor
        );
    
        if (materialExists) {
            toast.error("El material ya existe en este FLOOR.");
            return; // Salir de la función si el material ya existe
        }
    
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
            toast.success("Material insertado correctamente!");
        } catch (error) {
            console.error("Error inserting material");
            toast.error("Error al insertar el material");
        }
    };

    const handleRowClick = (material) => {
        setSelectedMaterial(material);
        setIsModalOpen(true);
    };

    const handleUpdateMaterial = (updatedMaterial) => {
        setDataMater(dataMater.map(material => 
            material.idMaterial === updatedMaterial.idMaterial ? updatedMaterial : material
        ));
        toast.success("Material actualizado correctamente!");
    };

    const handleDeleteMaterial = (idMaterial) => {
        setDataMater(dataMater.filter(material => material.idMaterial !== idMaterial));
        toast.success("Material eliminado correctamente!");
    };

    const handleMaterialSelectChange = (selectedOption) => {
        setSelectedMaterial(selectedOption);
        if (selectedOption) {
            setFilteredMaterials(dataMater.filter(material => material.numero === selectedOption.label ));
        } else {
            setFilteredMaterials(dataMater);
        }
    };

    const filteredMaterialsToDisplay = filterFloor ? filteredMaterials.filter(material => material.floor === filterFloor) : filteredMaterials;

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
                 <h2>Filtros busqueda</h2>
                  <div className="filtros-2">
                    <Select
                        id="material-select"
                        isClearable
                        options={dataMater.map(material => ({ value: material.idMaterial, label: material.numero }))}
                        value={selectedMaterial}
                        onChange={handleMaterialSelectChange}
                        placeholder="Seleccione o busque un material"
                        isSearchable
                    />
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
            </div>

            <table className="material-table">
                <thead className="material-tablehd">
                    <tr>
                        <th>ID Material</th>
                        <th>Número</th>
                        <th>Nombre</th>
                        <th>Floor</th>
                        <th>Rack</th>
                    </tr>
                </thead>
                <tbody className="material-tablebd">
                    {filteredMaterialsToDisplay.map((material, index) => (
                        <tr key={index} onClick={() => handleRowClick(material)}>
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
            <EditMaterialModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                material={selectedMaterial} 
                onUpdate={handleUpdateMaterial} 
                onDelete={handleDeleteMaterial} 
                fetchData={fetchData} 
            />
        </div>
    );
}

export default InsertMaterComponent;