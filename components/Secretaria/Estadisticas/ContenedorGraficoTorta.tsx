"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import BarraHorizontal from "./BarraHorizontal";

Chart.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "80%",
  plugins: {
    legend: {
      display: false,
    },
  },
};

type Props = {
  torta: {
    turnosCompletados: number;
    turnosCancelados: number;
  }
};

export default function ContenedorGraficoTortas({
  torta
}: Props) {
  const turnosCompletados = torta.turnosCompletados;
  const turnosCancelados = torta.turnosCancelados;
  
  const totalTurnos = turnosCompletados + turnosCancelados;

  const porcentajeCompletados = totalTurnos
    ? ((turnosCompletados / totalTurnos) * 100).toFixed(2)
    : "0.00";
  const porcentajeCancelados = totalTurnos
    ? ((turnosCancelados / totalTurnos) * 100).toFixed(2)
    : "0.00";

  const data = {
    labels: ["Turnos atendidos", "Turnos cancelados"],
    datasets: [
      {
        data: [turnosCompletados, turnosCancelados],
        backgroundColor: ["#008080", "#70AD47"],
        hoverBackgroundColor: ["#006666", "#5C8E3D"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-1/2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-500 text-base ">Turnos totales</h2>
      </div>

      <h2 className="text-black text-xl font-bold mb-4">
        {totalTurnos} turnos
      </h2>

      <div>
        <Doughnut data={data} options={options} />
      </div>

      <div>
        <BarraHorizontal
          porcentajeString={porcentajeCompletados}
          titulo={"Turnos atendidos"}
          color={"#078B8C"}
        />
        <BarraHorizontal
          porcentajeString={porcentajeCancelados}
          titulo={"Turnos cancelados"}
          color={"#6DB52A"}
        />
      </div>
    </div>
  );
}
