type Props = {
  time: string;
  onChange?: (time: string) => void;
  disabled?: boolean;
  latoClass?: string;
};

export default function CampoHora({
  time,
  onChange,
  disabled = false,
  latoClass = "",
}: Props) {
  return (
    <div
      className={`border border-gray-300 rounded-lg flex items-center px-3 py-2 bg-white ${
        disabled ? "opacity-50 bg-gray-100" : ""
      }`}
    >
      <input
        type="time"
        value={time}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`text-lg bg-transparent outline-none font-medium text-gray-700 w-full ${latoClass}`}
      />
    </div>
  );
}
