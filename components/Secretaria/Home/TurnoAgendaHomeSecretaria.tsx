import { Appointment } from "@/app/definitions/definitions";
import { useUpdateAppointmentStatusMutation } from "@/app/redux/api/appointment.api";
import Swal from "sweetalert2";

interface Props {
  turno: Appointment;
}

export default function TurnoAgendaHomeSecretaria({ turno }: Props) {

  const [trigger,
      {
        isLoading,
        isError,
        isSuccess,
      }
    ] = useUpdateAppointmentStatusMutation()

  const handleUpdateStatus = async () => {
    if (turno.status == "completed") {
      Swal.fire({
        icon: "info",
        title: "¡El turno seleccionado ya esta completo!",
        timer: 5000,
        width: "670px",
        timerProgressBar: true,
      });
      return
    }
    Swal.fire({
      title: '¿Seguro?',
      icon: "question",
      text: `Estas a punto de marcar como completo el turno de ${turno.patient.name} ${turno.patient.lastName} con el medico ${turno.practitioner.name}  ${turno.practitioner.lastName} tomado en la fecha ${turno.date} a las ${turno.hour}.`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: "#087374",
      denyButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-1',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await trigger({
            id: turno.id,
            status: "completed",
          }).unwrap()
          Swal.fire({
            icon: "success",
            title: "¡Exito!",
            text: `El turno quedo marcado como completo`,
            timer: 2000,
            timerProgressBar: true,
          });
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Ocurrió un error",
            text: `${error.data.message}`,
            timer: 10000,
            timerProgressBar: true,
          });
        }
      }
    })
  }

  return (
    <div className="w-full grid grid-cols-5 font-semibold opacity-75 border-b-2 items-center border-gray-300 shadow p-1">
      <div>
        <h2>{turno.hour}</h2>
      </div>
      <div>
        <h2>
          {turno.patient.name} {turno.patient.lastName}
        </h2>
      </div>
      <div>
        <h2>{turno.practitioner.name}</h2>
      </div>
      <div>
        {
          turno.status == "pending" ?
            <p>Pendiente</p>
            : turno.status == "approved" ?
              <p>Aprobado</p>
              : turno.status == "completed" ?
                <p>Completado</p>
                : turno.status == "cancelled" ?
                  <p>Cancelado</p>
                  : turno.status == "absent" ?
                    <p>Ausente</p>
                    : <p>Otro</p>
        }
      </div>
      <div>
        <button
          className={`${turno.status == "completed"?"hidden":"flex"} flex-row items-center justify-center w-45 btn text-black border-0 shadow-none bg-blue-300 rounded-[8px]`}
          onClick={() => handleUpdateStatus()}
          disabled={isLoading}
        >
          {isLoading ? <img src="/hourglass.svg" /> : <img src="/check-black.svg" />}
          <p className='flex items-center h-full'>{isLoading ? "" : "Completar turno"}</p>
        </button>
      </div>
    </div>
  );
}
