import React, { useEffect, useState } from "react";
import axios from "axios";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode';
import './CodigosBarra.css'

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
    height: 30,
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
});

const CodigosBarra = () => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const response = await axios.get('http://172.30.190.47:5000/material/ordered');
        setMateriales(response.data);
      } catch (err) {
        setError("Error al cargar los materiales");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriales();
  }, []);

  const generateBarcode = (value) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, value, {
      format: "CODE128",
      width: 2,
      height: 80,
      displayValue: false,
    });
    return canvas.toDataURL("image/png");
  };

  if (loading) {
    return <div>Cargando materiales...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Componente PDF con tamaño de página doble carta
  const MyDocument = () => (
    <Document>
      <Page size={[1100, 1700]} style={{ padding: 10 }}> {/* Tamaño en puntos (1 pulgada = 72 puntos) */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Cantidad</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Número</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Nombre</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Código de Barra</Text></View>
          </View>
          {materiales.map((material) => (
            <View style={styles.tableRow} key={material.idMaterial}>
              <View style={styles.tableCol}><Text style={styles.tableCell}></Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{material.numero}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellNombre}>{material.nombre}</Text></View>
              <View style={styles.tableCol}>
                <Image src={generateBarcode(material.numero)} />
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="tabla-materiales-container">
      <h4>Tabla de Materiales</h4>
      <PDFDownloadLink document={<MyDocument />} fileName="tabla_materiales.pdf">
        {({ loading }) => (loading ? 'Cargando documento...' : 'Exportar a PDF')}
      </PDFDownloadLink>
      <table className="tabla-materiales">
        <thead>
          <tr>
            <th>ID Material</th>
            <th>Número</th>
            <th>Nombre</th>
            < th>Código de Barra</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((material) => (
            <tr key={material.idMaterial}>
              <td>{material.idMaterial}</td>
              <td>{material.numero}</td>
              <td>{material.nombre}</td>
              <td>
                <img src={generateBarcode(material.numero)} alt={`Código de barra para ${material.nombre}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CodigosBarra;