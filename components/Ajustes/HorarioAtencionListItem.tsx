interface Props{
    dia:string;
    horaInicio:string;
    horaFin:string;
}
export default function HorarioAtencionListItem({dia,horaInicio,horaFin}:Props) {
  return (
    <div>
      <span>{dia} de {horaInicio} a {horaFin}</span>
    </div>
  );
}
