import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import './MenuPrincipal.css'; 

function MenuLineasPrincipal() {
  const [lineas, setLineas] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener líneas
        const lineasResponse = await axios.get(`http://localhost:3000/lines/`);
        setLineas(lineasResponse.data);
      } catch (error) {
        console.log("<<Error fetching data>>", error);
      }
    };

    fetchData();
  }, []);

  // Función para manejar el clic en la tarjeta
  const handleCardClick = (IdentificadorLinea) => {
    navigate(`/${IdentificadorLinea}`); // Esto llevará a la pantalla para ver la interfaz de cada linea
  };

  return (
    <div className="lineas-container">
      <h1>Seleccione su Línea</h1>
      <div className="lineas-cards">
        {lineas.map((linea) => {
          return (
            <div 
              className="linea-card" 
              key={linea.idLinea} 
              onClick={() => handleCardClick(linea.IdentificadorLinea)} // Agrega el manejador de clic
            >
              <h2>{linea.nombre}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MenuLineasPrincipal;