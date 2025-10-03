export default function AgendaSkeleton() {
    const startHour = 7;
    const endHour = 23;
    const intervals = (endHour - startHour + 1) * 2;
  return (
    <div className="flex-grow overflow-y-auto relative">
      {Array.from({ length: intervals }).map((_, i) => (
        <div key={i} className="h-12 border-b flex items-center px-1 gap-1 mb-2">
          <div className="skeleton h-12 w-20 bg-[#A4D4D4] rounded-md"></div>
          <div className="skeleton h-12 w-full bg-[#A4D4D4] rounded-md"></div>
        </div>
      ))}
    </div>
  );
}