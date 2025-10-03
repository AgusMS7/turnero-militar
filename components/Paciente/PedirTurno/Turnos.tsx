"use client";
import { useRef, useState } from "react";
import { Turno } from "@/app/definitions/definitions";

type Props = {
  turnos: Turno[];
  onSelect?: (turno: Turno) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  lexendClass?: string;
  interClass?: string;
};

export default function Turnos({
  turnos,
  onSelect,
  selectedDate,
  onSelectDate,
  lexendClass = "",
  interClass = "",
}: Props) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const getFormattedDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    }).format(date);
  };

  const formattedDate = getFormattedDate(selectedDate);

  return (
    <div className="flex flex-col w-full gap-6 flex-1">
      <div className="flex justify-between max-md:flex-col-reverse items-center gap-8">
        <h3
          className={`text-gray-900 capitalize font-semibold text-4xl max-md:text-2xl max-md:text-center ${lexendClass}`}
        >
          {formattedDate}
        </h3>
        <div className="relative">
          <button
            onClick={() => {
              const input = dateInputRef.current;
              if (!input) return;
              if (typeof input.showPicker === "function") input.showPicker();
              else {
                input.focus();
                input.click();
              }
            }}
            className={`flex items-center gap-3 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-bold text-2xl ${interClass}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Buscar turnos disponibles</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            className="absolute bottom-full right-0 mb-2 w-8 h-8 opacity-0 pointer-events-none"
            value={selectedDate}
            onChange={(e) => {
              onSelectDate(e.target.value);
              setSeleccionado(null);
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-[300px]">
        {turnos.length > 0 ? (
          <div className="grid grid-cols-6 max-md:flex max-md:flex-wrap gap-3">
            {turnos.map((turno) => (
              <button
                key={turno.horario}
                className={`px-4 py-3 rounded-lg border-2 font-normal max-md:m-auto max-md:w-full max-md:h-full text-2xl transition-all duration-200 hover:shadow-md ${interClass} ${
                  seleccionado === turno.horario
                    ? "bg-teal-600 text-white border-teal-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-teal-300"
                }`}
                onClick={() => {
                  setSeleccionado(turno.horario);
                  if (onSelect) onSelect(turno);
                }}
              >
                {turno.horario}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3
                className={`font-semibold text-gray-700 mb-2 text-2xl ${interClass}`}
              >
                No hay turnos disponibles
              </h3>
              <p className={`text-gray-500 font-normal text-2xl ${interClass}`}>
                No se encontraron horarios disponibles para esta fecha.
                <br />
                Intenta seleccionar otra fecha.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
