import axios from "axios";
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import ErrorComponent from "./errorComponent/errorComponent";
import FormPeticionesComponent from "./FormPeticionesComponent/FormPeticionesComponent";
import VerSolLineaComponent from "./VerSolLineaComponent/VerSolLineaComponent";

function PedirMaterial() {
  const [dataLinea, setDataLinea] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [nombreLinea, setNombreLinea] = useState(null);
  const [idLinea, setIdLinea] = useState(null);
  const [shouldFetchSolicitudes, setShouldFetchSolicitudes] = useState(false); // Estado para controlar la actualización
  const { IdentLinea } = useParams();
  
  useEffect(() => {
    const fetchDataLinea = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/lines/`);
        console.log("Datos RAAAAH", response.data);
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
        <h1>Línea {nombreLinea}</h1>
        {isValid ? (
          <>
            <FormPeticionesComponent 
              IdLinea={idLinea}
              onFormSubmit={handleFormSubmit} // Pasa la función al componente hijo (este componente hijo tiene el botón para enviar)
            />
            <VerSolLineaComponent 
              IdentLinea={IdentLinea}
              shouldFetch={shouldFetchSolicitudes} // Pasa el estado al componente hijo (este componente hijo tiene los datos que se deben actualizar)
            />
          </>
        ) : (
          <ErrorComponent />
        )}
      </>
    )
  }
  
export default PedirMaterial