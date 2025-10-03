import { PractitionerAppointment } from "@/app/definitions/definitions";
import React, { useEffect, useState } from "react";
import { useGetOnePractitionerQuery } from "@/app/redux/api/practitioner.api";
import { useSession } from "next-auth/react";

interface CalendarioProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  disponibilidad: PractitionerAppointment[];
  practitionerId?: string;
}

const CalendarioHorizontal: React.FC<CalendarioProps> = ({
  selectedDate,
  onDateSelect,
  disponibilidad,
  practitionerId,
}) => {
  const [days, setDays] = useState<Date[]>([]);
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  // Obtiene los datos del médico para obtener los días de trabajo
  const { data: practitioner } = useGetOnePractitionerQuery({
    id: practitionerId || "",
    token,
  });

  const dayMap: Record<string, string> = {
    monday: "lunes",
    tuesday: "martes",
    wednesday: "miércoles",
    thursday: "jueves",
    friday: "viernes",
    saturday: "sábado",
    sunday: "domingo",
  };

  useEffect(() => {
    const currentMonth = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
    const datesArray = Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, currentMonth, i + 1)
    );
    setDays(datesArray);
  }, [selectedDate]);

  const isDayAvailable = (day: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    day.setHours(0, 0, 0, 0);

    // Verifica si el día es en el pasado
    if (day < today) {
      return false;
    }

    if (!practitioner?.appointmentSlots) {
      const horariosVacios = disponibilidad.every(
        (d) => !d.openingHour || !d.closeHour
      );

      if (horariosVacios) {
        return true;
      }

      const dayOfWeek = day
        .toLocaleString("es-ES", { weekday: "long" })
        .toLowerCase();
      return disponibilidad.some(
        (d) => dayMap[d.day.toLowerCase()] === dayOfWeek
      );
    }

    // Verifica si el médico trabaja en este día de la semana
    const dayOfWeek = day.toLocaleDateString("en-US", { weekday: "long" });
    const appointmentSlot = practitioner.appointmentSlots?.find(
      (slot: any) => slot.day === dayOfWeek
    ) as any;

    // Verifica si el médico trabaja en este día si existe y no está disponible
    return !!appointmentSlot && !appointmentSlot.unavailable;
  };

  const handleDayClick = (day: Date) => {
    if (isDayAvailable(day)) {
      onDateSelect(day);
    }
  };

  return (
    <div className="flex overflow-x-auto mb-1">
      {days.map((day) => (
        <div
          key={day.toDateString()}
          className="flex flex-col items-center cursor-pointer p-1"
          onClick={() => handleDayClick(day)}
        >
          <span>
            {day
              .toLocaleDateString("es-ES", { weekday: "short" })
              .charAt(0)
              .toUpperCase() +
              day.toLocaleDateString("es-ES", { weekday: "short" }).slice(1)}
          </span>
          <span
            className={`rounded-full flex items-center justify-center ${
              day.toDateString() === selectedDate.toDateString()
                ? "bg-[#078B8C] text-white w-8 h-8 -mt-1"
                : isDayAvailable(day)
                ? "bg-[#6DB52A] w-6 h-6"
                : "cursor-not-allowed w-6 h-6"
            }`}
          >
            {day.getDate()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CalendarioHorizontal;
