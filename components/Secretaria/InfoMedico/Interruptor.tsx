type Props = {
  dia: string;
  available: boolean;
  onChange: (isAvailable: boolean) => void;
  latoClass?: string;
};

export default function Interruptor({
  dia,
  available,
  onChange,
  latoClass = "",
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div
        onClick={() => onChange(!available)}
        className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          available ? "bg-teal-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            available ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
      <span
        className={`text-lg font-medium text-gray-700 w-20 text-left ${latoClass}`}
      >
        {dia}
      </span>
    </div>
  );
}
