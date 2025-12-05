import axios from "axios";
import { useState, useEffect } from "react";
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalTablet from "../ModalTablet/ModalTablet";
import '../FormPeticionesComponent/FormPeticiones.css'

function FormPeticionesCircuito({ IdLinea, onFormSubmit, Floor }) {
  const [dataCircuito, setDataCircuito] = useState([]);
  const [selectedCircuito, setSelectedCircuito] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDataCircuito = async () => {
      try {
        const response = await axios.get(` http://172.30.189.118:5000/circuito/floor`,  {
          params: {
            floor: Floor,
          }
        });
        const formattedCircuitos = response.data.map(circuito => ({
          value: circuito.idCircuito,
          label: circuito.nombre
        }));
        setDataCircuito(formattedCircuitos);
      } catch (error) {
        console.error("<<Error fetching data>>", error);
      }
    };

    fetchDataCircuito();
  }, [Floor]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCircuito) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }

    setErrorMessage("");

    const newRequest = {
      estado: "Pendiente",
      idCircuito: parseInt(selectedCircuito.value),
      idLinea: IdLinea,
    };

    try {
      await axios.post(`http://172.30.189.118:5000/solicitudCircuito/`,  newRequest);
      toast.success("Solicitud de circuito enviada con éxito!");
      setSelectedCircuito(null);
      onFormSubmit();
    } catch (error) {
      console.error("Error al enviar la solicitud de circuito:", error);
      toast.error("Error al enviar la solicitud. Intente nuevamente.");
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCircuitoSelect = (circuito) => {
    const selected = dataCircuito.find(item => item.value === circuito);
    setSelectedCircuito(selected);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="circuito">Circuito:</label>
          <Select
            id="circuito"
            isClearable
            options={dataCircuito}
            value={selectedCircuito}
            onChange={setSelectedCircuito}
            placeholder="Seleccione o busque un circuito"
            isSearchable
            required
          />
        </div>

        <button type="submit" className="enviarFormPet">Enviar</button>
      </form>
      <button className="recargaBtn" onClick={onFormSubmit}>Actualizar</button>
      <button className="openModalBtnFormPet" onClick={handleOpenModal}>Escaner</button>
      <img src="/logo.png" alt="logoATR" className="logoATR"/>
      <ModalTablet 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onMaterialSelect={handleCircuitoSelect}
        IdLinea={IdLinea}
        Floor={Floor}
        onFormSubmit={onFormSubmit}
      />
      <ToastContainer />
    </>
  );
}

export default FormPeticionesCircuito;