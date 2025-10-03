type Props = {
  day: string;
  value: boolean;
};

export default function DayCard({ day, value }: Props) {
  return (
    <div
      className={`text-2xl px-6 py-2 border-2 rounded-sm ${
        value
          ? "text-teal-950 border-teal-700 bg-teal-700/70"
          : "text-gray-500 border-gray-300 bg-gray-200"
      }`}
    >
      {day}
    </div>
  );
}
