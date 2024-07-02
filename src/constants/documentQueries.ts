import { Query } from "@aws-sdk/client-textract";

export const venezuelanIdQueries: Query[] = [
  // Queries // required
  {
    // Query
    Text: "V", // required
    Alias: "Nro de cedula",
  },
  {
    // Query
    Text: "NOMBRES", // required
    Alias: "Nombres",
  },
  {
    // Query
    Text: "APELLIDOS", // required
    Alias: "Apellidos",
  },
  {
    // Query
    Text: "Director", // required
    Alias: "Director",
  },
  {
    // Query
    Text: "F NACIMIENTO", // required
    Alias: "F de nacimiento",
  },
  {
    // Query
    Text: "F EXPEDICION", // required
    Alias: "F de expedicion",
  },
  {
    // Query
    Text: "F VENCIMIENTO", // required
    Alias: "F de expiracion",
  },
  {
    // Query
    Text: "EDO CIVIL", // required
    Alias: "Edo civil",
  },
];

export const venezuelanCirculationCertificateQueries: Query[] = [
  // Queries // required
  {
    // Query
    Text: "Which the id number?", // required
    Alias: "Serial de motor",
  },
  {
    // Query
    Text: "placa", // required
    Alias: "Placa",
  },
  {
    // Query
    Text: "Full name", // required
    Alias: "NOMBRE",
  },
  {
    // Query
    Text: "Venezuelan identification number", // required
    Alias: "Cedula",
  },
  {
    // Query
    Text: "which the vehicle properties?", // required
    Alias: "MARCA",
  },
  {
    // Query
    Text: "vehicle year", // required
    Alias: "ANIO",
  },
  {
    // Query
    Text: "NIV", // required
    Alias: "Serial de carroceria",
  },
  {
    // Query
    Text: "weight", // required
    Alias: "Peso",
  },
  {
    // Query
    Text: "number of ejes", // required
    Alias: "Cantidad de ejes",
  },
  {
    // Query
    Text: "letters next to the word ejes", // required
    Alias: "Color del vehiculo",
  },
  {
    // Query
    Text: "number of ptos", // required
    Alias: "Cantidad de puestos",
  },
];

export const InvoiceQueries: Query[] = [
  // Queries // required
  {
    // Query
    Text: "Factura N", // required
    Alias: "Numero de factura",
  },
  {
    // Query
    Text: "CI | RIF", // required
    Alias: "RIF",
  },
  {
    // Query
    Text: "N de control", // required
    Alias: "Numero de control",
  },
  {
    // Query
    Text: "Nombre o razon social", // required
    Alias: "Nombre o razon social",
  },
  {
    // Query
    Text: "Domicilio fiscal", // required
    Alias: "Domicilio fiscal",
  },
  {
    // Query
    Text: "Condiciones de pago | cond de pago", // required
    Alias: "Condiciones de pago",
  },
  {
    // Query
    Text: "Telefono", // required
    Alias: "Telefono",
  },
  {
    // Query
    Text: "Precio", // required
    Alias: "Precio unitario",
  },
  {
    // Query
    Text: "Subtotal", // required
    Alias: "Subtotal",
  },
  {
    // Query
    Text: "Total a pagar | monto total", // required
    Alias: "Monto total",
  },
];
