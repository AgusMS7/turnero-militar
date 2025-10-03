import { useEffect, useState } from "react";
import CampoHora from "./CampoHora";
import Interruptor from "./Interruptor";
import {
  TimeSlot,
  AppointmentSlot,
  Schedule,
} from "@/app/definitions/definitions";

type Props = {
  appointmentSlots?: AppointmentSlot[];
  onSlotsChange?: (slots: TimeSlot[]) => void;
  editable?: boolean;
  lexendClass?: string;
  latoClass?: string;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAYS_SPANISH: { [key: string]: string } = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
};

export default function PanelHorarios({
  appointmentSlots = [],
  onSlotsChange,
  editable = false,
  lexendClass = "",
  latoClass = "",
}: Readonly<Props>) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() =>
    DAYS.map((day) => {
      const slot = appointmentSlots?.find((slot) => slot.day === day);
      const schedule = slot?.schedules[0];
      return {
        day,
        startTime: schedule?.openingHour?.slice(0, 5) ?? "09:00",
        endTime: schedule?.closeHour?.slice(0, 5) ?? "17:00",
        available: !!slot && !slot.unavailable,
        appointmentSlotId: slot?.id,
        scheduleId: schedule?.id,
      };
    })
  );

  useEffect(() => {
    onSlotsChange?.(timeSlots);
  }, [timeSlots, onSlotsChange]);

  const handleAvailabilityChange = (day: string, available: boolean) => {
    setTimeSlots((slots) =>
      slots.map((slot) => (slot.day === day ? { ...slot, available } : slot))
    );
  };

  const handleTimeChange = (
    day: string,
    type: "startTime" | "endTime",
    time: string
  ) => {
    setTimeSlots((slots) =>
      slots.map((slot) => (slot.day === day ? { ...slot, [type]: time } : slot))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-gray-800 ${lexendClass}`}>
        Horarios de atención
      </h1>
      <div className="space-y-4">
        {timeSlots.map(({ day, startTime, endTime, available }) => (
          <div key={day} className="flex items-center justify-between py-2">
            <div className="w-40">
              <Interruptor
                dia={DAYS_SPANISH[day]}
                available={available}
                onChange={(isAvailable) =>
                  handleAvailabilityChange(day, isAvailable)
                }
                latoClass={latoClass}
              />
            </div>
            <div className="flex items-center gap-3">
              {available ? (
                <>
                  <CampoHora
                    time={startTime}
                    onChange={(time) =>
                      handleTimeChange(day, "startTime", time)
                    }
                    disabled={!editable}
                    latoClass={latoClass}
                  />
                  <span
                    className={`text-gray-600 text-lg font-medium ${latoClass}`}
                  >
                    a
                  </span>
                  <CampoHora
                    time={endTime}
                    onChange={(time) => handleTimeChange(day, "endTime", time)}
                    disabled={!editable}
                    latoClass={latoClass}
                  />
                </>
              ) : (
                <div
                  className="flex items-center justify-center"
                  style={{ width: "280px", height: "44px" }}
                >
                  <span
                    className={`text-gray-500 text-lg font-medium ${latoClass}`}
                  >
                    No atiende los {DAYS_SPANISH[day].toLowerCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
