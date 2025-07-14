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
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [excelErrorModalOpen, setExcelErrorModalOpen] = useState(false);
    const [excelErrorMsg, setExcelErrorMsg] = useState("");
    const [excelErrorList, setExcelErrorList] = useState([]);

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

    //Excel
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleUpload = async () => {
        if (!file) {
            alert("Selecciona un archivo primero");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(`http://172.30.190.47:5000/material/bulk-update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert(res.data.message || "Actualizacion exitosa");
        } catch (error) {
            console.error(error);
            setExcelErrorMsg(error.response?.data?.message || "Error al subir archivo");
            setExcelErrorList(error.response?.data?.errores || []);
            setExcelErrorModalOpen(true);
        }
    }
    //Fin excel

    return (
        <div className="mat-container">
            <div className="form-filters-container">
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

                        <button type="submit" className="addMatBtn">Agregar Material</button>
                    </form>
                </div>

                <div className="excel-upload-section">
                    <h2>Actualizar Rack de Materiales por Excel</h2>
                    <div className="excel-upload-controls">
                        <input
                            type="file"
                            accept=".csv, .xlsx"
                            id="excel-upload-input"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="excel-upload-input" className="excel-upload-label">
                            Seleccionar archivo
                        </label>
                        <span className="excel-upload-filename">
                            {file ? file.name : "Ningún archivo seleccionado"}
                        </span>
                        <button className="excel-upload-btn" onClick={handleUpload}>
                            Subir y Actualizar
                        </button>
                    </div>
                    <p className="excel-upload-hint">
                        El archivo debe tener las columnas <b>nombre</b> y <b>nombreRack</b>.
                    </p>
                </div>

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

            

            {/* Modal de errores de Excel */}
            {excelErrorModalOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <div className="custom-modal-header">
                            <span className="custom-modal-title">Errores al procesar el archivo</span>
                            <button className="custom-modal-close" onClick={() => setExcelErrorModalOpen(false)}>&times;</button>
                        </div>
                        <div className="custom-modal-body">
                            <p className="custom-modal-message">{excelErrorMsg}</p>
                            {excelErrorList.length > 0 && (
                                <ul className="custom-modal-error-list">
                                    {excelErrorList.map((err, idx) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="custom-modal-footer">
                            <button className="excel-upload-btn" onClick={() => setExcelErrorModalOpen(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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