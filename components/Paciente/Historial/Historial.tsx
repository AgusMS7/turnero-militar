import React, { useEffect, useState } from "react";
import { HistoryPractitionerCard } from "./HistoryPractitionerCard";
import { ToggleWithText } from "./ToggleWithText";
import { useSession } from "next-auth/react";
import { useLazyGetAllAppointmentsByPatientQuery } from "@/app/redux/api/appointment.api";
import { useGetProfessionaDegreeQuery } from "@/app/redux/api/professionalDegree.api";
import {
  useGetPatientByIdQuery,
  useGetPatientWithFamilyGroupQuery,
} from "@/app/redux/api/patient.api";
import { Patient } from "@/app/definitions/definitions";

const Limit = 4;

export function Historial() {
  const { data: session } = useSession();

  const token = session?.user.accessToken;

  const [userId, setUserId] = useState<string>("");

  const [professionalDegreeName, setProfessionalDegreeName] = useState("");

  const [apellido, setApellido] = useState("");

  const [pacienteBuscado, setPacienteBuscado] = useState(session?.user.id);

  const [timePeriod, setTimePeriod] = useState("all");

  const [appointmentStatus, setAppointmentStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const getDates = () => {
    const currentDate = new Date();

    const startDate = new Date();

    if (timePeriod == "all") {
      return [
        "2000-01-01",
        `${currentDate.getFullYear()}-${
          currentDate.getMonth() < 9
            ? `0${currentDate.getMonth() + 1}`
            : currentDate.getMonth() + 1
        }-${
          currentDate.getDate() < 10
            ? `0${currentDate.getDate()}`
            : currentDate.getDate()
        }`,
      ];
    }

    if (timePeriod == "week") {
      startDate.setDate(currentDate.getDate() - 7);
      return [
        `${startDate.getFullYear()}-${
          startDate.getMonth() < 9
            ? `0${startDate.getMonth() + 1}`
            : startDate.getMonth() + 1
        }-${
          startDate.getDate() < 10
            ? `0${startDate.getDate()}`
            : startDate.getDate()
        }`,
        `${currentDate.getFullYear()}-${
          currentDate.getMonth() < 9
            ? `0${currentDate.getMonth() + 1}`
            : currentDate.getMonth() + 1
        }-${
          currentDate.getDate() < 10
            ? `0${currentDate.getDate()}`
            : currentDate.getDate()
        }`,
      ];
    }

    if (timePeriod == "month") {
      startDate.setMonth(currentDate.getMonth() - 1);
      return [
        `${startDate.getFullYear()}-${
          startDate.getMonth() < 9
            ? `0${startDate.getMonth() + 1}`
            : startDate.getMonth() + 1
        }-${
          startDate.getDate() < 10
            ? `0${startDate.getDate()}`
            : startDate.getDate()
        }`,
        `${currentDate.getFullYear()}-${
          currentDate.getMonth() < 9
            ? `0${currentDate.getMonth() + 1}`
            : currentDate.getMonth() + 1
        }-${
          currentDate.getDate() < 10
            ? `0${currentDate.getDate()}`
            : currentDate.getDate()
        }`,
      ];
    }

    if (timePeriod == "6month") {
      startDate.setMonth(currentDate.getMonth() - 6);
      return [
        `${startDate.getFullYear()}-${
          startDate.getMonth() < 9
            ? `0${startDate.getMonth() + 1}`
            : startDate.getMonth() + 1
        }-${
          startDate.getDate() < 10
            ? `0${startDate.getDate()}`
            : startDate.getDate()
        }`,
        `${currentDate.getFullYear()}-${
          currentDate.getMonth() < 9
            ? `0${currentDate.getMonth() + 1}`
            : currentDate.getMonth() + 1
        }-${
          currentDate.getDate() < 10
            ? `0${currentDate.getDate()}`
            : currentDate.getDate()
        }`,
      ];
    }
    return ["", ""];
  };

  const { data: patient } = useGetPatientWithFamilyGroupQuery({
    token: token,
    id: userId,
  });

  const {
    data: professionalDegrees,
    isLoading: profDegreeLoad,
    isError: profDegreeError,
  } = useGetProfessionaDegreeQuery(token);

  const [trigger, { data: patientData, isLoading, isError }] =
    useLazyGetAllAppointmentsByPatientQuery();

  useEffect(() => {
    const dates = getDates();
    const userId = session?.user.id;
    console.log("userId", userId);
    if (!userId) return;
    setUserId(userId);
    trigger({
      id: userId,
      token: token,
      practitionerName: apellido != "" ? apellido : undefined,
      status: appointmentStatus == "" ? undefined : appointmentStatus,
      profession:
        professionalDegreeName != "" ? professionalDegreeName : undefined,
      startDate: dates[0],
      endDate: dates[1],
      page: "1",
      limit: Limit.toString(),
    });
    console.log("turnos", patientData);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [apellido, appointmentStatus, timePeriod, professionalDegreeName]);

  useEffect(() => {
    const dates = getDates();
    if (!userId) return;
    const delayDebounce = setTimeout(() => {
      trigger({
        id: pacienteBuscado,
        token: token,
        practitionerName: apellido != "" ? apellido : undefined,
        status: appointmentStatus != "" ? appointmentStatus : undefined,
        profession:
          professionalDegreeName != "" ? professionalDegreeName : undefined,
        startDate: dates[0],
        endDate: dates[1],
        page: currentPage.toString(),
        limit: Limit.toString(),
      });
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [
    apellido,
    pacienteBuscado,
    appointmentStatus,
    professionalDegreeName,
    timePeriod,
    currentPage,
  ]);

  return (
    <div className="bg-gray-200 w-full md:h-full h-fit flex justify-center items-end">
      <div className="flex flex-col lg:w-10/12 w-[98%] h-11/12 gap-6">
        <div className="flex flex-col bg-white border-gray-400 rounded-xl shadow-md gap-3 md:p-2.5 p-0.5 sm:px-10 ">
          <div className="w-full flex flex-row max-md:flex-col items-center gap-10">
            <p className="text-2xl">
              <b>Historial de turnos</b>
            </p>
            <select
              className="py-2 border border-gray-400 rounded-lg max-md:w-full select"
              value={pacienteBuscado}
              onChange={(e)=>setPacienteBuscado(e.target.value)}
            >
              <option value={patient?.id}>
                {patient?.name} {patient?.lastName}
              </option>
              {patient?.familyMembers &&
                patient.familyMembers.length > 0 &&
                patient.familyMembers.map((integrante) => (
                  <option key={integrante.id} value={integrante.id}>
                    {integrante.name} {integrante.lastName}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex md:flex-row flex-col gap-5 justify-around w-full">
            <div className="flex flex-row input 2xl:w-5/12 md:w-6/12 w-full rounded-lg text-xl">
              <img src="/search_gray.svg" alt="" />
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Medico..."
              />
            </div>
            <select
              className="2xl:w-5/12 md:w-6/12 w-full select rounded-lg text-xl text-gray-400"
              value={professionalDegreeName}
              onChange={(e) => setProfessionalDegreeName(e.target.value)}
            >
              <option disabled={true}>Especialidad...</option>
              <option value={""}>Todas las especialidades</option>
              {profDegreeLoad ? (
                <option disabled={true}>Cargando...</option>
              ) : profDegreeError ? (
                <option disabled={true}>Ocurrio un error</option>
              ) : (
                professionalDegrees?.map((profDegree) => (
                  <option
                    key={profDegree.id}
                    value={profDegree.profession.name}
                  >
                    {profDegree.profession.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="flex flex-row xl:gap-20 gap-2 md:justify-around justify-between">
            <div>
              <p>Periodo de tiempo</p>
              <div className="flex md:flex-row flex-col items-center gap-1.5">
                <ToggleWithText
                  bodyText="Todos"
                  activationCondition="all"
                  activationValue={timePeriod}
                  changeActivationValueFunction={setTimePeriod}
                />
                <ToggleWithText
                  bodyText="1 Semana"
                  activationCondition="week"
                  activationValue={timePeriod}
                  changeActivationValueFunction={setTimePeriod}
                />
                <ToggleWithText
                  bodyText="1 Mes"
                  activationCondition="month"
                  activationValue={timePeriod}
                  changeActivationValueFunction={setTimePeriod}
                />
                <ToggleWithText
                  bodyText="6 Meses"
                  activationCondition="6month"
                  activationValue={timePeriod}
                  changeActivationValueFunction={setTimePeriod}
                />
              </div>
            </div>
            <div>
              <p>Estado de turno</p>
              <div className="flex flex-col xl:flex-row md:items-start items-center gap-1.5">
                <div className="flex md:flex-row flex-col items-center gap-1.5">
                  <ToggleWithText
                    bodyText="Todos"
                    activationCondition=""
                    activationValue={appointmentStatus}
                    changeActivationValueFunction={setAppointmentStatus}
                  />
                  <ToggleWithText
                    bodyText="Pendiente"
                    activationCondition="pending"
                    activationValue={appointmentStatus}
                    changeActivationValueFunction={setAppointmentStatus}
                  />
                  <ToggleWithText
                    bodyText="Aprobado"
                    activationCondition="approved"
                    activationValue={appointmentStatus}
                    changeActivationValueFunction={setAppointmentStatus}
                  />
                  <ToggleWithText
                    bodyText="Completado"
                    activationCondition="completed"
                    activationValue={appointmentStatus}
                    changeActivationValueFunction={setAppointmentStatus}
                  />
                </div>
                <div className="flex md:flex-row flex-col items-center gap-1.5">
                  <ToggleWithText
                    bodyText="Cancelado"
                    activationCondition="cancelled"
                    activationValue={appointmentStatus}
                    changeActivationValueFunction={setAppointmentStatus}
                  />
                  <ToggleWithText
                    bodyText="Ausente"
                    activationCondition="absent"
                    activationValue={appointmentStatus}
                    changeActivationValueFunction={setAppointmentStatus}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full gap-4 overflow-x-auto">
          {patientData?.turns && patientData?.turns.length > 0 ? (
            patientData?.turns.map((appointment) => (
              <HistoryPractitionerCard
                key={appointment.id}
                appointment={appointment}
              />
            ))
          ) : isLoading ? (
            <div className="flex items-center justify-center">
              <div className="flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl">
                <img className="w-10 h-10" src="/hourglass.svg" />
                <p className="md:text-3xl text-xl">Cargando...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center">
              <div className="flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl">
                <p className="md:text-3xl text-xl">Ocurrio un error</p>
                <p className="text-center">
                  Por favor intenta de nuevo mas tarde
                </p>
                <img className="w-10 h-10" src="/crossError.svg" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl">
                <p className="md:text-3xl text-xl">
                  No se encontraron coincidencias
                </p>
                <img className="w-10 h-10" src="/information.svg" />
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex flex-row justify-center items-center gap-4 mb-1.5">
          <button
            className={`btn w-10 relative ${
              currentPage <= 1 ? "bg-gray-500" : "bg-[#078B8C]"
            }`}
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            <img className="absolute" src="/arrow-left-white.svg" />
          </button>
          <div>
            {currentPage}-
            {Math.ceil(patientData?.total ? patientData?.total / Limit : 1)}
          </div>
          <button
            className={`btn w-10 relative ${
              currentPage >=
              (patientData?.total
                ? Math.ceil(patientData?.total ? patientData?.total / Limit : 1)
                : -1)
                ? "bg-gray-500"
                : "bg-[#078B8C]"
            }`}
            disabled={
              currentPage >=
              (patientData?.total
                ? Math.ceil(patientData?.total ? patientData?.total / Limit : 1)
                : -1)
            }
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            <img className="absolute" src="/arrow-right-white.svg" />
          </button>
        </div>
      </div>
    </div>
  );
}
