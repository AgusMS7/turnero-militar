"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartOptions } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  annotationPlugin,
  Title,
  Tooltip,
  Legend
);

type Barra = { nombre: string; cantidad: number };

interface Props {
  barra: Barra[];
}

export default function ContenedorGraficoBarras({barra}: Props) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    month: "long",
    day: "numeric",
  });

  const dataValues = barra.map((b) => b.cantidad);
  const labels = barra.map((b) => b.nombre);

  //Logica para hacer que el color de la barra mas grande cambie
  const maxValue = Math.max(...dataValues);
  const backgroundColors = dataValues.map((value) =>
    value === maxValue ? "#078B8C" : "#D9E6E6"
  );

  //Logica para calcular el promedio de pacientes atendidos
  const total = dataValues.reduce((acc, value) => acc + value, 0);
  const average = total / dataValues.length;

  const yMaxValue = maxValue > 20 ? Math.ceil(maxValue / 5) * 5 : 20;

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Pacientes atendidos",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderRadius: 4,
        barThickness: 25,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: yMaxValue,
        ticks: {
          stepSize: 5,
          color: "#666",
        },
        grid: {
          color: "rgba(0, 0, 0, 0)",
        },
      },
      x: {
        ticks: {
          color: "#666",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      annotation: {
        annotations: {
          averageLine: {
            type: "line",
            yMin: average, // La posición del promedio
            yMax: average,
            borderColor: "#4C4C4C",
            borderWidth: 1,
            borderDash: [6, 6],
          },
          promText: {
            type: "label",
            xValue: 3, // Esto debe ser el índice de la barra del promedio
            yValue: average, // La posición en el eje Y
            backgroundColor: "transparent",
            color: "#4C4C4C", // Color del texto
            content: "prom.",
            font: {
              size: 12,
              weight: "bold",
            },
            xAdjust: 99, // Ajusta la posición horizontal del texto
            yAdjust: -7, // Ajusta la distancia del texto respecto a la barra
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-1/2">
      {/* Encabezado */}
      <h2 className="text-gray-700 mb-4">Pacientes Atendidos</h2>

      {/* Cantidad de pacientes y fecha */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-teal-600 text-lg font-bold">{total} Pacientes</h1>
        <span className="text-gray-500 text-sm mt-0.5">
          Hoy, {formattedDate}
        </span>
      </div>

      {/* Gráfico */}
      <div className="relative h-32 mt-2">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
