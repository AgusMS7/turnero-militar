import CardOpcionHomeSecretaria from "./CardOpcionHomeSecretaria";

export default function OpcionesHomeSecretaria() {
  return (
    <div className="flex flex-wrap m-auto w-1/2 gap-2 *:py-2">
      <CardOpcionHomeSecretaria
        titulo="Medicos"
        link="/secretaria/medicos"
        icono="/secretaria/iconos/medicosSecretaria.png"
      />
      <CardOpcionHomeSecretaria
        titulo="Pacientes"
        link="/secretaria/pacientes"
        icono="/secretaria/iconos/paciente.png"
      />
      <CardOpcionHomeSecretaria
        titulo="Agenda"
        link="/secretaria/agenda"
        icono="/secretaria/iconos/agendaHospitalSecretaria.png"
      />
      <CardOpcionHomeSecretaria
        titulo="Estadisticas"
        link="/secretaria/estadisticas"
        icono="/secretaria/iconos/estadisticasSecretaria.png"
      />
      <CardOpcionHomeSecretaria
        titulo="Configuracion"
        link="/secretaria/configuracion"
        icono="/secretaria/iconos/configuracionSecretaria.png"
      />
    </div>
  );
}
