import AppointmentCard from "./AppointmentCard";
import { Appointment, TokenWithEntity } from "@/app/definitions/definitions";
import { useLazyGetAppointmentsByPatientQuery } from "@/app/redux/api/appointment.api";
import { useGetPatientWithFamilyGroupQuery } from "@/app/redux/api/patient.api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Función auxiliar para procesar y formatear los datos de cada cita
const formatAppointmentData = (appointment: Appointment) => {
  const { date, hour, practitioner } = appointment;
  const {
    name: practitionerName,
    lastName: practitionerLastName,
    professionalDegree,
  } = practitioner;
  const {
    profession: { name: specialty },
  } = professionalDegree;

  const appointmentDate = new Date(`${date}T00:00:00`);
  const day = appointmentDate.getDate();
  const month = appointmentDate.toLocaleString("es-ES", { month: "long" });

  return {
    day,
    month,
    hour,
    practitionerName,
    practitionerLastName,
    specialty,
    key: appointment.id,
  };
};

const AppointmentsList = () => {
  const { data: userData } = useSession();
  const [errorTurnos, setErrorTurnos] = useState(false);

  const construirObjeto = (id: string) => {
    const entityWithToken: TokenWithEntity = {
      token: userData?.user.accessToken,
      entity: {
        id: id,
        page: 1,
        limit: 3,
      },
    };
    return entityWithToken;
  };

  const [turnosOrdenadosPorPaciente, setTurnosOrdenadosPorPaciente] = useState<
    Record<string, Appointment[]>
  >({});

  const {
    data: pacientePrincipal,
    isSuccess,
    isLoading,
  } = useGetPatientWithFamilyGroupQuery({
    token: userData?.user.accessToken,
    id: userData?.user.id,
  });

  const [trigger, { data: turnos }] = useLazyGetAppointmentsByPatientQuery();

  const obtenerTurnos = async () => {
    let turnosPorPaciente: Record<string, Appointment[]> = {};

    try {
      const resPrincipal = await trigger(
        construirObjeto(pacientePrincipal?.id as string)
      ).unwrap();
      if (resPrincipal.turns.length > 0 && pacientePrincipal?.id) {
        turnosPorPaciente[pacientePrincipal?.id] = ordenarTurnos(
          resPrincipal.turns
        );
      }

      if (
        pacientePrincipal?.familyMembers &&
        pacientePrincipal?.familyMembers?.length > 0
      ) {
        const respuestas = await Promise.all(
          pacientePrincipal.familyMembers.map(async (integrante) => {
            const res = await trigger(construirObjeto(integrante.id)).unwrap();
            return { id: integrante.id, turns: res.turns };
          })
        );
        respuestas.forEach(({ id, turns }) => {
          if (turns.length > 0) {
            turnosPorPaciente[id] = ordenarTurnos(turns);
          }
        });
      }

      setTurnosOrdenadosPorPaciente(turnosPorPaciente);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Ocurrio un error al buscar los turnos",
        confirmButtonText: "Aceptar",
        willClose: () => setErrorTurnos(true),
      });

      return {};
    }
  };

  useEffect(() => {
    if (pacientePrincipal) {
      obtenerTurnos();
    }
  }, [pacientePrincipal]);

  const ordenarTurnos = (desordenados: Appointment[]) => {
    const parseHora = (hora: string) => {
      const [h, minutos] = hora.split(":").map(Number);
      return h * 60 + minutos;
    };

    let ordenados = [...desordenados].sort((a, b) => {
      const fechaA = new Date(a.date).getTime();
      const fechaB = new Date(b.date).getTime();

      if (fechaA != fechaB) {
        return fechaA - fechaB;
      }

      return parseHora(a.hour) - parseHora(b.hour);
    });

    return ordenados;
  };

  if (isLoading) {
    return <p className="text-center">Cargando turnos...</p>;
  }

  if (errorTurnos) {
    return (
      <p className="text-center text-red-500">
        Error al cargar los turnos. Por favor, intente de nuevo más tarde.
      </p>
    );
  }

  if (isSuccess && turnosOrdenadosPorPaciente) {
    return (
      <section className="flex flex-col w-3/5 2xl:w-1/2 max-lg:w-4/5 max-md:w-full m-auto">
        <h3 className="text-lg font-semibold mb-4 border-b-2 border-gray-300 p-2">
          Próximos turnos
        </h3>
        <div>
          {turnosOrdenadosPorPaciente[pacientePrincipal.id] &&
            turnosOrdenadosPorPaciente[pacientePrincipal.id].length > 0 && (
              <div>
                <h1 className="p-5 font-bold">
                  {pacientePrincipal.name} {pacientePrincipal.lastName}
                </h1>
                {turnosOrdenadosPorPaciente[pacientePrincipal.id].map(
                  (turno) => {
                    const formattedData = formatAppointmentData(turno);
                    return (
                      <AppointmentCard
                        key={formattedData.key}
                        id={formattedData.key}
                        day={formattedData.day}
                        month={formattedData.month}
                        hour={formattedData.hour}
                        practitionerName={
                          formattedData.practitionerName
                            ? formattedData.practitionerName
                            : ""
                        }
                        practitionerLastName={
                          formattedData.practitionerLastName
                            ? formattedData.practitionerLastName
                            : ""
                        }
                        specialty={formattedData.specialty}
                      />
                    );
                  }
                )}
              </div>
            )}
          {pacientePrincipal.familyMembers &&
            pacientePrincipal.familyMembers?.length > 0 &&
            pacientePrincipal.familyMembers.map((integrante) => {
              if (turnosOrdenadosPorPaciente[integrante.id]) {
                return (
                  <div key={integrante.id}>
                    <h1 className="p-5 font-bold">
                      {integrante.name} {integrante.lastName}
                    </h1>
                    {turnosOrdenadosPorPaciente[integrante.id].map((turno) => {
                        const formattedData = formatAppointmentData(turno);
                        return (
                          <AppointmentCard
                            key={formattedData.key}
                            id={formattedData.key}
                            day={formattedData.day}
                            month={formattedData.month}
                            hour={formattedData.hour}
                            practitionerName={
                              formattedData.practitionerName
                                ? formattedData.practitionerName
                                : ""
                            }
                            practitionerLastName={
                              formattedData.practitionerLastName
                                ? formattedData.practitionerLastName
                                : ""
                            }
                            specialty={formattedData.specialty}
                          />
                        );
                      })}
                  </div>
                );
              }
            })}
        </div>
      </section>
    );
  }
};

export default AppointmentsList;
