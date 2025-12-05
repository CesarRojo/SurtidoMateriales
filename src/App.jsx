import PedirMaterial from "./PedirMaterial"
import PedirCircuito from "./PedirCircuito";
import VerSolicitudes from "./VerSolicitudes"
import VerSolicitudesCircuito from "./VerSolicitudesCircuitos"
import MenuLineasComponent from "./MenuLineasComponent/MenuLineasComponent";
import MenuPrincipal from './MenuPrincipal/MenuPrincipal'
import PanelAdminComponent from "./PanelAdminComponent/PanelAdminComponent";
import MenuLineasCircuitos from "./MenuLineasCircuitos/MenuLineasCircuitos";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/:IdentLinea" element={<PedirMaterial />} />
        <Route path="/circuitos/:IdentLinea" element={<PedirCircuito />} />
        <Route path="/solicitudes" element={<MenuLineasComponent />} />
        <Route path="/solicitudesCircuito" element={<MenuLineasCircuitos />} />
        <Route path="/solicitudes/:IdentLinea" element={<VerSolicitudes />} />
        <Route path="/solicitudesCircuito/:IdentLinea" element={<VerSolicitudesCircuito />} />
        <Route path="/admin" element={<PanelAdminComponent />} />
      </Routes>
    </Router>
  );
}

export default App