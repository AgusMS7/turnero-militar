"use client";

import TurnosDisponibles from "@/components/Paciente/PedirTurno/TurnosDisponibles";
import React from "react";

export default function turno() {
  return (
    <div className="flex justify-center items-center bg-teal-600/20 w-full min-h-screen">
      <TurnosDisponibles />
    </div>
  );
}
