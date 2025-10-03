import SnackbarDatos from "./SnackbarDatos";

interface Props{
  nombre:string;
  apellido:string;
  coberturaMedica: string;
  dni:string;
  email:string;
  phone: string

}
export default function DatosPaciente({nombre,apellido,coberturaMedica,dni,email, phone}:Props) {
return (
  <div className="text-black flex flex-col space-y-4">
    <h1 className="text-xl">Datos del Paciente</h1>
    <SnackbarDatos titulo={"Nombre"} cuerpo={nombre}/>
    <SnackbarDatos titulo={"Apellido"} cuerpo={apellido}/>
    <SnackbarDatos titulo={"Cobertura Medica"} cuerpo={coberturaMedica}/>
    <SnackbarDatos titulo={"DNI"} cuerpo={dni}/>
    <SnackbarDatos titulo={"Email"} cuerpo={email}/>
    <SnackbarDatos titulo={"Teléfono"} cuerpo={phone}/>
  </div>
);
}