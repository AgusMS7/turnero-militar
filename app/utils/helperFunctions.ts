//Aqui se encuentran las funciones auxiliares que se utilizan en la app

import { Session } from "next-auth";
import Swal from "sweetalert2";
import { Appointment, PractitionerAppointment } from "../definitions/definitions";

//Función para corregir el formato de fecha de YYYY-MM-DD a DD/MM/YYYY
export function corregirFecha(fecha: string): string {
  const fechaArray = fecha.split("-");
  return `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]}`;
}

//Función para verificar si el horario del turno ha expirado
export function isHorarioExpirado(session: Session | null): boolean {
  //Convertir las fechas a milisegundos
  const fechaActual = new Date().getTime();
  const fechaTurno = Date.parse(
    `${localStorage.getItem("fechaTurno")}T${localStorage.getItem(
      "horaTurno"
    )}:00`
  );
  const fechaTurnoMenos10Min = new Date(fechaTurno - 1000 * 60 * 10).getTime();
  //Verificar si el horario expiro o si esta a punto de expirar
  if (
    fechaTurno < fechaActual ||
    (fechaActual >= fechaTurnoMenos10Min && fechaActual < fechaTurno)
  ) {
    Swal.fire({
      title: "Error al crear el turno",
      text: "El horario seleccionado expiro, por favor seleccione otro",
      icon: "error",
      confirmButtonText: "Ir al turnero",
      didClose: () => {
        localStorage.removeItem("fechaTurno");
        localStorage.removeItem("horaTurno");
        window.location.replace(`/${session ? "medico" : "turnero/agenda"}`);
      },
    });
    return true;
  }
  return false;
}

//Calculadora de intervalos de tiempo
export function calcularIntervalos(
  startHour: number = 7,
  endHour: number = 23,
  minutes: number = 30
): string[] {
  //Transformar la hora total a minutos
  const totalMinutes = (endHour - startHour) * 60;
  //Calcular el numero de intervalos
  const intervalCount = Math.round(totalMinutes / minutes);
  //Crear un array con los intervalos
  const intervalos = [];
  for (let i = 0; i < intervalCount; i++) {
    const hour = Math.floor((startHour * 60 + i * minutes) / 60);
    const minute = (startHour * 60 + i * minutes) % 60;
    intervalos.push(
      `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
    );
  }
  return intervalos;
}

// Nueva función que calcula los timeSlots fijos de 30 minutos pa que no se vea feo el calendario
export function calcularIntervalosConHorario(
  disponibilidad: any[],
  dayOfWeek: string,
  minutes: number = 30
): string[] {
  return calcularIntervalos(7, 23, minutes);
}

// Nueva función que verifica si un slot de tiempo esta disponible para un dia especifico
export function isTimeSlotAvailable(
  timeSlot: string,
  disponibilidad: any[],
  dayOfWeek: string,
  minutes: number = 30
): boolean {
  if (!disponibilidad || disponibilidad.length === 0) {
    return true; // Fallback por si hay algun error con los datos
  }

  const dayAvailability = disponibilidad.find(
    (d) => dayMap[d.day.toLowerCase()] === dayOfWeek.toLowerCase()
  );

  if (!dayAvailability || dayAvailability.unavailable) {
    return false;
  }

  const [openingHour, startMinute] = dayAvailability.openingHour
    .split(":")
    .map(Number);
  const [closeHour, closeMinute] = dayAvailability.closeHour.split(":").map(Number);
  const [hour, minute] = timeSlot.split(":").map(Number);

  const startTime = openingHour * 60 + startMinute;
  const endTime = closeHour * 60 + closeMinute;
  const currentTime = hour * 60 + minute;

  // Verifica si el slot de tiempo esta dentro de los horarios de trabajo
  const isWithinWorkingHours = currentTime >= startTime && currentTime <= endTime;
  
  // Verifica si el turno terminaría antes de cerrar
  const appointmentEndTime = currentTime + minutes;
  const wouldFinishBeforeClosing = appointmentEndTime <= endTime;

  return isWithinWorkingHours && wouldFinishBeforeClosing;
}

const dayMap: Record<string, string> = {
  monday: "lunes",
  tuesday: "martes",
  wednesday: "miércoles",
  thursday: "jueves",
  friday: "viernes",
  saturday: "sábado",
  sunday: "domingo",
};

//Determinar si el horario de atencion esta activo
export function isHorarioAtencionActivo(
  hora: string,
  disponibilidad: PractitionerAppointment[],
  fechaTurno: Date
): boolean {
  const dayOfWeek = fechaTurno.toLocaleString("es-ES", { weekday: "long" });

  const horariosVacios = disponibilidad.every(
    (d) => !d.openingHour || !d.closeHour
  );

  if (horariosVacios) return true;

  const dayAvailability = disponibilidad.find(
    (d) => dayMap[d.day.toLowerCase()] === dayOfWeek.toLowerCase()
  );

  if (!dayAvailability) return false;

  // Si el día está marcado como unavailable, no está disponible
  if (dayAvailability.unavailable) return false;

  const [openingHour, startMinute] = dayAvailability.openingHour
    .split(":")
    .map(Number);
  const [closeHour, closeMinute] = dayAvailability.closeHour.split(":").map(Number);
  const [hour, minute] = hora.split(":").map(Number);

  const startTime = openingHour * 60 + startMinute;
  const endTime = closeHour * 60 + closeMinute;
  const currentTime = hour * 60 + minute;

  const ahora = new Date();

  const turnoDateTime = new Date(fechaTurno);
  turnoDateTime.setHours(hour, minute, 0, 0);

  const diffInMinutes = (turnoDateTime.getTime() - ahora.getTime()) / 60000;

  const esHoy =
    fechaTurno.getDate() === ahora.getDate() &&
    fechaTurno.getMonth() === ahora.getMonth() &&
    fechaTurno.getFullYear() === ahora.getFullYear();

  if (esHoy && diffInMinutes < 10) {
    return false;
  }

  return currentTime >= startTime && currentTime <= endTime;
}

export const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
export const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

//Determinar si es un dia disponible para la agenda
export function isDiaDisponible(
  disponibilidad: PractitionerAppointment[],
  year: number,
  month: number,
  day: number
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Pone hoy a las 00:00

  const dateToCheck = new Date(year, month, day);
  dateToCheck.setHours(0, 0, 0, 0); // También a las 00:00

  const isBeforeToday = dateToCheck < today;

  if (isBeforeToday) {
    return false;
  }

  const horariosVacios = disponibilidad.every(
    (d) => !d.openingHour || !d.closeHour
  );

  if (horariosVacios) {
    return true;
  }

  const dayOfWeek = new Date(year, month, day).toLocaleString("es-ES", {
    weekday: "long",
  });
  return disponibilidad.some(
    (d) => dayMap[d.day.toLowerCase()] === dayOfWeek.toLowerCase()
  );
}

export function filtrarTurnos(turnos:Appointment[],selectedDate:Date): Appointment[] {
  return turnos.filter((turno) => {
    const conversorFecha = selectedDate.toLocaleDateString("en-CA");
    return turno.date === conversorFecha;
  });
}
