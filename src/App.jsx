import PedirMaterial from "./PedirMaterial"
import VerSolicitudes from "./VerSolicitudes"
import MenuLineasComponent from "./MenuLineasComponent/MenuLineasComponent";
import MenuPrincipal from './MenuPrincipal/MenuPrincipal'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/:IdentLinea" element={<PedirMaterial />} />
        <Route path="/solicitudes" element={<MenuLineasComponent />} />
        <Route path="/solicitudes/:IdentLinea" element={<VerSolicitudes />} />
      </Routes>
    </Router>
  );
}

export default App