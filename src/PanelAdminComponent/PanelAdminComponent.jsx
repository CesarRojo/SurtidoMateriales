import { useState } from "react";
import './PanelAdministracion.css'; // Asegúrate de tener el archivo CSS correspondiente

// Importa los componentes que deseas mostrar
import CodigosBarra from "../CodigosBarraComponent/CodigosBarra";
import InsertMaterComponent from "../InsertMaterComponent/InsertMaterComponent";
import InsertLineasComponent from "../InsertLineasComponent/InsertLineasComponent";
import InsertRackComponent from "../InsertRackComponent/InsertRackComponent";
import CodigosQR from "../CodigoQRComponent/CodigosQR";
import AdmSolicitudes from "../AdmSolicitudesComponent/AdmSolicitudesComponent";
import InsertCircuitosComponent from "../InsertCircuitoComponent/InsertCircuitoComponent";

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
      case 'insertar-circuitos':
        return <InsertCircuitosComponent />;
      case 'insertar-lineas':
        return <InsertLineasComponent />;
      case 'insertar-racks':
        return <InsertRackComponent />;
      case 'codigos-qr':
        return <CodigosQR />;
      case 'adm-solicitudes':
        return <AdmSolicitudes />;
      default:
        return null; // No renderiza nada si no hay componente activo
    }
  };

  return (
    <div className="panel-container">
      <header className="panel-header">
        <img src="logo.png" alt="logoatr" className="logoATR-panadm" />
        <div className="panel-title-container">
          <h1 className="panel-title">Panel de Administración</h1>
        </div>
        <div className="panel-cards">
          <div
            className="panel-card"
            onClick={() => handleCardClick('codigos-barra')}
          >
            <h2>Códigos de Barra</h2>
          </div>
          <div
            className="panel-card"
            onClick={() => handleCardClick('codigos-qr')}
          >
            <h2>Codigos QR</h2>
          </div>
          <div
            className="panel-card"
            onClick={() => handleCardClick('insertar-materiales')}
          >
            <h2>Insertar Materiales</h2>
          </div>
          <div
            className="panel-card"
            onClick={() => handleCardClick('insertar-circuitos')}
          >
            <h2>Insertar Circuitos</h2>
          </div>
          <div
            className="panel-card"
            onClick={() => handleCardClick('insertar-lineas')}
          >
            <h2>Insertar Líneas</h2>
          </div>
          <div
            className="panel-card"
            onClick={() => handleCardClick('insertar-racks')}
          >
            <h2>Insertar Rack</h2>
          </div>
          <div
            className="panel-card"
            onClick={() => handleCardClick('adm-solicitudes')}
          >
            <h2>Solicitudes</h2>
          </div>
        </div>
      </header>
      <div className="componente-container">
        {renderComponente()} {/* Renderiza el componente activo aquí */}
      </div>
    </div>
  );
}

export default PanelAdministracion;