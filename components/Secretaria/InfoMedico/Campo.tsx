interface Props {
  width: string;
  label: string;
  value: string;
  latoClass?: string;
}

export default function Campo({ width, label, value, latoClass = "" }: Props) {
  return (
    <div className={`${width}`}>
      <label
        className={`block text-sm font-medium text-gray-700 mb-2 ${latoClass}`}
      >
        {label}
      </label>
      <div
        className={`p-3 border border-gray-300 rounded-lg text-base bg-gray-50 text-gray-800 ${latoClass}`}
      >
        {value}
      </div>
    </div>
  );
}
