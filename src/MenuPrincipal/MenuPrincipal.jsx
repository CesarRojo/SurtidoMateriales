import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import './MenuPrincipal.css'; 

function MenuLineasPrincipal() {
  const [lineas, setLineas] = useState([]);
  const [selectedOption, setSelectedOption] = useState("materiales");
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener líneas
        const lineasResponse = await axios.get(`http://172.30.189.118:5000/lines/`);
        setLineas(lineasResponse.data);
      } catch (error) {
        console.error("<<Error fetching data>>", error);
      }
    };

    fetchData();
  }, []);

  // Función para manejar el cambio en el select
  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Función para manejar el clic en la tarjeta
  const handleCardClick = (idLinea) => {
    if (selectedOption === "materiales") {
      navigate(`/${idLinea}`);
    } else if (selectedOption === "circuitos") {
      navigate(`/circuitos/${idLinea}`);
    } else {
      navigate(`/${idLinea}`);
    }
  };

  return (
    <div className="lineas-container">
      <div className="sel-titl">
        <select value={selectedOption} onChange={handleSelectChange}>
          <option value="materiales">Materiales</option>
          <option value="circuitos">Circuitos</option>
        </select>

        <h1>Seleccione su línea</h1>
      </div>

      <div className="lineas-cards">
        {lineas.map((linea) => {
          return (
            <div 
              className="linea-card" 
              key={linea.idLinea} 
              onClick={() => handleCardClick(linea.idLinea)} 
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