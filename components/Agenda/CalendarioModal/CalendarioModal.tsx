import { PractitionerAppointment } from "@/app/definitions/definitions";
import { dayNames, isDiaDisponible, monthNames } from "@/app/utils/helperFunctions";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface CalendarioProps {
  onSelectDate: (date: Date) => void;
  initialDate: Date;
  onClose: () => void;
  disponibilidad: PractitionerAppointment[];
}

const CalendarioModal: React.FC<CalendarioProps> = ({
  onSelectDate,
  initialDate,
  onClose,
  disponibilidad,
}) => {
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth());
  const [isVisible, setIsVisible] = useState(false);
  const calendarRef = React.useRef<HTMLDivElement | null>(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const leadingEmptyDays = Array.from({ length: firstDayOfMonth }, () => "");
  const previousYear = month === 0 ? year - 1 : year;
  const daysInPreviousMonth = new Date(previousYear, month, 0).getDate();
  const totalCells = 42;
  const trailingEmptyDaysCount =
    totalCells - (leadingEmptyDays.length + daysArray.length);
  const trailingEmptyDays = Array.from(
    { length: trailingEmptyDaysCount },
    (_, i) => i + 1
  );
  const leadingDays = Array.from(
    { length: leadingEmptyDays.length },
    (_, i) => daysInPreviousMonth - leadingEmptyDays.length + i + 1
  );

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(year, month, day);
    onSelectDate(selectedDate);

    setIsVisible(false);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handlePreviousMonth = () => {
    if (month === 0) {
      setYear((prevYear) => prevYear - 1);
      setMonth(11);
    } else {
      setMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear((prevYear) => prevYear + 1);
      setMonth(0);
    } else {
      setMonth((prevMonth) => prevMonth + 1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);

        setTimeout(() => {
          onClose();
        }, 300);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    setIsVisible(true);

    return () => {
      setIsVisible(false);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 flex justify-center bg-[#D9E6E6] transition-transform 
    transform ${
      isVisible ? "translate-y-0" : "-translate-y-full"
    } duration-300`}
      ref={calendarRef}
    >
      <div>
        {/* Contenedor del calendario */}
        <div className="bg-[#D9E6E6] w-full max-w-screen-lg p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-2 bg-[#A4D4D4] h-11 rounded-xl">
            <div className="flex">
              <button onClick={handlePreviousMonth} className="mx-4">
                <Image
                  src="/arrow-left.svg"
                  alt="Logo"
                  width={10}
                  height={10}
                />
              </button>
            </div>

            <div className="font-bold">
              {monthNames[month]} {year}
            </div>
            <div className="flex">
              <button onClick={handleNextMonth} className="mx-4">
                <Image
                  src="/arrow-right.svg"
                  alt="Logo"
                  width={10}
                  height={10}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="flex items-center justify-center font-bold bg-[#A4D4D4] rounded-xl aspect-square"
              >
                {day}
              </div>
            ))}

            {leadingDays.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-2 text-gray-400 bg-[#A4D4D4] rounded-xl"
              >
                {day}
              </div>
            ))}

            {daysArray.map((day) => {
              const currentDay = new Date(year, month, day);
              const isSelected =
                currentDay.toDateString() === initialDate.toDateString();

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`p-2 aspect-square ${
                    isSelected
                      ? "rounded-full border-2 border-[#195858] bg-[#078B8C] text-white"
                      : "rounded-xl bg-[#A4D4D4]"
                  } ${
                    isDiaDisponible(disponibilidad, year, month, day)
                      ? "cursor-pointer font-bold"
                      : "cursor-not-allowed text-gray-500"
                  }`}
                  disabled={!isDiaDisponible(disponibilidad, year, month, day)}
                >
                  {day}
                </button>
              );
            })}

            {trailingEmptyDays.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-2 text-gray-400 bg-[#A4D4D4] rounded-xl h-10"
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Cratel Seleccionar Dia */}
        <div className="flex items-center justify-center h-14 bg-[#A4D4D4] rounded-b-3xl shadow-lg">
          <p className="">Por favor, seleccione un dia.</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarioModal;
