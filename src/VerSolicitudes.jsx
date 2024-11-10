import axios from "axios";
import { useEffect, useState } from "react"

function VerSolicitudes() {
  const [dataLinea, setDataLinea] = useState(null);

  useEffect(() => {
    const fetchDataLines = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/lines/`);
        console.log("Datos RAAAAH", response.data);
        setDataLinea(response.data);
      } catch (error) {
        console.log("<<Error fetching data>>", error);
      }
    };

    fetchDataLines();
  }, [])


  return (
    <>
      <p>{dataLinea ? JSON.stringify(dataLinea) : "Cargando..."}</p>
    </>
  )
}

export default VerSolicitudes
