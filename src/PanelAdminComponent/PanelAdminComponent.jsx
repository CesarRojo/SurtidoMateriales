import { useState } from "react";
import './PanelAdministracion.css'; // Asegúrate de tener el archivo CSS correspondiente

// Importa los componentes que deseas mostrar
import CodigosBarra from "../CodigosBarraComponent/CodigosBarra";
import InsertMaterComponent from "../InsertMaterComponent/InsertMaterComponent";

function PanelAdministracion() {
  const [componenteActivo, setComponenteActivo] = useState(null);

  // Función para manejar el clic en la tarjeta
  const handleCardClick = (componente) => {
    setComponenteActivo(componente); // Cambia el componente activo
  };

  const renderComponente = () => {
    switch (componenteActivo) {
      case 'codigos-barra':
        return <CodigosBarra />;
      case 'insertar-materiales':
        return <InsertMaterComponent />;
      // case 'insertar-lineas':
      //   return <InsertarLineas />;
      default:
        return null; // No renderiza nada si no hay componente activo
    }
  };

  return (
    <div className="panel-container">
      <h1>Panel de Administración</h1>
      <div className="panel-cards">
        <div 
          className="panel-card" 
          onClick={() => handleCardClick('codigos-barra')}
        >
          <h2>Códigos de Barra</h2>
        </div>
        <div 
          className="panel-card" 
          onClick={() => handleCardClick('insertar-materiales')}
        >
          <h2>Insertar Materiales</h2>
        </div>
        <div 
          className="panel-card" 
          onClick={() => handleCardClick('insertar-lineas')}
        >
          <h2>Insertar Líneas</h2>
        </div>
      </div>
      <div className="componente-container">
        {renderComponente()} {/* Renderiza el componente activo aquí */}
      </div>
    </div>
  );
}

export default PanelAdministracion;