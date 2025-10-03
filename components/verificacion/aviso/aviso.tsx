"use client";
import React from "react";

interface AvisoProps {
  onRedClick?: () => void;
  onGreenClick?: () => void;
  title?: string;
  message?: string;
}

export default function Aviso({
  onRedClick,
  onGreenClick,
  title = "¡Verificación exitosa!",
  message,
}: AvisoProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className="bg-[#F1F1F1] rounded-2xl p-12 max-w-md w-full text-center shadow-lg border pointer-events-auto"
        style={{ animation: "fadeInScale 0.4s cubic-bezier(.4,0,.2,1)" }}
      >
        <h3 className="text-xl font-bold text-[#078B8C] mb-4">{title}</h3>
        {message ? (
          <p className="mb-6 text-base text-gray-700 leading-relaxed">{message}</p>
        ) : (
          <>
            <p className="mb-3 text-base text-gray-700 leading-relaxed">
              Se le asignó un horario de atención por defecto: <br />
              <span className="font-semibold text-[#078B8C]">
                Lunes a viernes de 9:00 a 18:00 hs.
              </span>
            </p>
            <p className="mb-3 text-base text-gray-700 leading-relaxed">
              Por defecto, su obra social es{" "}
              <span className="font-semibold text-[#078B8C]">Particular</span> con precio{" "}
              <span className="font-semibold text-[#078B8C]">$0</span>.
            </p>
            <p className="mb-6 text-base text-gray-700 leading-relaxed">
              Si desea cambiar estos valores o su horario de atención seleccione{" "}
              <span className="italic text-[#078B8C]">turnero</span>.
            </p>
          </>
        )}
        <div className="flex justify-center gap-6">
          <button
            onClick={onRedClick}
            className="transition-all duration-150 border-2 border-[#078B8C] bg-white text-[#078B8C] font-semibold py-2 px-6 rounded-lg shadow hover:bg-[#E4ECEC] hover:scale-105"
          >
            Inicio
          </button>
          <button
            onClick={onGreenClick}
            className="transition-all duration-150 border-2 border-[#A4D4D4] bg-white text-[#48a7a8] font-semibold py-2 px-6 rounded-lg shadow hover:bg-[#A4D4D4] hover:text-[#078B8C] hover:scale-105"
          >
            Turnero
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}