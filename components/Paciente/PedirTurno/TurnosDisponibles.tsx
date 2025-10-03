"use client";
import { useSession } from "next-auth/react";
import Medico from "./Medico";
import Turnos from "./Turnos";
import { useGetOnePractitionerQuery } from "@/app/redux/api/practitioner.api";
import {
  useCreateAppointmentMutation,
  useLazyGetAvaibleTurnsByPractitionerQuery,
} from "@/app/redux/api/appointment.api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { Lexend, Inter } from "next/font/google";
import { Turno, AvailableItem } from "@/app/definitions/definitions";
import {
  useGetPatientWithFamilyGroupQuery,
  useLazyGetPatientByIdQuery,
} from "@/app/redux/api/patient.api";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function TurnosDisponibles() {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  const { data: session } = useSession();
  const patientId = session?.user.id;
  const token = session?.user.accessToken;
  const { data: pacienteConGrupo } = useGetPatientWithFamilyGroupQuery({
    id: patientId,
    token: token,
  });
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(patientId);
  const [obraSeleccionada, setObraSeleccionada] = useState("");
  const [buscarPaciente, { data: pacienteParaObraSocial }] =
    useLazyGetPatientByIdQuery();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [triggerTurn, { data: turnos }] =
    useLazyGetAvaibleTurnsByPractitionerQuery();
  const [triggerCreateAppointment] = useCreateAppointmentMutation();
  const { data: medico, isError } = useGetOnePractitionerQuery({
    id: id,
    token: token,
  });

  useEffect(() => {
    setObraSeleccionada("");
    const traerPacienteConObra = async () => {
      await buscarPaciente({
        token: token,
        id: pacienteSeleccionado,
      });
    };

    traerPacienteConObra();
  }, [pacienteSeleccionado]);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const fechaHoy = `${yyyy}-${mm}-${dd}`;

    if (!selectedDate) setSelectedDate(fechaHoy);
  }, [selectedDate]);

  useEffect(() => {
    if (id && token && selectedDate) {
      triggerTurn({
        id: id,
        startDate: selectedDate,
        endDate: selectedDate,
        token: token,
      });
    }
  }, [id, token, triggerTurn, selectedDate]);

  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(
    null
  );

  const handleReservarTurno = async () => {
    if (!turnoSeleccionado || !patientId || !id) return;
    try {
      const appointment = {
        practitionerId: id,
        patientId: pacienteSeleccionado,
        scheduleId: turnoSeleccionado!.scheduleId,
        slotId: turnoSeleccionado!.slotId,
        hour: turnoSeleccionado!.horario,
        date: selectedDate,
        socialWorkId: obraSeleccionada || null,
      };
      const res = await triggerCreateAppointment({
        appointment,
        token,
      }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Turno reservado",
        text: "Recibirás un correo de confirmación 24 horas antes del turno.",
        confirmButtonText: "Continuar",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        Swal.fire({
          icon: "info",
          title: "Importante - Métodos de Pago",
          html: "Recordá que el <strong>Hospital Militar</strong> solo acepta:<br><br>• Transferencias Bancarias<br>",
          confirmButtonText: "Entendido",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          window.location.replace("/paciente");
        });
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al reservar turno",
        text: error?.data?.message || "No se pudo reservar el turno.",
        timer: 4000,
        timerProgressBar: true,
      });
    }
  };

  if (medico && turnos) {
    const turnosDisponibles: Turno[] =
      (turnos?.days?.[0]?.available as AvailableItem[] | undefined)?.map(
        (item) => ({
          horario: item.time,
          scheduleId: item.scheduleId,
          slotId: item.slotId,
        })
      ) ?? [];
    return (
      <div className="flex justify-center items-center w-4/5 max-lg:w-full p-6">
        <div className="rounded-2xl shadow-xl max-w-6xl w-full min-h-[600px] min-w-[70vw] overflow-y-auto relative flex flex-col">
          <Medico
            nombre={`${medico.name} ${medico.lastName}`}
            especialidad={
              medico.professionalDegree?.profession?.name || "Especialidad"
            }
            url={medico.urlImg}
            appointmentSlots={medico.appointmentSlots}
          />

          <div
            className="px-8 py-6 bg-white grid grid-cols-2 max-md:flex max-md:flex-col *:w-full [&_select]:w-full [&_select]:focus:outline-none [&_select]:focus:border-teal-600 [&_select]:focus:border-2 gap-2"
          >
            <div className="flex flex-col">
              <label>Paciente</label>
              <select
                className="select"
                value={pacienteSeleccionado}
                onChange={(e) => setPacienteSeleccionado(e.target.value)}
              >
                <option value={pacienteConGrupo?.id}>
                  {pacienteConGrupo?.name} {pacienteConGrupo?.lastName}
                </option>
                {pacienteConGrupo?.familyMembers &&
                  pacienteConGrupo?.familyMembers?.length > 0 &&
                  pacienteConGrupo?.familyMembers?.map((integrante) => (
                    <option key={integrante.id} value={integrante.id}>
                      {integrante.name} {integrante.lastName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label>Obra social</label>
              <select
                className="select"
                value={obraSeleccionada}
                onChange={(e) => setObraSeleccionada(e.target.value)}
              >
                <option value={""}>Particular</option>
                {pacienteParaObraSocial?.socialWorkEnrollment?.socialWork
                  ?.name != "Particular" && (
                  <option
                    value={
                      pacienteParaObraSocial?.socialWorkEnrollment?.socialWork
                        ?.id
                    }
                  >
                    {
                      pacienteParaObraSocial?.socialWorkEnrollment?.socialWork
                        ?.name
                    }
                  </option>
                )}
              </select>
            </div>
          </div>

          <div className="px-8 py-6 bg-white flex-1 flex flex-col">
            <h2
              className={`text-center text-gray-900 mb-8 font-semibold max-md:text-2xl text-4xl ${lexend.className}`}
            >
              Turnos disponibles
            </h2>

            <Turnos
              turnos={turnosDisponibles}
              onSelect={(t) => setTurnoSeleccionado(t)}
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(d)}
              lexendClass={lexend.className}
              interClass={inter.className}
            />
          </div>

          <div className="px-8 py-6 border-t border-gray-200 bg-white">
            <div className="flex justify-center">
              <button
                className={`px-8 py-3 rounded-xl font-normal text-2xl transition-all duration-200 shadow-md hover:shadow-lg ${
                  inter.className
                } ${
                  turnoSeleccionado
                    ? "bg-teal-600 text-white hover:bg-teal-700 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!turnoSeleccionado}
                onClick={handleReservarTurno}
              >
                Reservar turno
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
