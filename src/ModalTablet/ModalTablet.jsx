import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Modal.css';

function ModalTablet({ isOpen, onClose, onMaterialSelect, IdLinea, Floor, onFormSubmit }) {
    const [scannedData, setScannedData] = useState(null);
    const [materialId, setMaterialId] = useState(null);
    const [selectedType, setSelectedType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const scannerRef = useRef(null);
    const html5QrCodeScannerRef = useRef(null); // Referencia para el escáner

    useEffect(() => {
        if (isOpen && scannerRef.current) {
            startScanner(); // Iniciar el escáner al abrir el modal
        } else {
            clearScannedData();
        }
    }, [isOpen]);

    const startScanner = () => {
        const config = {
            fps: 10,
            qrbox: 250,
            experimentalFeatures: {
                useBarCodeDetectorIfSupported: true
            },
            facingMode: { exact: "environment" } // Configuración para usar la cámara trasera
        };

        html5QrCodeScannerRef.current = new Html5QrcodeScanner(
            "reader",
            config,
            /* verbose= */ false
        );

        html5QrCodeScannerRef.current.clear();
        html5QrCodeScannerRef.current.render(
            (decodedText) => {
                setScannedData(decodedText);
                fetchMaterialId(decodedText);
                html5QrCodeScannerRef.current.clear();
            },
            (error) => {
                console.error(error);
            }
        );
    };

    const clearScannedData = () => {
        setScannedData(null);
        setMaterialId(null);
        setSelectedType("");
        setQuantity("");
        setErrorMessage("");
        if (html5QrCodeScannerRef.current) {
            html5QrCodeScannerRef.current.clear(); // Limpiar el escáner
        }
    };

    const fetchMaterialId = async (materialNumber) => {
        try {
            const response = await axios.get(`http://172.30.189.118:5000/material/floor2`, {
                params: {
                    floor: Floor, //Esto para que aparezcan los materiales correspondientes de cada FLOOR
                    numero: materialNumber,
                }
            });
            setMaterialId(response.data.idMaterial);
        } catch (error) {
            console.error("<<Error fetching data>>", error);
        }
    };

    const getTurno = () => {
        const currentHour = new Date().getHours();
        const currentMinutes = new Date().getMinutes();
    
        if (currentHour === 16 && currentMinutes >= 0 && currentMinutes < 30) {
          return 'A'; // Incluye hasta las 16:29
        } else if (currentHour >= 7 && currentHour < 16) {
          return 'A'; // Desde las 7:00 AM hasta las 3:59 PM
        } else if (currentHour === 16 && currentMinutes >= 31) {
          return 'B'; // Desde las 4:31 PM (16:31) en adelante
        } else if (currentHour >= 17 || (currentHour < 2)) {
          return 'B'; // Desde las 5:00 PM hasta la 1:30 AM
        } else {
          return 'A'; // Cualquier otro caso (por si acaso)
        }
      };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!materialId || !selectedType || !quantity) {
            setErrorMessage("Por favor, complete todos los campos o escanee un material correcto.");
            return;
        }

        setErrorMessage("");

        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const newRequest = {
            cantidad: parseInt(quantity),
            estado: "Pendiente",
            // fechaSolicitud: formattedDate,
            idMaterial: materialId,
            tipoCantidad: selectedType,
            idLinea: IdLinea,
            // Turno: getTurno()
        };

        try {
            const response = await axios.post(`http://172.30.189.118:5000/solicitudes/`, newRequest);
            toast.success("Solicitud enviada con éxito!");
            setSelectedType("");
            setQuantity("");
            onFormSubmit();
            onClose();
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            toast.error("Error al enviar la solicitud. Intente nuevamente.");
        }
    };

    const handleRescan = () => {
        clearScannedData(); // Limpiar los datos escaneados
        startScanner(); // Reiniciar el escáner
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <div id="reader" ref={scannerRef}></div>
                {scannedData && <p className="scanned-data">Número del material escaneado: {scannedData}</p>}
                {scannedData && (
                    <button className="button rescan" onClick={handleRescan}>Reescanear</button>
                )}
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="type" className="form-label">Tipo:</label>
                        <select
                            id="type"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            required
                            className="form-select"
                        >
                            <option value="">Seleccione un tipo</option>
                            <option value="pieza">Pieza</option>
                            <option value="bolsa">Bolsa</option>
                            <option value="caja">Caja</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity" className="form-label">Cantidad:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            required
                            className="form-input"
                        />
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button type="submit" className="button submit">Enviar</button>
                </form>
                <button className="button close" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}

export default ModalTablet;