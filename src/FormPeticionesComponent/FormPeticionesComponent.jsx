import axios from "axios";
import { useState, useEffect } from "react";
import Select from 'react-select';
import './FormPeticiones.css'

function FormPeticionesComponent({ IdLinea, onFormSubmit }) {
    const [dataMaterial, setDataMaterial] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedType, setSelectedType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

        const fetchDataMaterial = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/material/`);
                console.log("Datos Materiales RAAAAH", response.data);
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
    }, []);

    const getTurno = () => {
        const currentHour = new Date().getHours();
        const currentMinutes = new Date().getMinutes();
        
        // Si la hora es entre 7:00 AM (7) y 4:30 PM (16:30)
        if (currentHour === 16 && currentMinutes >= 0 && currentMinutes < 30) {
            return 'A'; // Incluye hasta las 16:29
        } else if (currentHour >= 7 && currentHour < 17) {
            return 'A'; // Desde las 7:00 AM hasta las 4:29 PM
        } else if (currentHour === 17 && currentMinutes >= 30) {
            return 'B'; // Desde las 5:30 PM (17:30) en adelante
        } else if (currentHour > 17 || (currentHour < 2)) {
            return 'B'; // Desde las 5:30 PM hasta la 1:30 AM
        } else {
            return 'A'; // Cualquier otro caso (por si acaso)
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validación de campos
        if (!selectedMaterial || !selectedType || !quantity) {
            setErrorMessage("Por favor, complete todos los campos.");
            return;
        }

        setErrorMessage(""); // Limpiar mensaje de error si todos los campos son válidos
        
        const currentDate = new Date().toISOString(); // Obtiene la fecha actual en formato ISO
        const newRequest = {
            cantidad: parseInt(quantity),
            estado: "Pendiente",
            fechaSolicitud: currentDate,
            idMaterial: parseInt(selectedMaterial.value),
            tipoCantidad: selectedType,
            idLinea: IdLinea,
            Turno: getTurno() // Agregar el campo "turno"
        };

        try {
            const response = await axios.post(`http://localhost:3000/solicitudes/`, newRequest);
            console.log("Solicitud enviada con éxito:", response.data);
            // Limpiar el formulario
            setSelectedMaterial(null);
            setSelectedType("");
            setQuantity("");

            // Llama a la función para indicar que el formulario se ha enviado
            onFormSubmit();

        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="material">Material:</label>
                    <Select
                        id="material"
                        isClearable
                        options={dataMaterial}
                        value={selectedMaterial}
                        onChange={setSelectedMaterial}
                        placeholder="Seleccione o busque un material"
                        isSearchable // Habilita la búsqueda
                    />
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
                    < label htmlFor="quantity">Cantidad:</label>
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
            <button className="recargaBtn" onClick={onFormSubmit}>Actualizar</button>
            <img src="logo.png" alt="logoATR" />
        </>
    );
}

export default FormPeticionesComponent;