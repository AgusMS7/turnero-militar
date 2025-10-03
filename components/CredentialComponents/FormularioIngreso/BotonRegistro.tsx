"use client";
import React from "react";

interface Props {
  texto: string;
  onClick: () => void;
}

const BotonRegistro: React.FC<Props> = ({ texto, onClick }) => {
  const loading = texto.includes("Cargando");
  return (
    <div
      onClick={loading ? () => {} : onClick} // No ejecutar onClick si está cargando
      className={`w-4/5 cursor-pointer ${
        loading ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <div className="h-[60px] w-full flex items-center justify-center">
        <div
          className={`w-full h-[60px] p-4 bg-[#078B8C] rounded-lg flex items-center justify-center ${
            loading ? "opacity-50" : ""
          }`}
        >
          <span className="text-white text-xl font-normal leading-7">
            {texto}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BotonRegistro;