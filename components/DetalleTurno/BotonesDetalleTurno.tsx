"use client";
import {
  Appointment,
  TypeAppointment,
  TurnStatus,
} from "@/app/definitions/definitions";
import {
  useCancelAppointmentMutation,
  useUpdateAppointmentMutation,
  useCreateAppointmentMutation,
} from "@/app/redux/api/appointment.api";
import { setTurno } from "@/app/redux/slices/turno.slice";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

interface Props {
  appointment: Appointment;
  session: Session | null;
}
export default function BotonesDetalleTurno({ appointment, session }: Props) {
  const [cancelTurn] = useCancelAppointmentMutation();
  const [updateStatus] = useUpdateAppointmentMutation();
  const [createAppointment] = useCreateAppointmentMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div className="flex flex-row justify-between p-4 gap-6 mb-8">
      {session === null && (
        <button
          disabled={appointment.status === "approved"}
          className="btn bg-[#078B8C] h-12 w-full md:w-1/4 rounded-lg text-center"
          onClick={() => {
            Swal.fire({
              title: "¿Desea confirmar el turno?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Si, confirmar turno",
              cancelButtonText: "No, cancelar",
              cancelButtonColor: "#D9534F",
              confirmButtonColor: "#078B8C",
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  const result = await updateStatus({
                    id: appointment.id,
                    status: TurnStatus.approved,
                  }).unwrap();
                  if (result) {
                    Swal.close();
                    const modal = document.getElementById(
                      "modalConfirmTurn"
                    ) as HTMLDialogElement;
                    modal.showModal();
                  }
                } catch (error) {
                  Swal.close();
                  Swal.fire({
                    title: "Error al confirmar el turno",
                    icon: "error",
                    confirmButtonColor: "#D9534F",
                  });
                  console.log(error);
                }
              }
            });
          }}
        >
          <p className="font-bold text-white ">Confirmar Turno</p>
        </button>
      )}

      <button
        className="btn bg-[#D9534F] h-12 w-full md:w-1/4 rounded-lg text-center"
        onClick={() => {
          Swal.fire({
            title: "Desea cancelar el turno?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, cancelar turno",
            cancelButtonText: "No, conservar turno",
            cancelButtonColor: "#D9534F",
            confirmButtonColor: "#078B8C",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const result = await cancelTurn(appointment.id).unwrap();
                if (result) {
                  Swal.close();
                  Swal.fire({
                    title: "Turno cancelado",
                    icon: "success",
                    confirmButtonColor: "#078B8C",
                  }).then(() => {
                    if (session?.user?.role === "secretary") {
                      window.location.replace("/secretaria");
                    } else {
                      window.location.replace(
                        `/${session ? "medico" : "turnero/agenda"}`
                      );
                    }
                  });
                }
              } catch (error) {
                Swal.close();
                Swal.fire({
                  title: "Error al cancelar el turno",
                  icon: "error",
                  confirmButtonColor: "#D9534F",
                });
                console.log(error);
              }
            }
          });
        }}
      >
        <p className="text-white font-bold">Cancelar Turno</p>
      </button>

      <button
        className="btn bg-green-500 h-12 w-full md:w-1/4 rounded-lg text-center"
        onClick={() => {
          Swal.fire({
            title: "Desea agregar otro turno al Paciente?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, agregar otro",
            cancelButtonText: "No, cancelar",
            cancelButtonColor: "#D9534F",
            confirmButtonColor: "#078B8C",
          }).then((result) => {
            if (result.isConfirmed) {
              // guardo los datos para el nuevo turno
              const nuevoTurno: Appointment = {
                date: "",
                hour: "",
                status: TurnStatus.pending,
                practitioner: appointment.practitioner,
                practitionerId: appointment.practitioner.id,
                patient: appointment.patient,
                id: "",
                createdAt: "",
                deletedAt: null,
                scheduleId: "",
                slotId: "",
                typeAppointment: {
                  //TODO: Agregar appointment proporcionado por type
                  name: "Ningugo",
                  color: "#83d48f",
                },
                socialWork: appointment.socialWork,
              };
              dispatch(setTurno(nuevoTurno));

              Swal.fire({
                title: "Listo para agregar turno",
                text: "Seras dirigido a la agenda para seleccionar fecha y horario.",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                if (session?.user?.role === "secretary") {
                  router.push("/secretaria");
                } else {
                  router.push(`/${session ? "medico" : "turnero/agenda"}`);
                }
              });
            }
          });
        }}
      >
        <p className="text-white font-bold">Agregar otro turno al Paciente</p>
      </button>

      <button
        className="btn bg-blue-500 h-12 w-full md:w-1/4 rounded-lg text-center"
        onClick={() => {
          Swal.fire({
            title: "Desea reprogramar el turno?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, reprogramar turno",
            cancelButtonText: "No, conservar turno",
            cancelButtonColor: "#D9534F",
            confirmButtonColor: "#078B8C",
          }).then((result) => {
            if (result.isConfirmed) {
              const copiaTurno: Appointment = {
                date: "",
                hour: "",
                status: TurnStatus.pending,
                practitioner: appointment.practitioner,
                practitionerId: appointment.practitioner.id,
                patient: appointment.patient,
                id: appointment.id,
                createdAt: appointment.createdAt,
                deletedAt: null,
                scheduleId: "",
                slotId: "",
                typeAppointment: {
                  name: "Ningugo",
                  color: "#83d48f",
                },
                socialWork:appointment.socialWork,
              };
              dispatch(setTurno(copiaTurno));

              Swal.fire({
                title: "Turno listo para reprogramar",
                text: "Seras dirigido a la agenda para reprogramar el turno. \n\nRecuerda que el turno se cancelara automaticamente si no lo reprogramas.",
                icon: "success",
                showConfirmButton: true,
                confirmButtonText: "Ir a la agenda",
                confirmButtonColor: "#078B8C",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                cancelButtonColor: "#D9534F",
              }).then((result) => {
                if (result.isConfirmed) {
                  if (session?.user?.role === "secretary") {
                    router.push("/secretaria");
                  } else {
                    router.push(`/${session ? "medico" : "turnero/agenda"}`);
                  }
                }
              });
            }
          });
        }}
      >
        <p className="text-white font-bold">Reprogramar Turno</p>
      </button>
    </div>
  );
}
