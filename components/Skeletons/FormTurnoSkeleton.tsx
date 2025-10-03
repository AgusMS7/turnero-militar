export default function FormTurnoSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-[#A4D4D4] bg-[#F1F1F1] p-3">
      <div className="flex justify-start gap-2">
        <div className="animate-pulse">
          <div className="w-[70px] h-[70px] rounded-full bg-gray-500" />
        </div>
        <div className="w-full flex flex-col items-start justify-center animate-pulse space-y-2">
          <div className="animate-pulse bg-gray-500 w-2/3 h-6" />
          <div className=" bg-gray-500 w-1/2 h-4" />
          <div className=" bg-gray-500 w-1/2 h-4" />
        </div>
      </div>
      <div className="space-y-2 mt-4 animate-pulse">
        <div className=" bg-gray-500 w-1/4 h-4" />
        <div className=" bg-gray-500 w-full h-10" />
        <div className=" bg-gray-500 w-1/4 h-4" />
        <div className=" bg-gray-500 w-full h-10" />
        <div className=" bg-gray-500 w-1/4 h-4" />
        <div className=" bg-gray-500 w-full h-10" />
        <div className=" bg-gray-500 w-1/4 h-4" />
        <div className=" bg-gray-500 w-full h-10" />
      </div>
      <div className="flex justify-between mt-4 animate-pulse">
        <div className=" bg-gray-500 w-1/4 h-8" />
        <div className=" bg-gray-500 w-1/4 h-8" />
      </div>

    </div>
  );
}
