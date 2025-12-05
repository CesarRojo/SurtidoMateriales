import axios from "axios";
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import ErrorComponent from "./errorComponent/errorComponent";
import FormPeticionesCircuito from "./FormPeticionesCircuito/FormPeticionesCircuito";
import VerSolLineaCircuito from "./VerSolLineaCircuito/VerSolLineaCircuito";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PedirMaterial.css'

function PedirCircuito() {
  const [dataLinea, setDataLinea] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [nombreLinea, setNombreLinea] = useState(null);
  const [floorLinea, setFloorLinea] = useState(null);
  const [idLinea, setIdLinea] = useState(null);
  const [shouldFetchSolicitudes, setShouldFetchSolicitudes] = useState(false);
  const { IdentLinea } = useParams();

  useEffect(() => {
    const fetchDataLinea = async () => {
      try {
        const response = await axios.get(`http://172.30.189.118:5000/lines/`);
        setDataLinea(response.data);
      } catch (error) {
        console.error("<<Error fetching data>>", error);
      }
    };

    fetchDataLinea();
  }, []);

  useEffect(() => {
    if (dataLinea) {
      const identificadores = dataLinea.map(linea => linea.idLinea);
      const isIdentLineaValid = identificadores.includes(parseInt(IdentLinea));
      setIsValid(isIdentLineaValid);

      if (isIdentLineaValid) {
        const lineaEncontrada = dataLinea.find(linea => linea.idLinea === parseInt(IdentLinea));
        setNombreLinea(lineaEncontrada ? lineaEncontrada.nombre : null);
        setFloorLinea(lineaEncontrada ? lineaEncontrada.Floor : null);
        setIdLinea(lineaEncontrada ? lineaEncontrada.idLinea : null);
      } else {
        setNombreLinea(null);
      }
    }
  }, [dataLinea, IdentLinea]);

  const handleFormSubmit = () => {
    setShouldFetchSolicitudes(prev => !prev);
  };

  return (
    <>
      <ToastContainer />
      {isValid ? (
        <>
          <div className="content">
            <div className="form-container">
              <h1>Línea {nombreLinea}</h1>
              <FormPeticionesCircuito 
                IdLinea={idLinea}
                Floor={floorLinea}
                onFormSubmit={handleFormSubmit} 
              />
            </div>
            <div className="solicitudes-contenedor">
              <VerSolLineaCircuito 
                IdentLinea={IdentLinea}
                shouldFetch={shouldFetchSolicitudes} 
                Floor={floorLinea}
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

export default PedirCircuito;