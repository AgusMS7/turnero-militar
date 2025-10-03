"use client";

interface BarraHorizontalProps {
  porcentajeString: string;
  titulo: string;
  color: string;
}

export default function BarraHorizontal({
  porcentajeString,
  titulo,
  color,
}: BarraHorizontalProps) {
  const porcentaje: number = parseFloat(porcentajeString);
  const porcentajeAjustado = Math.max(0, Math.min(porcentaje, 100));

  return (
    <div className="p-2 mt-2">
      <h2 className="text-xl font-bold mb-2">{porcentajeAjustado}%</h2>
      <h2 className="font-bold mb-2 text-gray-700">{titulo}</h2>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${porcentajeAjustado}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
}
