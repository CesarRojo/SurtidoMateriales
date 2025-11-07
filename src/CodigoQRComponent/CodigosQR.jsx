import React, { useEffect, useState } from "react";
import axios from "axios";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import './CodigosQR.css'

const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 30,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    height: 80, // Aumenta la altura de las filas de la tabla
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 2,
  },
  tableCell: {
    margin: "auto",
    textAlign: "center",
    fontSize: 10,
  },
  tableCellNombre: {
    margin: "auto",
    textAlign: "left",
    fontSize: 10,
  },
  qrCodeContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // padding: 5,
  },
  qrCodeImage: {
    width: 100,
    height: 100,
  },
});

const CodigosQR = () => {
  const [materiales, setMateriales] = useState([]);
  const [lineas, setLineas] = useState([]); // Estado para las líneas
  const [selectedLinea, setSelectedLinea] = useState(""); // Estado para la línea seleccionada
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLineas = async () => {
      try {
        const response = await axios.get('http://172.30.189.120:5000/lines');
        console.log(response.data);
        const uniqueLineas = [];
        const seenFloors = new Set(); // Usar un Set para rastrear los Floors que ya fueron vistos
  
        response.data.forEach(linea => {
          if (!seenFloors.has(linea.Floor)) { // Verifica si ya se ha visto este Floor
            seenFloors.add(linea.Floor); // Marca este Floor como visto
            uniqueLineas.push(linea); // Agrega la línea a la lista de únicas
          }
        });
  
        setLineas(uniqueLineas);
      } catch (err) {
        setError("Error al cargar las líneas");
        console.error(err);
      }
    };

    fetchLineas();
  }, []);

  useEffect(() => {
    const fetchMateriales = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://172.30.189.120:5000/material/floor', {
          params: {
            floor: selectedLinea,
          }
        });
        const materialesConQR = await Promise.all(response.data.map(async (material) => {
          const qrCodeDataUrl = await QRCode.toDataURL(material.numero);
          return { ...material, qrCodeDataUrl };
        }));
        setMateriales(materialesConQR);
      } catch (err) {
        setError("Error al cargar los materiales");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedLinea) {
      fetchMateriales();
    } else {
      setLoading(false); // Si no hay línea seleccionada, establece loading a false
    }
  }, [selectedLinea]);

  const handleLineaChange = (e) => {
    const selectedIdLinea = e.target.value;
    setSelectedLinea(selectedIdLinea);
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={{ padding: 10 }}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Cantidad</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Número</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Nombre</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Código QR</Text></View>
          </View>
          {materiales.map((material) => (
            <View style={styles.tableRow} key={material.idMaterial}>
              <View style={styles.tableCol}><Text style={styles.tableCell}></Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{material.numero}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellNombre}>{material.nombre}</Text></View>
              <View style={[styles.tableCol, styles.qrCodeContainer]}>
                <Image style={styles.qrCodeImage} src={material.qrCodeDataUrl} />
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  if (loading) {
    return <div>Cargando materiales...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="tabla-materiales-container">
      <label htmlFor="lineas">Selecciona una línea:</label>
      <div className="export-container">
        <select
          id="lineas"
          value={selectedLinea}
          onChange={handleLineaChange}
        >
          <option value="">Seleccione una línea</option>
          {lineas.map((linea) => (
            <option key={linea.idLinea} value={linea.Floor}>
              {linea.Floor}
            </option>
          ))}
        </select>
        <PDFDownloadLink document={<MyDocument />} fileName="tabla_materiales.pdf">
          {({ loading }) => (loading ? 'Cargando documento...' : 'Exportar a PDF')}
        </PDFDownloadLink>
      </div>

      <table className="tabla-materiales">
        <thead>
          <tr>
            <th>ID Material</th>
            <th>Número</th>
            <th>Nombre</th>
            <th>Código QR</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((material) => (
            <tr key={material.idMaterial}>
              <td>{material.idMaterial}</td>
              <td>{material.numero}</td>
              <td>{material.nombre}</td>
              <td>
                <img src={material.qrCodeDataUrl} alt={`Código QR para ${material.nombre}`} style={{ width: 100, height: 100 }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CodigosQR;