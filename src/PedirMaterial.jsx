import axios from "axios";
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import ErrorComponent from "./errorComponent/errorComponent";
import FormPeticionesComponent from "./FormPeticionesComponent/FormPeticionesComponent";
import VerSolLineaComponent from "./VerSolLineaComponent/VerSolLineaComponent";
import './PedirMaterial.css'

function PedirMaterial() {
  const [dataLinea, setDataLinea] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [nombreLinea, setNombreLinea] = useState(null);
  const [floorLinea, setFloorLinea] = useState(null);
  const [idLinea, setIdLinea] = useState(null);
  const [shouldFetchSolicitudes, setShouldFetchSolicitudes] = useState(false); // Estado para controlar la actualización
  const { IdentLinea } = useParams();
  
  useEffect(() => {
    const fetchDataLinea = async () => {
      try {
        const response = await axios.get(`http://172.30.190.47:5000/lines/`);
        setDataLinea(response.data);
      } catch (error) {
        console.log("<<Error fetching data>>", error);
      }
    };
  
    fetchDataLinea();
  }, []);
  
  useEffect(() => {
    if (dataLinea) {
      // Extraer los IdentificadoresLinea de dataLinea
      const identificadores = dataLinea.map(linea => linea.IdentificadorLinea);
      // Comprobar si IdentLinea está en el array de identificadores
      const isIdentLineaValid = identificadores.includes(parseInt(IdentLinea));
      setIsValid(isIdentLineaValid);

      // Si es válido, obtener el nombre correspondiente
      if (isIdentLineaValid) {
        const lineaEncontrada = dataLinea.find(linea => linea.IdentificadorLinea === parseInt(IdentLinea));
        setNombreLinea(lineaEncontrada ? lineaEncontrada.nombre : null);
        setFloorLinea(lineaEncontrada ? lineaEncontrada.Floor : null);
        setIdLinea(lineaEncontrada ? lineaEncontrada.idLinea : null);
      } else {
        setNombreLinea(null);
      }
    }
  }, [dataLinea, IdentLinea]);
  
  const handleFormSubmit = () => {
    // Cambia el estado para indicar que se deben volver a cargar las solicitudes
    setShouldFetchSolicitudes(prev => !prev);
  };

  return (
      <>
        {isValid ? (
          <>
            <div className="content">
                <div className="form-container">
                    <h1>Línea {nombreLinea}</h1>
                    <FormPeticionesComponent 
                        IdLinea={idLinea}
                        Floor={floorLinea}
                        onFormSubmit={handleFormSubmit} 
                    />
                </div>
                <div className="solicitudes-contenedor">
                    <VerSolLineaComponent 
                        IdentLinea={IdentLinea}
                        shouldFetch={shouldFetchSolicitudes} 
                    />
                </div>
            </div>
          </>
        ) : (
          <ErrorComponent />
        )}
      </>
    )
  }
  
export default PedirMaterial