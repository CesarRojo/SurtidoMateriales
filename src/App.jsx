import PedirMaterial from "./PedirMaterial"
import VerSolicitudes from "./VerSolicitudes"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/:IdentLinea" element={<PedirMaterial />} />
        <Route path="/solicitudes" element={<VerSolicitudes />} />
      </Routes>
    </Router>
  );
}

export default App