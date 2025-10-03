export default function Cargando() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col justify-center gap-2 items-center bg-white shadow-md shadow-gray-500 md:w-xl w-11/12 h-44 rounded-2xl">
        <img className="w-10 h-10 animate-spin" src="/hourglass.svg" />
        <p className="md:text-3xl text-xl">Cargando...</p>
      </div>
    </div>
  );
}
