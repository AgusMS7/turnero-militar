interface Props {
  titulo: string;
  texto: string;
}

export default function SinDatos({ titulo, texto }: Props) {
  return (
    <div className="flex flex-col items-center w-1/2 max-md:w-xs m-auto justify-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-gray-700">{titulo}</h2>
      <p className="text-sm text-gray-500 max-w-sm w-2/3">{texto}</p>
    </div>
  );
}
