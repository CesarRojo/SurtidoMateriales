import axios from "axios";
import { useState, useEffect } from "react";
import './FormPeticiones.css'

function FormPeticionesComponent({ IdLinea, onFormSubmit }) {
    const [dataArea, setDataArea] = useState([]);
    const [dataMaterial, setDataMaterial] = useState([]);
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Para manejar mensajes de error

    useEffect(() => {
        const fetchDataArea = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/areas/`);
                console.log("Datos Areas RAAAAH", response.data);
                setDataArea(response.data);
            } catch (error) {
                console.log("<<Error fetching data>>", error);
            }
        };

        const fetchDataMaterial = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/material/`);
                console.log("Datos Materiales RAAAAH", response.data);
                setDataMaterial(response.data);
            } catch (error) {
                console.log("<<Error fetching data>>", error);
            }
        };

        fetchDataArea();
        fetchDataMaterial();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validación de campos
        if (!selectedArea || !selectedMaterial || !selectedType || !quantity) {
            setErrorMessage("Por favor, complete todos los campos.");
            return;
        }

        setErrorMessage(""); // Limpiar mensaje de error si todos los campos son válidos
        
        const currentDate = new Date().toISOString(); // Obtiene la fecha actual en formato ISO
        const newRequest = {
            idArea: parseInt(selectedArea),
            cantidad: parseInt(quantity),
            estado: "Pendiente",
            fechaSolicitud: currentDate,
            idMaterial: parseInt(selectedMaterial),
            tipoCantidad: selectedType,
            idLinea: IdLinea,
        };

        try {
            const response = await axios.post(`http://localhost:3000/solicitudes/`, newRequest);
            console.log("Solicitud enviada con éxito:", response.data);
            // Limpiar el formulario
            setSelectedArea("");
            setSelectedMaterial("");
            setSelectedType("");
            setQuantity("");

            // Llama a la función para indicar que el formulario se ha enviado
            onFormSubmit(); // Esto actualizará el estado en PedirMaterial

        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="area">Área:</label>
                    <select
                        id="area"
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                    >
                        <option value="">Seleccione un área</option>
                        {dataArea.map((area) => (
                            <option key={area.idArea} value={area.idArea}>
                                {area.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="material">Material:</label>
                    <select
                        id="material"
                        value={selectedMaterial}
                        onChange={(e) => setSelectedMaterial(e.target.value)}
                    >
                        <option value="">Seleccione un material</option>
                        {dataMaterial.map((material) => (
                            <option key={material.idMaterial} value={material.idMaterial}>
                                {material.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="type">Tipo:</label>
                    <select
                        id="type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="">Seleccione un tipo</option>
                        <option value="pieza">Pieza</option>
                        <option value="bolsa">Bolsa</option>
                        <option value="caja">Caja</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="quantity">Cantidad:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Mostrar mensaje de error */}

                <button type="submit">Enviar</button>
            </form>
            <button className="recargaBtn" onClick={onFormSubmit}>Recargar solicitudes</button>
        </>
    );
}

export default FormPeticionesComponent;